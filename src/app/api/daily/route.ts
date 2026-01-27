import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity, validateCityInput } from '@/lib/qweather';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const locale = searchParams.get('locale') || 'en';
        const daysParam = searchParams.get('days');
        const days = daysParam ? parseInt(daysParam) : 7;

        const validationError = validateCityInput(city);
        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }

        const decodedCity = decodeURIComponent(city);

        try {
            const weatherEvents = await getWeatherByCity(decodedCity, days);

            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            headers.set('Cache-Control', 'public, max-age=3600');

            return NextResponse.json({
                city: decodedCity,
                locale,
                days: weatherEvents.length,
                forecast: weatherEvents,
            }, {
                status: 200,
                headers,
            });
        } catch (weatherError: unknown) {
            if (weatherError instanceof Error && weatherError.message?.includes('not found')) {
                return NextResponse.json(
                    { error: `City not found: ${decodedCity}` },
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
