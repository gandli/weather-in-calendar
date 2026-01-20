// ... imports
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function Hero() {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = () => {
        if (!city) return;
        setIsLoading(true);

        // 构建 webcal URL
        let webcalUrl: string;
        if (process.env.NODE_ENV === 'production') {
            // 生产环境:将 http(s):// 替换为 webcal://
            const origin = window.location.origin.replace(/^https?:\/\//, 'webcal://');
            webcalUrl = `${origin}/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;
        } else {
            // 开发环境
            webcalUrl = `webcal://localhost:3000/api/ics?city=${encodeURIComponent(city)}&locale=${locale}`;
        }

        // 使用 window.location.href 触发订阅
        window.location.href = webcalUrl;

        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

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
                    <div className="relative rounded-xl border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl">
                        {/* Fake Calendar UI */}
                        <div className="grid grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                <div key={day} className="bg-background/80 p-2 text-center text-xs font-semibold text-muted-foreground">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div key={i} className="bg-background/60 p-2 sm:p-4 h-24 sm:h-32 flex flex-col justify-between hover:bg-muted/50 transition-colors">
                                    <span className="text-xs text-muted-foreground">{10 + i}</span>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-4xl mb-1">{["☀️", "☁️", "🌧️", "⛅️"][i % 4]}</div>
                                        <div className="text-xs font-medium">{18 + (i % 5)}°</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
