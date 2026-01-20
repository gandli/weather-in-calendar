import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n';

export function generateStaticParams() {
    return locales.map((locale) => ({locale}));
}

export default async function Home({params}: {params: Promise<{locale: string}>}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Navbar />
            <Hero />
            <Features />
            <Pricing />
            <Footer />
        </main>
    );
}