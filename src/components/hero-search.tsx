"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Loader2, Copy, Check, Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeroSearchProps {
    defaultCity: string;
    defaultUnit: "C" | "F";
}

export function HeroSearch({ defaultCity, defaultUnit }: HeroSearchProps) {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [city, setCity] = useState(defaultCity);
    const [isPending, startTransition] = useTransition();
    const [isCopied, setIsCopied] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Sync state with props if they change (e.g. browser back button)
    useEffect(() => {
        setCity(defaultCity);
    }, [defaultCity]);

    const updateUrl = (newCity: string) => {
        if (!newCity) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('city', newCity);
        // Ensure unit is preserved or set default if missing (though URLSearchParams preserves existing)

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    const handleGenerate = () => {
        if (!city) return;
        updateUrl(city);
    };

    const handleSubscribe = () => {
        if (!city) return;

        const origin = window.location.origin.replace(/^https?:\/\//, 'webcal://');
        const webcalUrl = `${origin}/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;

        window.location.href = webcalUrl;
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

    return (
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
                    disabled={isPending || !city}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('generate')}
                    {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>

                 {/* Secondary Actions */}
                 <div className="flex gap-2 justify-center sm:justify-start">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-12 w-12 rounded-full shrink-0 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-black/50 hover:bg-white/60 dark:hover:bg-black/60"
                        onClick={handleSubscribe}
                        disabled={!city}
                        title="Subscribe to Calendar"
                    >
                         <Calendar className="w-5 h-5" />
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
            </div>
        </div>
    );
}
