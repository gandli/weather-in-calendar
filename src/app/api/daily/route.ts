import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { jsonError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const locale = searchParams.get('locale') || 'en';
        const daysParam = searchParams.get('days');
        const days = daysParam ? parseInt(daysParam) : 7;

        if (!city) {
            return jsonError(400, 'BAD_REQUEST', 'City parameter is required');
        }

        let decodedCity: string;
        try {
            decodedCity = decodeURIComponent(city);
        } catch {
            return jsonError(400, 'INVALID_CITY', 'Invalid city parameter encoding');
        }

        if (!validateCityInput(decodedCity)) {
            return jsonError(400, 'INVALID_CITY', 'City parameter is too long');
        }

        const sanitizedCity = sanitizeCityInput(decodedCity);

        try {
            const cacheKey = makeCacheKey('daily', [sanitizedCity.toLowerCase(), days]);
            const weatherEvents = await withServerCache(cacheKey, 30 * 60 * 1000, () =>
                getWeatherByCity(sanitizedCity, days)
            );

            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            headers.set('Cache-Control', 'public, max-age=3600');

            return NextResponse.json({
                city: sanitizedCity,
                locale,
                days: weatherEvents.length,
                forecast: weatherEvents,
            }, {
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
        console.error('Error fetching daily weather:', error);

        return jsonError(500, 'INTERNAL_ERROR', 'Failed to fetch daily weather forecast');
    }
}
