import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { generateICSContent } from '@/lib/ics';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { jsonError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const locale = searchParams.get('locale') || 'en';

    if (!city) {
      return jsonError(400, 'BAD_REQUEST', 'City parameter is required');
    }

    const decodedCity = decodeURIComponent(city);

    if (!validateCityInput(decodedCity)) {
      return jsonError(400, 'INVALID_CITY', 'City parameter is too long');
    }

    const sanitizedCity = sanitizeCityInput(decodedCity);

    try {
      const cacheKey = makeCacheKey('ics', [sanitizedCity.toLowerCase(), locale]);
      const icsContent = await withServerCache(cacheKey, 30 * 60 * 1000, async () => {
        const weatherEvents = await getWeatherByCity(sanitizedCity, 15);
        return generateICSContent(weatherEvents, sanitizedCity, locale);
      });

      const buffer = Buffer.from(icsContent, 'utf-8');

      const headers = new Headers();
      headers.set('Content-Type', 'text/calendar; charset=utf-8');
      headers.set('Content-Disposition', 'attachment; filename="calendar.ics"');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new NextResponse(buffer, {
        status: 200,
        headers,
      });
    } catch (weatherError: unknown) {
      if (weatherError instanceof Error && weatherError.message?.includes('not found')) {
        return jsonError(404, 'CITY_NOT_FOUND', `City not found: ${sanitizedCity}`);
      }

      throw weatherError;
    }
  } catch (error) {
    console.error('Error generating ICS:', error);

    return jsonError(500, 'INTERNAL_ERROR', 'Failed to generate calendar');
  }
}
