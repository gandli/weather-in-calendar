import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity, WeatherEvent, validateCityInput } from '@/lib/qweather';

const dateFormatters: Record<string, Intl.DateTimeFormat> = {};

function sanitizeInput(str: string): string {
  // Remove control characters (including newlines) to prevent CRLF injection
  return str.replace(/[\x00-\x1F\x7F]/g, '');
}

function getDateFormatter(locale: string): Intl.DateTimeFormat {
  const key = locale === 'zh' ? 'zh-CN' : 'en-US';
  if (!dateFormatters[key]) {
    dateFormatters[key] = new Intl.DateTimeFormat(key, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return dateFormatters[key];
}

function generateICSContent(events: WeatherEvent[], city: string, locale: string): string {
  const formatDate = (date: Date) => {
    const iso = date.toISOString();
    return iso.substring(0, 4) + iso.substring(5, 7) + iso.substring(8, 10) + 'T' +
           iso.substring(11, 13) + iso.substring(14, 16) + iso.substring(17, 19) + 'Z';
  };

  const now = new Date();
  const dtStamp = formatDate(now);

  const dateFormatter = getDateFormatter(locale);

  const icsParts: string[] = [];

  icsParts.push(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Weather in Calendar//Weather Forecast//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${locale === 'zh' ? `${city}天气日历` : `${city} Weather Calendar`}
X-WR-CALDESC:${locale === 'zh' ? `${city}未来14天天气预报` : `14-day weather forecast for ${city}`}
X-WR-TIMEZONE:Asia/Shanghai
X-WR-CALDESC:Weather forecast calendar
`);

  events.forEach((event) => {
    const eventDate = formatDate(event.date);
    const displayDate = dateFormatter.format(event.date);

    const summary = `${event.emoji} ${event.tempLow}°~${event.tempHigh}°`;

    const description = locale === 'zh'
      ? `${city} - ${displayDate}\\n天气: ${event.condition}\\n温度: ${event.tempLow}°C ~ ${event.tempHigh}°C`
      : `${city} - ${displayDate}\\nWeather: ${event.condition}\\nTemperature: ${event.tempLow}°C ~ ${event.tempHigh}°C`;

    icsParts.push(`BEGIN:VEVENT
UID:${eventDate}-${city}@weather-in-calendar
DTSTAMP:${dtStamp}
DTSTART;VALUE=DATE:${eventDate.slice(0, 8)}
DTEND;VALUE=DATE:${eventDate.slice(0, 8)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${city}
CATEGORIES:Weather
END:VEVENT
`);
  });

  icsParts.push(`END:VCALENDAR`);

  return icsParts.join('');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const locale = searchParams.get('locale') || 'en';

    const validationError = validateCityInput(city);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const decodedCity = decodeURIComponent(city);
    const sanitizedCity = sanitizeInput(decodedCity);

    try {
      const weatherEvents = await getWeatherByCity(sanitizedCity, 15);
      const icsContent = generateICSContent(weatherEvents, sanitizedCity, locale);

      const buffer = Buffer.from(icsContent, 'utf-8');

      const headers = new Headers();
      headers.set('Content-Type', 'text/calendar; charset=utf-8');
      headers.set('Content-Disposition', 'attachment; filename="calendar.ics"');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new NextResponse(buffer, {
        status: 200,
        headers,
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
    console.error('Error generating ICS:', error);

    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}
