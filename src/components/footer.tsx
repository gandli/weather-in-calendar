"use client";

import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="border-t border-muted/20 bg-background/50 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-12 md:flex md:items-center md:justify-between">
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-muted-foreground">
                        {t('copyright', { year: new Date().getFullYear() })}
                    </p>
                </div>
                <div className="flex justify-center space-x-6 md:order-2">
                    {/* Add social links or other footer items here */}
                </div>
            </div>
        </footer>
    )
}
