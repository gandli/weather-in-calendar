'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";
import { Loader2, CloudRain } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // 简单的语言检测
        const browserLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
        const targetLocale = browserLang.startsWith('zh') ? 'zh' : 'en';

        // 稍微延迟一下以展示精美的加载效果
        const timer = setTimeout(() => {
            router.replace(`/${targetLocale}`);
        }, 800);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <html lang="en" className="light">
            <body className={cn(inter.variable, "min-h-screen bg-white font-sans antialiased overflow-hidden text-slate-900")}>
                {/* Global Ambient Background - Optimized for Light Mode */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-transparent" />
                    <div className="absolute top-[10%] right-0 w-[500px] h-[500px] bg-purple-100/50 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[10%] left-0 w-[600px] h-[600px] bg-blue-100/50 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="flex flex-col justify-center items-center h-screen gap-6 animate-in fade-in duration-1000">
                    <div className="relative">
                        {/* Soft glow for light mode */}
                        <div className="absolute -inset-8 rounded-full bg-blue-500/5 blur-3xl animate-pulse" />
                        <div className="relative bg-white/80 backdrop-blur-xl border border-blue-100 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                            <CloudRain className="w-14 h-14 text-blue-600 animate-bounce" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-blue-50">
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        </div>
                    </div>

                    <div className="text-center space-y-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Weather Calendar
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                            <span className="h-px w-8 bg-blue-100" />
                            <p className="text-sm font-medium text-slate-400 animate-pulse tracking-wide uppercase">
                                Initializing
                            </p>
                            <span className="h-px w-8 bg-blue-100" />
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}