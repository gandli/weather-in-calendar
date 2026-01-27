"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

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

export function HeroSearch({ initialCity, hasInitialData }: { initialCity: string, hasInitialData: boolean }) {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const [city, setCity] = useState(initialCity);
    const [isLoading, setIsLoading] = useState(false);
    const [isWeatherLoading, setIsWeatherLoading] = useState(false);
    const [hasData, setHasData] = useState(hasInitialData);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedCity = useDebounce(city, 500);

    useEffect(() => {
        const handleWeatherStatus = (event: Event) => {
            const customEvent = event as CustomEvent<{ hasData: boolean, isLoading?: boolean }>;
            if (customEvent.detail.isLoading !== undefined) {
                setIsWeatherLoading(customEvent.detail.isLoading);
            }
            if (customEvent.detail.hasData !== undefined) {
                setHasData(customEvent.detail.hasData);
            }
        };

        window.addEventListener('weather-status', handleWeatherStatus);
        return () => window.removeEventListener('weather-status', handleWeatherStatus);
    }, []);

    useEffect(() => {
        setCity(initialCity);
    }, [initialCity]);

    const updateUrl = useCallback((cityName: string, isSilent = false) => {
        const params = new URLSearchParams(window.location.search);
        if (cityName) {
            params.set('city', cityName);
        } else {
            params.delete('city');
        }

        const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;

        if (isSilent) {
            window.history.replaceState(null, '', newUrl);
        } else {
            router.push(newUrl, { scroll: false });
        }
    }, [pathname, router]);

    const isValidCity = (name: string) => {
        const trimmed = name.trim();
        if (trimmed.length < 2) return false;
        const cityRegex = /^[\u4e00-\u9fa5a-zA-Z\s,.-]+$/;
        return cityRegex.test(trimmed);
    };

    useEffect(() => {
        const trimmedCity = city.trim();
        if (trimmedCity && trimmedCity !== initialCity) {
            setHasData(false);
        }
    }, [city, initialCity]);

    useEffect(() => {
        const trimmedCity = debouncedCity.trim();
        if (trimmedCity !== initialCity.trim()) {
            if (trimmedCity === "") {
                updateUrl("", true);
                window.dispatchEvent(new CustomEvent('city-change', { detail: { city: "" } }));
            } else if (isValidCity(trimmedCity)) {
                updateUrl(trimmedCity, true);
                window.dispatchEvent(new CustomEvent('city-change', { detail: { city: trimmedCity } }));
            } else {
                updateUrl(trimmedCity, true);
                window.dispatchEvent(new CustomEvent('city-change', { detail: { city: "" } }));
            }
        }
    }, [debouncedCity, initialCity, updateUrl]);

    const handleGenerate = useCallback(() => {
        if (!city || isLoading || isWeatherLoading || !hasData) return;
        setIsLoading(true);

        updateUrl(city, true);

        setTimeout(() => {
            const origin = window.location.origin.replace(/^https?:\/\//, 'webcal://');
            const webcalUrl = `${origin}/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;
            window.location.href = webcalUrl;
        }, 50);

        setTimeout(() => setIsLoading(false), 1000);
    }, [city, locale, updateUrl, isLoading, isWeatherLoading, hasData]);


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

    const handleBlur = () => {
        const trimmedCity = city.trim();
        if (trimmedCity !== city) {
            setCity(trimmedCity);
        }
    };

    const handleClear = () => {
        setCity('');
        inputRef.current?.focus();
    };

    return (
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="relative flex-1 w-full">
                <Input
                    ref={inputRef}
                    placeholder={t('placeholder')}
                    aria-label={t('placeholder')}
                    className="h-12 rounded-full px-6 pr-12 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-black/50"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading && !isWeatherLoading && city && hasData) {
                            handleGenerate();
                        }
                    }}
                />
                {city && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors"
                        aria-label="Clear search"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            <Button
                size="lg"
                className="h-12 rounded-full px-8 shadow-lg shadow-primary/25"
                onClick={handleGenerate}
                disabled={isLoading || isWeatherLoading || !city || !hasData}
            >
                {isLoading || isWeatherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('generate')}
                {!isLoading && !isWeatherLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
        </div>
    );
}
