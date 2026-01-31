"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const toggleLocale = () => {
        const newLocale = locale === 'en' ? 'zh' : 'en';
        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPathname = segments.join('/');
        
        const params = new URLSearchParams(searchParams.toString());
        const queryString = params.toString();
        
        router.push(`${newPathname}${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={toggleLocale}
            title={locale === 'en' ? 'Switch to Chinese' : '切换至英文'}
            aria-label={locale === 'en' ? 'Switch to Chinese' : '切换至英文'}
        >
            <Languages className="h-4 w-4" />
        </Button>
    );
}
