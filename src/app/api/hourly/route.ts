import { NextRequest, NextResponse } from 'next/server';
import { getHourlyWeatherByCity, HourlyWeather } from '@/lib/qweather';

function formatHourlyWeather(hourly: HourlyWeather[], locale: string) {
  const formatter = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

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
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const locale = searchParams.get('locale') || 'en';
    const hoursParam = searchParams.get('hours');
    const hours = hoursParam ? parseInt(hoursParam) : 24;

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    if (hours && (hours < 1 || hours > 168)) {
      return NextResponse.json(
        { error: 'Hours parameter must be between 1 and 168' },
        { status: 400 }
      );
    }

    const decodedCity = decodeURIComponent(city);

    try {
      const hourlyWeather = await getHourlyWeatherByCity(decodedCity, hours);
      const formattedWeather = formatHourlyWeather(hourlyWeather, locale);

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      headers.set('Cache-Control', 'public, max-age=1800');

      return NextResponse.json({
        city: decodedCity,
        locale,
        hours: hourlyWeather.length,
        forecast: formattedWeather,
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
    console.error('Error generating hourly weather:', error);

    return NextResponse.json(
      { error: 'Failed to generate hourly weather forecast' },
      { status: 500 }
    );
  }
}
