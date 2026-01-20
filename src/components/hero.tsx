"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Loader2, Calendar as CalendarIcon } from "lucide-react";
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

export function Hero() {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [previewWeather, setPreviewWeather] = useState<WeatherEvent[]>([]);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedCity = useDebounce(city, 800);
    const defaultCity = locale === 'zh' ? '上海' : 'New York';

    // 获取预览数据
    const fetchPreview = useCallback(async (cityName: string) => {
        setIsPreviewLoading(true);
        try {
            const response = await fetch(`/api/daily?city=${encodeURIComponent(cityName)}&locale=${locale}&days=15`);
            const data = await response.json();
            if (data.forecast) {
                setPreviewWeather(data.forecast);
            } else {
                setPreviewWeather([]);
            }
        } catch (error) {
            console.error('Failed to fetch preview:', error);
            setPreviewWeather([]);
        } finally {
            setIsPreviewLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchPreview(debouncedCity || defaultCity);
    }, [debouncedCity, defaultCity, fetchPreview]);

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

    return (
        <section id="subscribe" className="relative pt-32 pb-20">

            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t('badge')}
                    </span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {t('titleStart')} <br />
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        {t('titleHighlight')}
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {t('description')}
                </p>

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
                </div>

                {/* Mock Preview/Visual */}
                <div className="mt-20 relative mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-2xl" />
                    <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl overflow-hidden">
                        {/* <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">
                                    {`${city || defaultCity} ${t('previewTitle')}`}
                                </span>
                            </div>
                            {isPreviewLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                        </div> */}

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
                            {(previewWeather.length > 0 ? previewWeather.slice(0, 14) : Array.from({ length: 14 })).map((item, i) => {
                                const weather = item as WeatherEvent;
                                const isRealItem = !!(weather && weather.date);
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "bg-background/60 p-4 h-28 sm:h-36 flex flex-col justify-between hover:bg-muted/50 transition-colors group relative",
                                            !previewWeather.length && "animate-pulse"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                                                {isRealItem ? (new Date(weather.date).toLocaleDateString(locale, { weekday: 'short' }) as string) : `Day ${i + 1}`}
                                            </span>
                                            {isRealItem && (
                                                <span className="text-[10px] text-muted-foreground/30">
                                                    {(new Date(weather.date).toLocaleDateString(locale, { month: 'numeric', day: 'numeric' }) as string)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-center py-2">
                                            <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                                                {isRealItem ? weather.emoji : ["☀️", "☁️", "🌧️", "⛅️"][i % 4]}
                                            </div>
                                            <div className="text-xs font-bold bg-muted/30 rounded-full py-0.5 px-2 inline-block">
                                                {isRealItem ? `${weather.tempLow}° ~ ${weather.tempHigh}°` : `${18 + i}°`}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground/60 truncate italic">
                                            {isRealItem ? weather.condition : "Forecast..."}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
