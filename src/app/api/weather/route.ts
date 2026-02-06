import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

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

    // Cache for 1 hour, stale-while-revalidate for 10 minutes
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');

    return NextResponse.json(weatherEvents, { headers });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('not found')) {
      return NextResponse.json(
        { error: `City not found: ${sanitizedCity}` },
        { status: 404 }
      );
    }
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
