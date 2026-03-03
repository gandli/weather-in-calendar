import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { jsonError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return jsonError(400, 'BAD_REQUEST', 'City parameter is required');
  }

  const decodedCity = decodeURIComponent(city);

  if (!validateCityInput(decodedCity)) {
    return jsonError(400, 'INVALID_CITY', 'City parameter is too long');
  }

  const sanitizedCity = sanitizeCityInput(decodedCity);

  try {
    const cacheKey = makeCacheKey('weather', [sanitizedCity.toLowerCase(), 15]);
    const weatherEvents = await withServerCache(cacheKey, 30 * 60 * 1000, () =>
      getWeatherByCity(sanitizedCity, 15)
    );

    return NextResponse.json(weatherEvents, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=1800',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('not found')) {
      return jsonError(404, 'CITY_NOT_FOUND', `City not found: ${sanitizedCity}`);
    }
    console.error('Error fetching weather:', error);
    return jsonError(500, 'INTERNAL_ERROR', 'Failed to fetch weather data');
  }
}
