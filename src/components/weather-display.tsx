import { getWeatherByCity, WeatherEvent } from "@/lib/qweather";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface WeatherDisplayProps {
    city: string;
    locale: string;
    unit?: "C" | "F";
}

export async function WeatherDisplay({ city, locale, unit = "C" }: WeatherDisplayProps) {
    const t = await getTranslations('Hero');
    
    let previewWeather: WeatherEvent[] = [];
    let error = null;

    try {
        previewWeather = await getWeatherByCity(city, 15);
    } catch (e) {
        console.error('Failed to fetch weather for display:', e);
        error = e;
    }

    const convertTemp = (celsius: number) => {
        if (unit === "C") return celsius;
        return Math.round((celsius * 9) / 5 + 32);
    };

    return (
        <div className="mt-20 relative mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-2xl" />
            <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-muted-foreground">
                            {t('previewTitle')} {city && ` - ${city}`}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
                    {previewWeather.length > 0 ? (
                        previewWeather.slice(0, 14).map((weather, i) => (
                            <div
                                key={i}
                                className="bg-background/60 p-4 h-28 sm:h-36 flex flex-col justify-between hover:bg-muted/50 transition-colors group relative"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                                        {new Date(weather.date).toLocaleDateString(locale, { weekday: 'short' })}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/30">
                                        {new Date(weather.date).toLocaleDateString(locale, { month: 'numeric', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="text-center py-2">
                                    <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                                        {weather.emoji}
                                    </div>
                                    <div className="text-xs font-bold bg-muted/30 rounded-full py-0.5 px-2 inline-block">
                                        {convertTemp(weather.tempLow)}° ~ {convertTemp(weather.tempHigh)}°
                                    </div>
                                </div>
                                <div className="text-[10px] text-muted-foreground/60 truncate italic">
                                    {weather.condition}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center text-muted-foreground">
                            {error ? "Failed to load weather data" : "No weather data available"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
