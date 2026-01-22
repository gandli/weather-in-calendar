"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: "en" | "zh") => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-8 px-2 text-xs font-medium transition-colors",
                    locale === 'en'
                        ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                        : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => switchLocale('en')}
            >
                EN
            </Button>
            <span className="text-muted-foreground/30 select-none">|</span>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-8 px-2 text-xs font-medium transition-colors",
                    locale === 'zh'
                        ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                        : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => switchLocale('zh')}
            >
                中文
            </Button>
        </div>
    );
}
