interface QWeatherLocation {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
  tz: string;
  type: string;
  rank: string;
}

interface QWeatherLocationResponse {
  code: string;
  location: QWeatherLocation[];
}

interface QWeatherForecastDay {
  fxDate: string;
  tempMax: string;
  tempMin: string;
  textDay: string;
  iconDay: string;
  textNight: string;
  iconNight: string;
  windDirDay: string;
  windScaleDay: string;
  humidity: string;
  precip: string;
}

interface QWeatherForecastResponse {
  code: string;
  daily: QWeatherForecastDay[];
}

interface QWeatherHourlyForecast {
  fxTime: string;
  temp: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  pop: string;
  precip: string;
  pressure: string;
  cloud: string;
  dew: string;
}

interface QWeatherHourlyResponse {
  code: string;
  hourly: QWeatherHourlyForecast[];
}

interface QWeatherNow {
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  dew: string;
}

interface QWeatherNowResponse {
  code: string;
  now: QWeatherNow;
}

export interface WeatherEvent {
  date: Date;
  tempHigh: number;
  tempLow: number;
  condition: string;
  emoji: string;
}

export interface HourlyWeather {
  time: Date;
  temp: number;
  condition: string;
  emoji: string;
  wind360: number;
  windDir: string;
  windScale: string;
  windSpeed: number;
  humidity: number;
  pop: number;
  precip: number;
  pressure: number;
  cloud: number;
  dew: number;
}

export interface NowWeather {
  obsTime: Date;
  temp: number;
  feelsLike: number;
  condition: string;
  emoji: string;
  wind360: number;
  windDir: string;
  windScale: string;
  windSpeed: number;
  humidity: number;
  precip: number;
  pressure: number;
  vis: number;
  cloud: number;
  dew: number;
}

const QWEATHER_API_KEY = process.env.QWEATHER_API_KEY;
const QWEATHER_API_HOST = process.env.QWEATHER_API_HOST;
const QWEATHER_GEO_API = `${QWEATHER_API_HOST}/geo/v2/city/lookup`;
const QWEATHER_NOW_API = `${QWEATHER_API_HOST}/v7/weather/now`;
const QWEATHER_DAILY_API_BASE = `${QWEATHER_API_HOST}/v7/weather`;
const QWEATHER_HOURLY_API_BASE = `${QWEATHER_API_HOST}/v7/weather`;

const emojiMap: Record<string, string> = {
  '100': '☀️',
  '101': '☁️',
  '102': '☁️',
  '103': '🌥️',
  '104': '🌥️',
  '150': '🌥️',
  '300': '🌧️',
  '301': '🌧️',
  '302': '🌧️',
  '303': '🌧️',
  '304': '🌧️',
  '305': '🌧️',
  '306': '🌧️',
  '307': '🌧️',
  '308': '🌧️',
  '309': '🌧️',
  '310': '🌧️',
  '311': '🌧️',
  '312': '🌧️',
  '313': '🌧️',
  '314': '🌧️',
  '315': '🌧️',
  '316': '🌧️',
  '317': '🌧️',
  '318': '🌧️',
  '399': '🌧️',
  '400': '⛈️',
  '401': '⛈️',
  '402': '⛈️',
  '403': '⛈️',
  '404': '⛈️',
  '405': '⛈️',
  '406': '⛈️',
  '407': '⛈️',
  '408': '⛈️',
  '409': '⛈️',
  '410': '⛈️',
  '499': '⛈️',
  '500': '❄️',
  '501': '❄️',
  '502': '❄️',
  '503': '❄️',
  '504': '❄️',
  '507': '❄️',
  '508': '❄️',
  '509': '❄️',
  '510': '❄️',
  '511': '❄️',
  '512': '❄️',
  '513': '❄️',
  '514': '❄️',
  '515': '❄️',
  '800': '🌫️',
  '801': '🌫️',
  '802': '🌫️',
  '803': '🌫️',
  '804': '🌫️',
  '805': '🌫️',
  '806': '🌫️',
  '807': '🌫️',
  '900': '🌡️',
  '901': '🌡️',
  '999': '🌡️',
};

export function getWeatherEmoji(icon: string): string {
  return emojiMap[icon] || '🌡️';
}

export async function searchCity(city: string): Promise<string | null> {
  try {
    const url = `${QWEATHER_GEO_API}?location=${encodeURIComponent(city)}`;
    const headers = QWEATHER_API_KEY ? { 'X-QW-Api-Key': QWEATHER_API_KEY } : undefined;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return null;
    }

    const data: QWeatherLocationResponse = await response.json();

    if (data.code === '200' && data.location && data.location.length > 0) {
      return data.location[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error searching city:', error);
    return null;
  }
}

export async function getWeatherForecast(locationId: string, days: number = 7): Promise<WeatherEvent[]> {
  const validDays = [3, 7, 10, 15, 30];
  const requestDays = validDays.includes(days) ? days : 7;

  try {
    const url = `${QWEATHER_DAILY_API_BASE}/${requestDays}d?location=${locationId}`;
    const headers = QWEATHER_API_KEY ? { 'X-QW-Api-Key': QWEATHER_API_KEY } : undefined;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });
    const data: QWeatherForecastResponse = await response.json();

    if (data.code !== '200' || !data.daily) {
      throw new Error(`Weather API error: ${data.code}`);
    }

    return data.daily.slice(0, 14).map((day) => ({
      date: new Date(day.fxDate),
      tempHigh: parseInt(day.tempMax),
      tempLow: parseInt(day.tempMin),
      condition: day.textDay,
      emoji: getWeatherEmoji(day.iconDay),
    }));
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}

export async function getWeatherNow(locationId: string): Promise<NowWeather> {
  try {
    const url = `${QWEATHER_NOW_API}?location=${locationId}`;
    const headers = QWEATHER_API_KEY ? { 'X-QW-Api-Key': QWEATHER_API_KEY } : undefined;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new Error(`Weather API HTTP error: ${response.status}`);
    }

    const data: QWeatherNowResponse = await response.json();

    if (data.code !== '200' || !data.now) {
      throw new Error(`Weather API error: ${data.code}`);
    }

    const { now } = data;
    return {
      obsTime: new Date(now.obsTime),
      temp: parseInt(now.temp),
      feelsLike: parseInt(now.feelsLike),
      condition: now.text,
      emoji: getWeatherEmoji(now.icon),
      wind360: parseInt(now.wind360),
      windDir: now.windDir,
      windScale: now.windScale,
      windSpeed: parseInt(now.windSpeed),
      humidity: parseInt(now.humidity),
      precip: parseFloat(now.precip),
      pressure: parseInt(now.pressure),
      vis: parseInt(now.vis),
      cloud: parseInt(now.cloud) || 0,
      dew: parseInt(now.dew) || 0,
    };
  } catch (error) {
    console.error('Error fetching real-time weather:', error);
    throw error;
  }
}

export async function getWeatherByCity(city: string, days: number = 7): Promise<WeatherEvent[]> {
  const locationId = await searchCity(city);

  if (!locationId) {
    throw new Error(`City not found: ${city}`);
  }

  return getWeatherForecast(locationId, days);
}

export async function getHourlyForecast(locationId: string, hours: number = 24): Promise<HourlyWeather[]> {
  const validHours = [24, 72, 168];
  if (!validHours.includes(hours)) {
    throw new Error(`Hours parameter must be one of: ${validHours.join(', ')}`);
  }

  try {
    const url = `${QWEATHER_HOURLY_API_BASE}/${hours}h?location=${locationId}`;
    const headers = QWEATHER_API_KEY ? { 'X-QW-Api-Key': QWEATHER_API_KEY } : undefined;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      console.error('Hourly API HTTP error:', response.status, response.statusText);
      throw new Error(`Weather API HTTP error: ${response.status}`);
    }

    const data: QWeatherHourlyResponse = await response.json();

    if (data.code !== '200' || !data.hourly) {
      throw new Error(`Weather API error: ${data.code}`);
    }

    return data.hourly.map((hour) => ({
      time: new Date(hour.fxTime),
      temp: parseInt(hour.temp),
      condition: hour.text,
      emoji: getWeatherEmoji(hour.icon),
      wind360: parseInt(hour.wind360),
      windDir: hour.windDir,
      windScale: hour.windScale,
      windSpeed: parseInt(hour.windSpeed),
      humidity: parseInt(hour.humidity),
      pop: parseInt(hour.pop) || 0,
      precip: parseFloat(hour.precip),
      pressure: parseInt(hour.pressure),
      cloud: parseInt(hour.cloud) || 0,
      dew: parseInt(hour.dew) || 0,
    }));
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
}

export async function getHourlyWeatherByCity(city: string, hours: number = 24): Promise<HourlyWeather[]> {
  const locationId = await searchCity(city);

  if (!locationId) {
    throw new Error(`City not found: ${city}`);
  }

  return getHourlyForecast(locationId, hours);
}
