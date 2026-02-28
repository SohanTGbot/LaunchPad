"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TEMPLATES = [
    {
        id: 'meridian',
        name: 'Meridian',
        desc: 'Clean & Editorial',
        accent: '#6C63FF',
        bg: '#F8F7FF',
        lines: ['#6C63FF', '#e0deff', '#c8c3ff'],
    },
    {
        id: 'obsidian',
        name: 'Obsidian',
        desc: 'Bold & Dynamic',
        accent: '#ffffff',
        bg: '#111118',
        lines: ['#ffffff', '#333340', '#22222e'],
    },
    {
        id: 'emerald',
        name: 'Emerald',
        desc: 'Classic Executive',
        accent: '#10b981',
        bg: '#F0FDF4',
        lines: ['#10b981', '#d1fae5', '#bbf7d0'],
    },
    {
        id: 'velvet',
        name: 'Velvet',
        desc: 'Creative & Visual',
        accent: '#ec4899',
        bg: '#FDF4FF',
        lines: ['#ec4899', '#fce7f3', '#fbcfe8'],
    },
];

/** Renders a lightweight CSS resume-mockup instead of relying on external images */
function TemplateMockup({ accent, bg, lines }: { accent: string; bg: string; lines: string[] }) {
    return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: bg }}>
            {/* Header strip */}
            <div className="h-[30%] px-5 pt-5 pb-3 flex flex-col justify-end" style={{ backgroundColor: accent + '22' }}>
                <div className="w-16 h-2 rounded-full mb-2" style={{ backgroundColor: accent }} />
                <div className="w-24 h-1.5 rounded-full mb-1" style={{ backgroundColor: accent + '80' }} />
                <div className="w-20 h-1 rounded-full" style={{ backgroundColor: accent + '40' }} />
            </div>
            {/* Body lines */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-3">
                {[0.8, 0.6, 0.9, 0.5, 0.75, 0.4, 0.85, 0.55].map((w, i) => (
                    <div
                        key={i}
                        className="h-1.5 rounded-full"
                        style={{ width: `${w * 100}%`, backgroundColor: lines[i % lines.length] }}
                    />
                ))}
                <div className="mt-2 flex gap-2 flex-wrap">
                    {[40, 35, 50, 30].map((pw, i) => (
                        <div key={i} className="h-4 rounded" style={{ width: `${pw}%`, backgroundColor: accent + '22' }}>
                            <div className="h-full w-1 ml-1.5 rounded-full inline-block align-middle" style={{ backgroundColor: accent }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function TemplateShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xDesktop = useTransform(scrollYProgress, [0, 1], ["5%", "-10%"]);

    return (
        <section ref={containerRef} className="py-20 md:py-32 overflow-hidden bg-bg-base/30 relative">
            <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="h-px w-10 bg-accent" />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Gallery</span>
                    </motion.div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tighter leading-none mb-4">
                        Curated Styles <br />for the{" "}
                        <span className="text-secondary italic">Modern Era.</span>
                    </h2>
                    <p className="text-foreground/40 text-base md:text-lg max-w-lg leading-relaxed">
                        Design-first templates built to bypass ATS filters while stunning hiring managers.
                    </p>
                </div>

                <Link href="/templates" className="shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[11px]"
                    >
                        Explore all 12+ styles{" "}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </Link>
            </div>

            {/* Scrolling Gallery — horizontal scroll on mobile, parallax drift on desktop */}
            <div className="relative">
                {/* Mobile: scrollable row */}
                <div className="flex md:hidden gap-5 px-6 overflow-x-auto no-scrollbar pb-4">
                    {TEMPLATES.map((tmpl, idx) => (
                        <motion.div
                            key={tmpl.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="shrink-0 w-[260px] group"
                        >
                            <TemplateCard tmpl={tmpl} />
                        </motion.div>
                    ))}
                </div>

                {/* Desktop: parallax scroll */}
                <motion.div style={{ x: xDesktop }} className="hidden md:flex gap-8 px-[8vw]">
                    {TEMPLATES.map((tmpl, idx) => (
                        <motion.div
                            key={tmpl.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="shrink-0 w-[320px] xl:w-[360px] group"
                        >
                            <TemplateCard tmpl={tmpl} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="mt-16 md:mt-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />
        </section>
    );
}

function TemplateCard({ tmpl }: { tmpl: typeof TEMPLATES[number] }) {
    return (
        <div className="relative w-full aspect-[1/1.414] rounded-2xl overflow-hidden border border-white/8 shadow-2xl transition-all duration-700 group-hover:scale-[1.03] group-hover:border-white/20 group-hover:shadow-black/50">
            {/* CSS Resume Mockup */}
            <TemplateMockup accent={tmpl.accent} bg={tmpl.bg} lines={tmpl.lines} />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-void/90 via-bg-void/20 to-transparent" />

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tmpl.accent }} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/50">{tmpl.desc}</span>
                </div>
                <h3 className="text-2xl font-display font-black tracking-tight text-white mb-3">{tmpl.name}</h3>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: tmpl.accent }}>
                    Preview Style <Sparkles className="w-3 h-3" />
                </button>
            </div>

            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    );
}
