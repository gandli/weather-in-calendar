import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity, validateCityInput } from '@/lib/qweather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  const validationError = validateCityInput(city);
  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const decodedCity = decodeURIComponent(city);

  try {
    const weatherEvents = await getWeatherByCity(decodedCity, 15);
    return NextResponse.json(weatherEvents);
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('not found')) {
      return NextResponse.json(
        { error: `City not found: ${decodedCity}` },
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
