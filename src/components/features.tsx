import { Calendar, CloudRain, RefreshCw, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

// 特性图标配置 (提取到组件外部)
const featureIcons = [
    { key: 'compatibility', icon: Calendar },
    { key: 'uptodate', icon: RefreshCw },
    { key: 'emojis', icon: CloudRain },
    { key: 'friction', icon: Zap },
] as const;


export function Features() {
    const t = useTranslations('Features');

    // 使用翻译构建特性列表
    const features = featureIcons.map(({ key, icon }) => ({
        name: t(key),
        description: t(`${key}Desc`),
        icon,
    }));

    return (
        <section id="features" className="py-24 relative">

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-primary mb-2">{t('title')}</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t('mainTitle')}
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        {t('description')}
                    </p>
                </div>

                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4 md:grid-cols-2">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col items-start p-6 rounded-2xl bg-muted/30 border border-muted/20 backdrop-blur-sm hover:bg-muted/40 transition-all hover:scale-[1.02] cursor-pointer">
                                <div className="rounded-lg bg-primary/10 p-3 mb-4 ring-1 ring-white/10">
                                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-semibold leading-8 text-foreground mb-2">
                                    {feature.name}
                                </h3>
                                <p className="text-base leading-7 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
