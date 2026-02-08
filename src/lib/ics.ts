import { WeatherEvent } from '@/lib/qweather';

const dateFormatters: Record<string, Intl.DateTimeFormat> = {};

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

function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

export function formatDate(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

export function generateICSContent(events: WeatherEvent[], city: string, locale: string): string {
  const now = new Date();
  const dtStamp = formatDate(now);

  const dateFormatter = getDateFormatter(locale);

  let icsContent = `BEGIN:VCALENDAR
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
    const displayDate = dateFormatter.format(event.date);

    const summary = `${event.emoji} ${event.tempLow}°~${event.tempHigh}°`;

    const description = locale === 'zh'
      ? `${city} - ${displayDate}\\n天气: ${event.condition}\\n温度: ${event.tempLow}°C ~ ${event.tempHigh}°C`
      : `${city} - ${displayDate}\\nWeather: ${event.condition}\\nTemperature: ${event.tempLow}°C ~ ${event.tempHigh}°C`;

    icsContent += `BEGIN:VEVENT
UID:${eventDate}-${city}@weather-in-calendar
DTSTAMP:${dtStamp}
DTSTART;VALUE=DATE:${eventDate.slice(0, 8)}
DTEND;VALUE=DATE:${eventDate.slice(0, 8)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${city}
CATEGORIES:Weather
END:VEVENT
`;
  });

  icsContent += `END:VCALENDAR`;

  return icsContent;
}
