import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'zh' }
    ];
}

export default function Home() {
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