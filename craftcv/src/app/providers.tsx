"use client";

import React, { useEffect, useRef } from 'react';
import { InsforgeBrowserProvider } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { ThemeProvider } from 'next-themes';
import Lenis from 'lenis';

export function Providers({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <InsforgeBrowserProvider client={insforge} afterSignInUrl="/dashboard">
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <CustomCursor />
                <ToastContainer />
                {children}
            </ThemeProvider>
        </InsforgeBrowserProvider>
    );
}
