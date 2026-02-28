import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { generateICSContent } from '@/lib/ics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const locale = searchParams.get('locale') || 'en';

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const decodedCity = decodeURIComponent(city);

    if (!validateCityInput(decodedCity)) {
      return NextResponse.json(
        { error: 'City parameter is too long' },
        { status: 400 }
      );
    }

    const sanitizedCity = sanitizeCityInput(decodedCity);

    try {
      const weatherEvents = await getWeatherByCity(sanitizedCity, 15);
      const icsContent = generateICSContent(weatherEvents, sanitizedCity, locale);

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
        return NextResponse.json(
          { error: `City not found: ${sanitizedCity}` },
          { status: 404 }
        );
      }

      throw weatherError;
    }
  } catch (error) {
    console.error('Error generating ICS:', error);

    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}
