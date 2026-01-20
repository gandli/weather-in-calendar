import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Weather in Calendar",
    description: "Get weather forecast in your calendar with emojis.",
    icons: {
        icon: "/icon.png",
        apple: "/apple-touch-icon.png",
    },
};

export function generateStaticParams() {
    return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);
    
    let messages;
    try {
        messages = await getMessages({ locale });
    } catch (error) {
        console.error('Failed to load messages for locale:', locale, error);
        messages = {};
    }

    return (
        <html lang={locale}>
            <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased")}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
