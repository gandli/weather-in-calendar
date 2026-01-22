import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function Home({
    params,
    searchParams
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    setRequestLocale(locale);
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col relative overflow-hidden">
            {/* Global Ambient Background */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />
                <div className="absolute top-[10%] right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />
            <Hero searchParams={resolvedSearchParams} />
            <Features />
            <Pricing />
            <Footer />
        </main>
    );
}