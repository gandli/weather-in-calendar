'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/en');
    }, [router]);

    return (
        <html lang="en">
            <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased")}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <p>Redirecting...</p>
                </div>
            </body>
        </html>
    );
}