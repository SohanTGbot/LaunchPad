import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Surface variant tokens based on the new design system.
 */
export const surfaceVariants = {
    void: "bg-bg-void",
    base: "bg-bg-base border border-white/[0.03]",
    raised: "bg-bg-surface border border-white/[0.05] shadow-2xl shadow-black/20",
    elevated: "bg-bg-elevated border border-white/[0.08] shadow-2xl shadow-black/40",
    glass: "backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]",
    premium: "backdrop-blur-[30px] bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
    premiumDark: "backdrop-blur-[40px] bg-black/40 border border-white/[0.05] shadow-2xl",
} as const;

export type SurfaceVariant = keyof typeof surfaceVariants;

/**
 * Helper to get surface classes.
 */
export function getSurface(variant: SurfaceVariant = "base", className?: string) {
    return cn(surfaceVariants[variant], className);
}
