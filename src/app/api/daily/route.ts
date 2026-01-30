import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const locale = searchParams.get('locale') || 'en';
        const daysParam = searchParams.get('days');
        const days = daysParam ? parseInt(daysParam) : 7;

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
            const weatherEvents = await getWeatherByCity(sanitizedCity, days);

            return NextResponse.json({
                city: sanitizedCity,
                locale,
                days: weatherEvents.length,
                forecast: weatherEvents,
            }, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600',
                },
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
        console.error('Error fetching daily weather:', error);

        return NextResponse.json(
            { error: 'Failed to fetch daily weather forecast' },
            { status: 500 }
        );
    }
}
