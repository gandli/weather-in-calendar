import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity, WeatherEvent } from '@/lib/qweather';

function generateICSContent(events: WeatherEvent[], city: string, locale: string): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const today = new Date();
  const year = today.getFullYear();

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Weather in Calendar//Weather Forecast//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${locale === 'zh' ? `${city}天气日历` : `${city} Weather Calendar`}
X-WR-CALDESC:${locale === 'zh' ? `${city}未来14天天气预报` : `14-day weather forecast for ${city}`}
X-WR-TIMEZONE:Asia/Shanghai
X-WR-CALDESC:Weather forecast calendar
`;

  events.forEach((event) => {
    const eventDate = formatDate(event.date);
    const displayDate = formatDateDisplay(event.date);

    const summary = `${event.emoji} ${event.tempLow}°~${event.tempHigh}°`;

    const description = locale === 'zh'
      ? `${city} - ${displayDate}\\n天气: ${event.condition}\\n温度: ${event.tempLow}°C ~ ${event.tempHigh}°C`
      : `${city} - ${displayDate}\\nWeather: ${event.condition}\\nTemperature: ${event.tempLow}°C ~ ${event.tempHigh}°C`;

    ics += `BEGIN:VEVENT
UID:${eventDate}-${city}@weather-in-calendar
DTSTAMP:${formatDate(new Date())}
DTSTART;VALUE=DATE:${eventDate.slice(0, 8)}
DTEND;VALUE=DATE:${eventDate.slice(0, 8)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${city}
CATEGORIES:Weather
END:VEVENT
`;
  });

  ics += `END:VCALENDAR`;

  return ics;
}

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

    try {
      const weatherEvents = await getWeatherByCity(decodedCity);
      const icsContent = generateICSContent(weatherEvents, decodedCity, locale);

      const buffer = Buffer.from(icsContent, 'utf-8');

      const headers = new Headers();
      headers.set('Content-Type', 'text/calendar; charset=utf-8');
      headers.set('Content-Disposition', 'attachment; filename="calendar.ics"');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new NextResponse(buffer, {
        status: 200,
        headers,
      });
    } catch (weatherError: any) {
      if (weatherError.message?.includes('not found')) {
        return NextResponse.json(
          { error: `City not found: ${decodedCity}` },
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
