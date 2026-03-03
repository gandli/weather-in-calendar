import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { jsonError } from '@/lib/api-response';
import { createRequestId, logApiError, logApiEvent, sanitizeForLog } from '@/lib/observability';

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();
  const baseHeaders = {
    'X-Request-Id': requestId,
    'Server-Timing': `total;dur=${Date.now() - startedAt}`,
  };

  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return jsonError(400, 'BAD_REQUEST', 'City parameter is required', baseHeaders);
  }

  const decodedCity = decodeURIComponent(city);

  if (!validateCityInput(decodedCity)) {
    return jsonError(400, 'INVALID_CITY', 'City parameter is too long', baseHeaders);
  }

  const sanitizedCity = sanitizeCityInput(decodedCity);

  try {
    const cacheKey = makeCacheKey('weather', [sanitizedCity.toLowerCase(), 15]);
    const weatherEvents = await withServerCache(cacheKey, 30 * 60 * 1000, () =>
      getWeatherByCity(sanitizedCity, 15)
    );

    logApiEvent('weather', requestId, {
      city: sanitizeForLog(sanitizedCity),
      count: weatherEvents.length,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(weatherEvents, {
      headers: {
        ...baseHeaders,
        'Server-Timing': `total;dur=${Date.now() - startedAt}`,
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=1800',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('not found')) {
      return jsonError(404, 'CITY_NOT_FOUND', `City not found: ${sanitizedCity}`, baseHeaders);
    }
    logApiError('weather', requestId, error, { city: sanitizeForLog(sanitizedCity) });
    return jsonError(500, 'INTERNAL_ERROR', 'Failed to fetch weather data', baseHeaders);
  }
}
