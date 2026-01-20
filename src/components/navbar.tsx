"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, CloudSun } from "lucide-react";
import { useTranslations } from "next-intl";

export function Navbar() {
    const t = useTranslations('Navbar');
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <CloudSun className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        {t('title')}
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                        {t('howItWorks')}
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                        {t('pricing')}
                    </Link>
                    <Button variant="default" size="sm" className="rounded-full">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {t('getStarted')}
                    </Button>
                </div>
            </div>
        </nav>
    );
}
