"use client";

import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useResumeStore, ResumeData, ResumeSection } from '@/store/useResumeStore';
import { MeridianTemplate } from '@/templates/MeridianTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize, Frame } from 'lucide-react';

export const LivePreview = forwardRef<HTMLDivElement, {}>((props, ref) => {
    const { resume } = useResumeStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Auto-scale the A4 preview to fit the container width
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                // Use the container's own width with padding subtracted
                const padding = window.innerWidth < 640 ? 24 : 80; // less padding on mobile
                const availableWidth = containerRef.current.clientWidth - padding;
                const targetWidth = 794; // A4 width in px at 96dpi
                const newScale = Math.min(availableWidth / targetWidth, 1);
                setScale(Math.max(newScale, 0.3)); // never go below 30%
            }
        };

        handleResize();
        setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden p-4 sm:p-8 scrollbar-thin relative bg-bg-void/40"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}
        >
            {/* Top Preview Controls — hidden on smallest screens */}
            <div className="sticky top-0 z-20 hidden sm:flex items-center gap-4 p-2 mb-6 rounded-full premium-glass border border-white/5 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <button
                    onClick={() => setScale(s => Math.min(s + 0.1, 1.5))}
                    className="p-2 text-foreground/40 hover:text-accent transition-colors"
                >
                    <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">{Math.round(scale * 100)}%</div>
                <button
                    onClick={() => setScale(s => Math.max(s - 0.1, 0.4))}
                    className="p-2 text-foreground/40 hover:text-accent transition-colors"
                >
                    <ZoomOut className="w-3.5 h-3.5" />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative group origin-top-center"
                style={{
                    width: '794px',
                    minHeight: '1123px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    marginBottom: `${(1123 * scale) - 1123 + 40}px`,
                }}
            >
                {/* Premium "Responsive Shield" Frame */}
                <div className="absolute -inset-[2px] bg-gradient-to-tr from-accent/20 via-transparent to-accent/20 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-[1px]" />
                <div className="absolute -inset-[32px] border border-white/5 rounded-2xl pointer-events-none opacity-20 group-hover:opacity-100 transition-all duration-1000" />

                <div
                    className="relative bg-white text-black overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                    style={{ width: '794px', minHeight: '1123px' }}
                >
                    <div ref={ref} className="w-full h-full bg-white relative">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]" />

                        {resume.templateId === 't1' ? (
                            <MeridianTemplate data={resume} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-black/40 font-mono">
                                Renderer not implemented: {resume.templateId}
                            </div>
                        )}
                    </div>
                </div>

                {/* Annotation Badges — hidden on mobile to avoid overflow */}
                <div className="absolute -right-20 top-20 flex-col gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 hidden lg:flex">
                    <div className="p-3 premium-glass border border-white/5 rounded-xl shadow-2xl">
                        <Frame className="w-4 h-4 text-accent/50" />
                    </div>
                    <div className="p-3 premium-glass border border-white/5 rounded-xl shadow-2xl">
                        <Maximize className="w-4 h-4 text-accent/50" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

LivePreview.displayName = 'LivePreview';
