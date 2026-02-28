"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        // Circular expansion animation logic
        if (typeof document !== 'undefined' && (document as any).startViewTransition) {
            (document as any).startViewTransition(() => {
                setTheme(nextTheme);
            });
        } else {
            setTheme(nextTheme);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl transition-all duration-300 group hover:bg-white/5 border border-white/5 hover:border-white/10"
        >
            <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                    >
                        <Moon className="w-4 h-4 text-accent" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                    >
                        <Sun className="w-4 h-4 text-orange-400" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ambient glow */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-opacity -z-10 ${theme === 'dark' ? 'bg-accent' : 'bg-orange-400'}`} />
        </button>
    );
}
