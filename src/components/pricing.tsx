"use client";

import { Check, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

// 特性键列表 (提取到组件外部)
const featureKeys = ["0", "1", "2", "3", "4"] as const;

export function Pricing() {
    const t = useTranslations('Pricing');

    // 使用翻译构建特性列表
    const features = featureKeys.map(key => t(`features.${key}`));

    return (
        <section id="pricing" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h2>
                    <p className="text-lg text-muted-foreground">
                        {t('description')}
                    </p>
                </div>

                <div className="mx-auto max-w-lg">
                    <div className="relative rounded-3xl border border-primary/20 bg-background/50 backdrop-blur-xl p-8 shadow-2xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                            {t('badge')}
                        </div>

                        <div className="text-center mb-8 mt-4">
                            <span className="text-5xl font-bold tracking-tight">$0</span>
                            <span className="text-muted-foreground ml-2">{t('period')}</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                                    <div className="rounded-full bg-green-500/10 p-1">
                                        <Check className="w-4 h-4 text-green-500" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="https://afdian.com/a/gandli" target="_blank">
                            <Button className="w-full h-12 rounded-xl text-base mb-4" variant="outline">
                                <CalendarHeart className="w-4 h-4 mr-2" />
                                {t('support')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
