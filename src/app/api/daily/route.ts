import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { jsonError } from '@/lib/api-response';
import { createRequestId, logApiError, logApiEvent, sanitizeForLog } from '@/lib/observability';

export async function GET(request: NextRequest) {
    const startedAt = Date.now();
    const requestId = createRequestId();

    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const locale = searchParams.get('locale') || 'en';
        const daysParam = searchParams.get('days');
        const days = daysParam ? parseInt(daysParam) : 7;

        if (!city) {
            return jsonError(400, 'BAD_REQUEST', 'City parameter is required', { 'X-Request-Id': requestId });
        }

        let decodedCity: string;
        try {
            decodedCity = decodeURIComponent(city);
        } catch {
            return jsonError(400, 'INVALID_CITY', 'Invalid city parameter encoding', { 'X-Request-Id': requestId });
        }

        if (!validateCityInput(decodedCity)) {
            return jsonError(400, 'INVALID_CITY', 'City parameter is too long', { 'X-Request-Id': requestId });
        }

        const sanitizedCity = sanitizeCityInput(decodedCity);

        try {
            const cacheKey = makeCacheKey('daily', [sanitizedCity.toLowerCase(), days]);
            const weatherEvents = await withServerCache(cacheKey, 30 * 60 * 1000, () =>
                getWeatherByCity(sanitizedCity, days)
            );

            logApiEvent('daily', requestId, {
                city: sanitizeForLog(sanitizedCity),
                locale,
                days: weatherEvents.length,
                durationMs: Date.now() - startedAt,
            });

            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            headers.set('Cache-Control', 'public, max-age=3600');
            headers.set('X-Request-Id', requestId);
            headers.set('Server-Timing', `total;dur=${Date.now() - startedAt}`);

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
                return jsonError(404, 'CITY_NOT_FOUND', `City not found: ${sanitizedCity}`, { 'X-Request-Id': requestId });
            }
            throw weatherError;
        }
    } catch (error) {
        logApiError('daily', requestId, error);
        return jsonError(500, 'INTERNAL_ERROR', 'Failed to fetch daily weather forecast', { 'X-Request-Id': requestId });
    }
}
