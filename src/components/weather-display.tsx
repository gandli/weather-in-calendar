"use client";

import { useState, useEffect, useMemo } from "react";
import { WeatherEvent } from "@/lib/qweather";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface WeatherDisplayProps {
    initialCity: string;
    initialData?: WeatherEvent[];
    locale: string;
    unit?: "C" | "F";
}

interface RawWeatherEvent extends Omit<WeatherEvent, 'date'> {
    date: string | Date;
}

// Optimization: Ensure dates are instantiated once and stored in state
// to avoid repeated `new Date()` calls during rendering loops.
function normalizeWeatherData(data: (RawWeatherEvent | WeatherEvent)[]): WeatherEvent[] {
    return data.map((d) => ({
        ...d,
        date: d.date instanceof Date ? d.date : new Date(d.date)
    })) as WeatherEvent[];
}

export function WeatherDisplay({
    initialCity,
    initialData = [],
    locale,
    unit = "C"
}: WeatherDisplayProps) {
    const t = useTranslations('Hero');
    const [city, setCity] = useState(initialCity);
    const [weatherData, setWeatherData] = useState<WeatherEvent[]>(() => normalizeWeatherData(initialData));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        const handleCityChange = (event: Event) => {
            const customEvent = event as CustomEvent<{ city: string }>;
            setCity(customEvent.detail.city);
        };

        window.addEventListener('city-change', handleCityChange);
        return () => window.removeEventListener('city-change', handleCityChange);
    }, []);

    useEffect(() => {
        if (!city) {
            setWeatherData([]);
            setError(null);
            window.dispatchEvent(new CustomEvent('weather-status', { detail: { hasData: false } }));
            return;
        }

        if (city === initialCity) {
            setWeatherData(normalizeWeatherData(initialData));
            setError(null);
            window.dispatchEvent(new CustomEvent('weather-status', { detail: { hasData: initialData.length > 0 } }));
            return;
        }

        const fetchWeather = async () => {
            setIsLoading(true);
            setError(null);
            window.dispatchEvent(new CustomEvent('weather-status', { detail: { hasData: false, isLoading: true } }));
            try {
                const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
                const data = await response.json() as RawWeatherEvent[] & { error?: string };

                if (!response.ok) {
                    if (response.status === 404) {
                        setError(t('cityNotFound', { city }));
                    } else {
                        setError(data.error || 'Failed to fetch weather');
                    }
                    setWeatherData([]);
                    window.dispatchEvent(new CustomEvent('weather-status', { detail: { hasData: false, isLoading: false } }));
                    return;
                }

                const processedData = normalizeWeatherData(data);
                setWeatherData(processedData);
                window.dispatchEvent(new CustomEvent('weather-status', { detail: { hasData: true, isLoading: false } }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                console.error('Weather fetch error:', err);
                setError(errorMessage);
                setWeatherData([]);
                window.dispatchEvent(new CustomEvent('weather-status', { detail: { hasData: false, isLoading: false } }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [city, initialCity, initialData, t]);


    const weekdayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'short' }), [locale]);
    const dayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' }), [locale]);
    const a11yDateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }), [locale]);

    const convertTemp = (celsius: number) => {
        if (unit === "C") return celsius;
        return Math.round((celsius * 9) / 5 + 32);
    };

    return (
        <div className="mt-20 relative mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-2xl" />
            <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl overflow-hidden min-h-[400px]">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-muted-foreground">
                            {t('previewTitle')} {city && ` - ${city}`}
                        </span>
                        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                    </div>
                </div>

                {error ? (
                    <div role="alert" className="py-20 flex justify-center items-center text-destructive">
                        {error}
                    </div>
                ) : weatherData.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
                        {weatherData.slice(0, 14).map((weather, i) => {
                            // Normalized in state, direct access
                            const dateObj = weather.date;
                            return (
                                <li
                                    key={i}
                                    className="bg-background/60 p-4 h-28 sm:h-36 flex flex-col justify-between hover:bg-muted/50 transition-colors group relative"
                                    aria-label={t('weatherDescription', {
                                        date: a11yDateFormatter.format(dateObj),
                                        condition: weather.condition,
                                        high: convertTemp(weather.tempHigh),
                                        low: convertTemp(weather.tempLow)
                                    })}
                                >
                                    <div className="flex justify-between items-start" aria-hidden="true">
                                        <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                                            {weekdayFormatter.format(dateObj)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/30">
                                            {dayFormatter.format(dateObj)}
                                        </span>
                                    </div>
                                    <div className="text-center py-2" aria-hidden="true">
                                        <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                                            {weather.emoji}
                                        </div>
                                        <div className="text-xs font-bold bg-muted/30 rounded-full py-0.5 px-2 inline-block">
                                            {convertTemp(weather.tempLow)}° ~ {convertTemp(weather.tempHigh)}°
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/60 truncate italic" aria-hidden="true">
                                        {weather.condition}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : isLoading ? (
                    <div role="status" aria-label={t('previewTitle')} className="py-20 flex justify-center items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="py-20 flex justify-center items-center text-muted-foreground">
                        {t('noData')}
                    </div>
                )}
            </div>
        </div>
    );
}
