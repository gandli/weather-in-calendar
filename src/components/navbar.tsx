"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDays, CloudSun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "./language-switcher";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
    const t = useTranslations('Navbar');

    const handleGetStarted = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        window.history.pushState(null, '', '#subscribe');

        const subscribeSection = document.getElementById('subscribe');
        if (subscribeSection) {
            subscribeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
            const input = document.querySelector<HTMLInputElement>('#subscribe input');
            input?.focus();
        }, 300);
    };

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
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <LanguageSwitcher />
                    <a
                        href="#subscribe"
                        className={cn(buttonVariants({ variant: "default", size: "icon" }), "rounded-full")}
                        onClick={handleGetStarted}
                        title={t('getStarted')}
                        aria-label={t('getStarted')}
                    >
                        <CalendarDays className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </nav>
    );
}
