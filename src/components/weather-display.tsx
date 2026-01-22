import { getLocale, getTranslations } from "next-intl/server";
import { getWeatherByCity, WeatherEvent } from "@/lib/qweather";
import { cn } from "@/lib/utils";
import { UnitToggle } from "@/components/unit-toggle";

interface WeatherDisplayProps {
  city: string;
  unit?: "C" | "F";
}

export async function WeatherDisplay({ city, unit = "C" }: WeatherDisplayProps) {
  const locale = await getLocale();
  const t = await getTranslations('Hero');

  let weatherData: WeatherEvent[] = [];
  try {
    weatherData = await getWeatherByCity(city, 15);
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}:`, error);
    // Continue with empty array
  }

  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const dayMonthFormatter = new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' });

  const convertTemp = (celsius: number) => {
    if (unit === "C") return celsius;
    return Math.round((celsius * 9) / 5 + 32);
  };

  const displayWeather = (() => {
    const baseData = weatherData.length > 0 ? weatherData.slice(0, 14) : Array.from({ length: 14 });

    return baseData.map((item, i) => {
      const weather = item as WeatherEvent | undefined;
      if (!weather || !weather.date) {
        return { isRealItem: false, weather: null, weekday: '', dayMonth: '' };
      }

      const dateObj = new Date(weather.date);
      return {
        isRealItem: true,
        weather: weather,
        weekday: weekdayFormatter.format(dateObj),
        dayMonth: dayMonthFormatter.format(dateObj)
      };
    });
  })();

  return (
    <div className="mt-20 relative mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-2xl" />
      <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-muted-foreground">
              {t('previewTitle')}
            </span>
            <span className="text-xs font-normal text-muted-foreground/70">
                ({city})
            </span>
          </div>
          <UnitToggle unit={unit} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
          {displayWeather.map((item, i) => {
            const { isRealItem, weather, weekday, dayMonth } = item;
            return (
              <div
                key={i}
                className={cn(
                  "bg-background/60 p-4 h-28 sm:h-36 flex flex-col justify-between hover:bg-muted/50 transition-colors group relative",
                  !weatherData.length && "animate-pulse"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    {isRealItem ? weekday : `Day ${i + 1}`}
                  </span>
                  {isRealItem && (
                    <span className="text-[10px] text-muted-foreground/30">
                      {dayMonth}
                    </span>
                  )}
                </div>
                <div className="text-center py-2">
                  <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                    {isRealItem && weather ? weather.emoji : ["☀️", "☁️", "🌧️", "⛅️"][i % 4]}
                  </div>
                  <div className="text-xs font-bold bg-muted/30 rounded-full py-0.5 px-2 inline-block">
                    {isRealItem && weather ? `${convertTemp(weather.tempLow)}° ~ ${convertTemp(weather.tempHigh)}°` : `${convertTemp(18 + i)}°`}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground/60 truncate italic">
                  {isRealItem && weather ? weather.condition : "Forecast..."}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
