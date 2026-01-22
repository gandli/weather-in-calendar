"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Copy, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { WeatherEvent } from "@/lib/qweather";
import { cn } from "@/lib/utils";

// 防抖 Hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface HeroInteractiveProps {
    initialWeather?: WeatherEvent[];
}

export function HeroInteractive({ initialWeather = [] }: HeroInteractiveProps) {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [previewWeather, setPreviewWeather] = useState<WeatherEvent[]>(initialWeather);
    const [unit, setUnit] = useState<"C" | "F">("C");
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedCity = useDebounce(city, 800);
    const defaultCity = locale === 'zh' ? '上海' : 'New York';

    // Derived state for display - allows instant revert to default when input clears
    const showDefault = !city && initialWeather.length > 0;
    const displayWeather = showDefault ? initialWeather : previewWeather;

    useEffect(() => {
        // If query is empty and we have initial data, skip fetch
        if (!debouncedCity && initialWeather.length > 0) {
            return;
        }

        const controller = new AbortController();

        const fetchPreview = async () => {
            const cityName = debouncedCity || defaultCity;
            try {
                const response = await fetch(`/api/daily?city=${encodeURIComponent(cityName)}&locale=${locale}&days=15`, {
                    signal: controller.signal
                });
                const data = await response.json();
                if (data.forecast) {
                    setPreviewWeather(data.forecast);
                } else {
                    setPreviewWeather([]);
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Failed to fetch preview:', error);
                setPreviewWeather([]);
            }
        };

        fetchPreview();

        return () => {
            controller.abort();
        };
    }, [debouncedCity, defaultCity, locale, initialWeather]);

    useEffect(() => {
        const handleHashFocus = () => {
            if (window.location.hash === '#subscribe') {
                const scrollTimeout = setTimeout(() => {
                    inputRef.current?.focus();
                }, 300);

                return () => clearTimeout(scrollTimeout);
            }
        };

        handleHashFocus();
        window.addEventListener('hashchange', handleHashFocus);
        return () => {
            window.removeEventListener('hashchange', handleHashFocus);
        };
    }, []);

    const handleGenerate = () => {
        if (!city) return;
        setIsLoading(true);

        // 构建 webcal URL
        const origin = window.location.origin.replace(/^https?:\/\//, 'webcal://');
        const webcalUrl = `${origin}/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;

        window.location.href = webcalUrl;
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleCopy = async () => {
        if (!city) return;

        const origin = window.location.origin.replace(/^https?:\/\//, 'webcal://');
        const webcalUrl = `${origin}/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;

        try {
            await navigator.clipboard.writeText(webcalUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const convertTemp = useCallback((celsius: number) => {
        if (unit === "C") return celsius;
        return Math.round((celsius * 9) / 5 + 32);
    }, [unit]);

    const weatherGrid = useMemo(() => {
        const items = displayWeather.length > 0 ? displayWeather.slice(0, 14) : Array.from({ length: 14 });

        return items.map((item, i) => {
            const weather = item as WeatherEvent;
            // Handle date parsing efficiently
            // If weather exists, date is a string from JSON.
            const isRealItem = !!(weather && weather.date);

            let weekday = "";
            let dayMonth = "";

            if (isRealItem) {
                const d = new Date(weather.date);
                weekday = d.toLocaleDateString(locale, { weekday: 'short' });
                dayMonth = d.toLocaleDateString(locale, { month: 'numeric', day: 'numeric' });
            } else {
                weekday = `Day ${i + 1}`;
            }

            return (
                <div
                    key={i}
                    className={cn(
                        "bg-background/60 p-4 h-28 sm:h-36 flex flex-col justify-between hover:bg-muted/50 transition-colors group relative",
                        !displayWeather.length && "animate-pulse"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                            {weekday}
                        </span>
                        {isRealItem && (
                            <span className="text-[10px] text-muted-foreground/30">
                                {dayMonth}
                            </span>
                        )}
                    </div>
                    <div className="text-center py-2">
                        <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                            {isRealItem ? weather.emoji : ["☀️", "☁️", "🌧️", "⛅️"][i % 4]}
                        </div>
                        <div className="text-xs font-bold bg-muted/30 rounded-full py-0.5 px-2 inline-block">
                            {isRealItem ? `${convertTemp(weather.tempLow)}° ~ ${convertTemp(weather.tempHigh)}°` : `${convertTemp(18 + i)}°`}
                        </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 truncate italic">
                        {isRealItem ? weather.condition : "Forecast..."}
                    </div>
                </div>
            );
        });
    }, [displayWeather, locale, convertTemp]);

    return (
        <>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <Input
                    ref={inputRef}
                    placeholder={t('placeholder')}
                    className="h-12 rounded-full px-6 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-black/50"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button
                    size="lg"
                    className="h-12 rounded-full px-8 shadow-lg shadow-primary/25"
                    onClick={handleGenerate}
                    disabled={isLoading || !city}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('generate')}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
                <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 rounded-full shrink-0 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-black/50 hover:bg-white/60 dark:hover:bg-black/60"
                    onClick={handleCopy}
                    disabled={!city}
                    title={t('copy')}
                >
                    {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mock Preview/Visual */}
            <div className="mt-20 relative mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-2xl" />
                <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-muted-foreground">
                                {t('previewTitle')}
                            </span>
                        </div>
                        <div className="flex items-center bg-muted/30 rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setUnit("C")}
                                className={cn(
                                    "px-3 py-1 text-xs font-bold rounded-full transition-all",
                                    unit === "C" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-primary"
                                )}
                            >
                                °C
                            </button>
                            <button
                                onClick={() => setUnit("F")}
                                className={cn(
                                    "px-3 py-1 text-xs font-bold rounded-full transition-all",
                                    unit === "F" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-primary"
                                )}
                            >
                                °F
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
                        {weatherGrid}
                    </div>
                </div>
            </div>
        </>
    );
}
