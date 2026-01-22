import { Sparkles } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { HeroInteractive } from "@/components/hero-interactive";
import { getWeatherByCity } from "@/lib/qweather";

export async function Hero() {
    const t = await getTranslations('Hero');
    const locale = await getLocale();
    const defaultCity = locale === 'zh' ? '上海' : 'New York';

    let initialWeather = [];
    try {
        initialWeather = await getWeatherByCity(defaultCity, 15);
    } catch (error) {
        console.error('Failed to fetch initial weather:', error);
    }

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

                <HeroInteractive initialWeather={initialWeather} />
            </div>
        </section>
    );
}
