"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

const CITY_SUGGESTIONS = {
    en: ["New York", "London", "Tokyo", "Singapore", "Sydney", "San Francisco", "Berlin", "Paris", "Hong Kong", "Fuzhou"],
    zh: ["上海", "北京", "广州", "深圳", "杭州", "福州", "成都", "重庆", "苏州", "厦门"],
};

export function HeroSearch({ initialCity, hasInitialData }: { initialCity: string, hasInitialData: boolean }) {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const [city, setCity] = useState(initialCity);
    const [isLoading, setIsLoading] = useState(false);
    const [isWeatherLoading, setIsWeatherLoading] = useState(false);
    const [hasData, setHasData] = useState(hasInitialData);
    const [inputError, setInputError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedCity = useDebounce(city, 500);

    const suggestions = useMemo(() => {
        const list = locale === 'zh' ? CITY_SUGGESTIONS.zh : CITY_SUGGESTIONS.en;
        const q = city.trim().toLowerCase();
        if (!q) return list.slice(0, 6);
        return list
            .filter((item) => item.toLowerCase().includes(q) && item.toLowerCase() !== q)
            .slice(0, 6);
    }, [city, locale]);

    const isValidCity = (name: string) => {
        const trimmed = name.trim();
        if (trimmed.length < 2) return false;
        const cityRegex = /^[\u4e00-\u9fa5a-zA-Z\s,.-]+$/;
        return cityRegex.test(trimmed);
    };

    const emitCityChange = useCallback((cityName: string) => {
        window.dispatchEvent(new CustomEvent('city-change', { detail: { city: cityName } }));
    }, []);

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
                setInputError(null);
                updateUrl("", true);
                emitCityChange("");
            } else if (isValidCity(trimmedCity)) {
                setInputError(null);
                updateUrl(trimmedCity, true);
                emitCityChange(trimmedCity);
            } else {
                setInputError(t('invalidCity'));
                updateUrl(trimmedCity, true);
                emitCityChange("");
            }
        }
    }, [debouncedCity, initialCity, updateUrl, t, emitCityChange]);

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

        setTimeout(() => {
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
        }, 120);
    };

    const handleSuggestionSelect = (selectedCity: string) => {
        setCity(selectedCity);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        setInputError(null);
        updateUrl(selectedCity, true);
        emitCityChange(selectedCity);
    };

    const handleClear = () => {
        setCity('');
        setInputError(null);
        setShowSuggestions(true);
        inputRef.current?.focus();
    };

    const canSubmit = !!city && !inputError && hasData && !isLoading && !isWeatherLoading;
    const buttonLabel = isLoading || isWeatherLoading
        ? t('generating')
        : inputError
            ? t('fixInputFirst')
            : !hasData && city
                ? t('waitWeatherData')
                : t('generate');

    return (
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="relative flex-1 w-full">
                <Input
                    ref={inputRef}
                    placeholder={t('placeholder')}
                    aria-label={t('placeholder')}
                    className="h-12 rounded-full px-6 pr-12 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-black/50"
                    value={city}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                        setCity(e.target.value);
                        setShowSuggestions(true);
                        setActiveSuggestionIndex(-1);
                    }}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (showSuggestions && suggestions.length > 0) {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
                                return;
                            }
                            if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActiveSuggestionIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
                                return;
                            }
                            if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                                e.preventDefault();
                                handleSuggestionSelect(suggestions[activeSuggestionIndex]);
                                return;
                            }
                            if (e.key === 'Escape') {
                                setShowSuggestions(false);
                                setActiveSuggestionIndex(-1);
                            }
                        }

                        if (e.key === "Enter" && canSubmit) {
                            handleGenerate();
                        }
                    }}
                />
                {city && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors"
                        aria-label={t('clearSearch')}
                        title={t('clearSearch')}
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-2 w-full rounded-2xl border bg-background/95 backdrop-blur-sm shadow-lg p-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={suggestion}>
                                <button
                                    type="button"
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                                        index === activeSuggestionIndex
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted'
                                    }`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Button
                size="lg"
                className="h-12 rounded-full px-8 shadow-lg shadow-primary/25"
                onClick={handleGenerate}
                disabled={!canSubmit}
            >
                {isLoading || isWeatherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span className={(isLoading || isWeatherLoading) ? 'ml-2' : ''}>{buttonLabel}</span>
                {!isLoading && !isWeatherLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            {inputError && (
                <p className="text-sm text-destructive text-left sm:text-center sm:basis-full">{inputError}</p>
            )}
        </div>
    );
}
