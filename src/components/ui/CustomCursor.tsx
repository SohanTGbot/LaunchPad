"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const ringX = useSpring(cursorX, { stiffness: 150, damping: 20 });
    const ringY = useSpring(cursorY, { stiffness: 150, damping: 20 });

    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [cursorType, setCursorType] = useState<string | null>(null);

    const moveCursor = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        if (!isVisible) setIsVisible(true);

        const target = e.target as HTMLElement;
        const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"]');
        setIsHovering(isClickable);

        // Detect custom cursor types if needed (e.g., data-cursor="drag")
        const customType = target.closest('[data-cursor]')?.getAttribute('data-cursor');
        setCursorType(customType || null);
    }, [cursorX, cursorY, isVisible]);

    useEffect(() => {
        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', () => setIsClicking(true));
        window.addEventListener('mouseup', () => setIsClicking(false));
        window.addEventListener('mouseenter', () => setIsVisible(true));
        window.addEventListener('mouseleave', () => setIsVisible(false));

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', () => setIsClicking(true));
            window.removeEventListener('mouseup', () => setIsClicking(false));
            window.removeEventListener('mouseenter', () => setIsVisible(true));
            window.removeEventListener('mouseleave', () => setIsVisible(false));
        };
    }, [moveCursor]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Main Center Dot */}
                        <motion.div
                            className="fixed w-1.5 h-1.5 bg-accent-sharp rounded-full -translate-x-1/2 -translate-y-1/2 z-[10000]"
                            style={{ x: cursorX, y: cursorY }}
                            initial={{ scale: 0 }}
                            animate={{
                                scale: isClicking ? 0.8 : 1,
                                opacity: 1
                            }}
                            exit={{ scale: 0 }}
                        />

                        {/* Outer Ring */}
                        <motion.div
                            className={cn(
                                "fixed w-8 h-8 rounded-full border border-accent/30 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300",
                                isHovering && "w-12 h-12 border-accent-sharp bg-accent/5",
                                isClicking && "scale-90 border-accent-sharp/60"
                            )}
                            style={{ x: ringX, y: ringY }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0 }}
                        />

                        {/* Custom Label/Icon if type exists (e.g. "View") */}
                        {cursorType && isHovering && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="fixed -translate-x-1/2 translate-y-6 px-2 py-0.5 rounded bg-accent-sharp text-bg-void text-[8px] font-black uppercase tracking-widest"
                                style={{ x: cursorX, y: cursorY }}
                            >
                                {cursorType}
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
