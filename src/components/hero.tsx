import { getLocale } from "next-intl/server";
import { getWeatherByCity, WeatherEvent } from "@/lib/qweather";
import { HeroInteractive } from "./hero-interactive";

export async function Hero() {
  const locale = await getLocale();
  const defaultCity = locale === 'zh' ? '上海' : 'New York';

  let initialWeather: WeatherEvent[] = [];
  try {
    // Fetch 15 days to match the client logic
    initialWeather = await getWeatherByCity(defaultCity, 15);
  } catch (error) {
    console.error('Failed to fetch initial weather data for SSR:', error);
    // If server fetch fails, we pass empty array.
    // The client component will show loading state and attempt to fetch client-side.
  }

  // Serialize the data to avoid "Date object cannot be passed to Client Component" error
  // logic: JSON.stringify converts Date to ISO string.
  // We use JSON.parse/stringify to simulate the boundary serialization and avoid TS issues if any
  const serializedWeather = JSON.parse(JSON.stringify(initialWeather));

  return (
    <HeroInteractive
      initialWeather={serializedWeather}
      defaultCity={defaultCity}
    />
  );
}
