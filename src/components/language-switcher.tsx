"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const switchLocale = (newLocale: "en" | "zh") => {
        const currentParams = searchParams.toString();
        const newPath = currentParams ? `${pathname}?${currentParams}` : pathname;
        router.replace(newPath, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={className}>
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale("en")}>
                    <span className={cn("mr-2 w-4", locale === "en" ? "opacity-100" : "opacity-0")}>
                        <Check className="h-4 w-4" />
                    </span>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale("zh")}>
                     <span className={cn("mr-2 w-4", locale === "zh" ? "opacity-100" : "opacity-0")}>
                        <Check className="h-4 w-4" />
                    </span>
                    中文
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
