import React, { forwardRef, MouseEvent, useCallback } from 'react';
import { motion, HTMLMotionProps, useMotionValue, useMotionTemplate } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for merging tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        const handleMouseMove = useCallback(
            (e: MouseEvent<HTMLButtonElement>) => {
                const { left, top } = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - left);
                mouseY.set(e.clientY - top);
            },
            [mouseX, mouseY]
        );

        const baseStyles = "group relative inline-flex items-center justify-center font-display font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sharp disabled:opacity-30 disabled:pointer-events-none rounded-2xl overflow-hidden active:scale-95";

        const variants = {
            primary: "bg-foreground text-bg-void hover:bg-white shadow-xl shadow-foreground/5",
            secondary: "bg-surface-elevated text-foreground border border-white/5 hover:border-white/20 shadow-2xl",
            outline: "border border-white/10 bg-transparent hover:border-accent-sharp/40 hover:bg-accent/5 text-foreground/60 hover:text-foreground",
            ghost: "bg-transparent hover:bg-white/5 text-foreground/40 hover:text-foreground",
        };

        const sizes = {
            sm: "h-9 px-6 text-[10px]",
            md: "h-12 px-8 text-[11px]",
            lg: "h-14 px-10 text-[12px]",
            icon: "h-11 w-11 p-0",
        };

        const isGlowVariant = variant === 'primary' || variant === 'secondary';
        const glowColor = variant === 'primary' ? 'rgba(212, 244, 41, 0.4)' : 'rgba(255, 255, 255, 0.1)';

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                onMouseMove={isGlowVariant ? handleMouseMove : undefined}
                className={cn(baseStyles, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className)}
                {...props}
            >
                {/* Mouse-tracking cinematic glow effect */}
                {isGlowVariant && (
                    <motion.div
                        className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    100px circle at ${mouseX}px ${mouseY}px,
                                    ${glowColor},
                                    transparent 100%
                                )
                            `,
                        }}
                    />
                )}

                {/* Inner background layer for contrast */}
                {isGlowVariant && (
                    <div className="absolute inset-[1px] rounded-[7px] bg-background/80 backdrop-blur-sm -z-10 transition-colors duration-300 group-hover:bg-background/60" />
                )}

                <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (children as React.ReactNode)}
                </span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";
