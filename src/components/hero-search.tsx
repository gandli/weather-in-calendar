"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function HeroSearch({ initialCity }: { initialCity: string }) {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [city, setCity] = useState(initialCity);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCity(initialCity);
    }, [initialCity]);

    const updateUrl = (cityName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cityName) {
            params.set('city', cityName);
        } else {
            params.delete('city');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleGenerate = () => {
        if (!city) return;
        setIsLoading(true);

        updateUrl(city);

        const origin = window.location.origin.replace(/^https?:\/\//, 'webcal://');
        const webcalUrl = `${origin}/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;

        window.location.href = webcalUrl;
        setTimeout(() => setIsLoading(false), 1000);
    };

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
        if (city !== initialCity) {
            updateUrl(city);
        }
    };

    return (
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Input
                ref={inputRef}
                placeholder={t('placeholder')}
                className="h-12 rounded-full px-6 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-black/50"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        updateUrl(city);
                        handleGenerate();
                    }
                }}
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
    );
}
