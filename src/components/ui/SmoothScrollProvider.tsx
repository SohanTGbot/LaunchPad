"use client";

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode } from 'react';

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {/* @ts-ignore - Bypass React 18 vs 19 ReactNode type mismatch */}
            {children}
        </ReactLenis>
    );
}
