import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from "next/navigation";
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n';

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteName = 'Weather in Calendar';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Meta' });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://weather-in-calendar.vercel.app';

    return {
        metadataBase: new URL(baseUrl),
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            siteName,
            locale,
            type: 'website',
        },
        alternates: {
            canonical: `/${locale}`,
            languages: {
                en: '/en',
                zh: '/zh',
            },
        },
        icons: {
            icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌤️</text></svg>",
            apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌤️</text></svg>",
        },
    };
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale as typeof locales[number])) {
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
        <html lang={locale} suppressHydrationWarning>
            <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages} locale={locale}>
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
