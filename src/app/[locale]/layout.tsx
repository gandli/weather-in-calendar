import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Weather in Calendar",
    description: "Get weather forecast in your calendar with emojis.",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>; // Expecting locale as promise in Next.js 15+
}) {
    const { locale } = await params;

    if (!['en', 'zh'].includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased")}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
