import { NextRequest, NextResponse } from 'next/server';
import { getHourlyWeatherByCity, HourlyWeather } from '@/lib/qweather';
import { validateCityInput, sanitizeCityInput } from '@/lib/validation';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { jsonError } from '@/lib/api-response';
import { createRequestId, logApiError, logApiEvent, sanitizeForLog } from '@/lib/observability';

const hourlyFormatters = new Map<string, Intl.DateTimeFormat>();

function getHourlyFormatter(locale: string): Intl.DateTimeFormat {
  const key = locale === 'zh' ? 'zh-CN' : 'en-US';
  if (!hourlyFormatters.has(key)) {
    hourlyFormatters.set(key, new Intl.DateTimeFormat(key, {
      hour: '2-digit',
      minute: '2-digit',
    }));
  }
  return hourlyFormatters.get(key)!;
}

function formatHourlyWeather(hourly: HourlyWeather[], locale: string) {
  const formatter = getHourlyFormatter(locale);

  return hourly.map((hour) => {
    const timeStr = formatter.format(hour.time);

    return {
      time: timeStr,
      isoTime: hour.time.toISOString(),
      temp: hour.temp,
      condition: hour.condition,
      emoji: hour.emoji,
      wind: {
        direction: hour.windDir,
        direction360: hour.wind360,
        scale: hour.windScale,
        speed: hour.windSpeed,
      },
      humidity: hour.humidity,
      precipitationProbability: hour.pop,
      precipitation: hour.precip,
      pressure: hour.pressure,
      cloud: hour.cloud,
      dewPoint: hour.dew,
    };
  });
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const locale = searchParams.get('locale') || 'en';
    const hoursParam = searchParams.get('hours');
    const hours = hoursParam ? parseInt(hoursParam) : 24;

    if (!city) {
      return jsonError(400, 'BAD_REQUEST', 'City parameter is required', { 'X-Request-Id': requestId });
    }

    if (hours && (hours < 1 || hours > 168)) {
      return jsonError(400, 'BAD_REQUEST', 'Hours parameter must be between 1 and 168', { 'X-Request-Id': requestId });
    }

    const decodedCity = decodeURIComponent(city);

    if (!validateCityInput(decodedCity)) {
      return jsonError(400, 'INVALID_CITY', 'City parameter is too long', { 'X-Request-Id': requestId });
    }

    const sanitizedCity = sanitizeCityInput(decodedCity);

    try {
      const cacheKey = makeCacheKey('hourly', [sanitizedCity.toLowerCase(), hours, locale]);
      const hourlyWeather = await withServerCache(cacheKey, 15 * 60 * 1000, () =>
        getHourlyWeatherByCity(sanitizedCity, hours)
      );
      const formattedWeather = formatHourlyWeather(hourlyWeather, locale);

      logApiEvent('hourly', requestId, {
        city: sanitizeForLog(sanitizedCity),
        locale,
        hours: hourlyWeather.length,
        durationMs: Date.now() - startedAt,
      });

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      headers.set('Cache-Control', 'public, max-age=1800');
      headers.set('X-Request-Id', requestId);
      headers.set('Server-Timing', `total;dur=${Date.now() - startedAt}`);

      return NextResponse.json({
        city: sanitizedCity,
        locale,
        hours: hourlyWeather.length,
        forecast: formattedWeather,
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
    logApiError('hourly', requestId, error);
    return jsonError(500, 'INTERNAL_ERROR', 'Failed to generate hourly weather forecast', { 'X-Request-Id': requestId });
  }
}
