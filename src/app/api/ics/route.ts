import { NextRequest, NextResponse } from 'next/server';

interface WeatherEvent {
  date: Date;
  temperature: string;
  condition: string;
  emoji: string;
}

function getWeatherEmoji(condition: string): string {
  const emojiMap: Record<string, string> = {
    '晴': '☀️',
    '多云': '☁️',
    '阴': '🌥️',
    '小雨': '🌧️',
    '中雨': '🌧️',
    '大雨': '⛈️',
    '雷阵雨': '⛈️',
    '雪': '❄️',
    '雾': '🌫️',
  };
  return emojiMap[condition] || '🌡️';
}

function generateMockWeather(city: string): WeatherEvent[] {
  const events: WeatherEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const conditions = ['晴', '多云', '阴', '小雨', '中雨', '晴', '多云'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(18 + Math.random() * 15);
    
    events.push({
      date,
      temperature: `${temp}°C`,
      condition,
      emoji: getWeatherEmoji(condition),
    });
  }
  
  return events;
}

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

    const summary = `${event.emoji} ${event.temperature}`;
    const description = locale === 'zh'
      ? `${city} - ${displayDate} ${event.condition}, ${event.temperature}`
      : `${city} - ${displayDate} ${event.condition}, ${event.temperature}`;

    ics += `BEGIN:VEVENT
UID:${eventDate}-${city}@weatherincalendar.com
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
    const weatherEvents = generateMockWeather(decodedCity);
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
  } catch (error) {
    console.error('Error generating ICS:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}