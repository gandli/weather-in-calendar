import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HeroSearch } from "./hero-search";
import { WeatherLoader } from "./weather-loader";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface HeroProps {
    city?: string;
    locale: string;
}

export async function Hero({ city, locale }: HeroProps) {
    const t = await getTranslations('Hero');
    const defaultCity = locale === 'zh' ? '上海' : 'New York';
    const displayCity = city || defaultCity;

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

                <HeroSearch initialCity={city || ""} hasInitialData={false} />

                <Suspense fallback={
                    <div className="mt-20 flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                }>
                    <WeatherLoader city={displayCity} locale={locale} />
                </Suspense>
            </div>
        </section>
    );
}
