import { getWeatherByCity, WeatherEvent } from "@/lib/qweather";
import { WeatherDisplay } from "./weather-display";

interface WeatherLoaderProps {
    city: string;
    locale: string;
}

export async function WeatherLoader({ city, locale }: WeatherLoaderProps) {
    let initialWeatherData: WeatherEvent[] = [];
    try {
        initialWeatherData = await getWeatherByCity(city, 15);
    } catch (e) {
        if (!(e instanceof Error && e.message?.includes('not found'))) {
            console.error('Failed to fetch initial weather:', e);
        }
    }

    return (
        <WeatherDisplay
            initialCity={city}
            initialData={initialWeatherData}
            locale={locale}
        />
    );
}
