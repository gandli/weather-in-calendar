"use client";

import { useRouter, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface UnitToggleProps {
    unit: "C" | "F";
}

export function UnitToggle({ unit }: UnitToggleProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const toggleUnit = (newUnit: "C" | "F") => {
        if (unit === newUnit) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('unit', newUnit);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center bg-muted/30 rounded-full p-1 border border-white/10">
            <button
                onClick={() => toggleUnit("C")}
                className={cn(
                    "px-3 py-1 text-xs font-bold rounded-full transition-all",
                    unit === "C" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-primary"
                )}
            >
                °C
            </button>
            <button
                onClick={() => toggleUnit("F")}
                className={cn(
                    "px-3 py-1 text-xs font-bold rounded-full transition-all",
                    unit === "F" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-primary"
                )}
            >
                °F
            </button>
        </div>
    );
}
