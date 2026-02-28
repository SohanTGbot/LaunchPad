"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Search, Eye, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { PageEntrance, EntranceItem } from '@/components/ui/PageEntrance';
import { Magnetic } from '@/components/ui/Magnetic';

const TEMPLATES = [
    { id: 't1', name: 'Meridian', category: 'ATS-Friendly', tags: ['All roles', 'Single Column'], atsScore: 98, style: 'Clean' },
    { id: 't2', name: 'Nova', category: 'Creative', tags: ['Tech', 'Design'], atsScore: 85, style: 'Two-Column' },
    { id: 't3', name: 'Executive', category: 'Executive', tags: ['Senior roles', 'Finance'], atsScore: 95, style: 'Formal' },
    { id: 't4', name: 'Minimal', category: 'Simple', tags: ['Whitespace', 'Creative'], atsScore: 90, style: 'Minimalist' },
    { id: 't5', name: 'Academic', category: 'Academic', tags: ['PhD', 'Research'], atsScore: 100, style: 'Traditional' },
    { id: 't6', name: 'Cascade', category: 'Creative', tags: ['Marketing', 'Gradient'], atsScore: 80, style: 'Modern' },
];

function TemplateCard({ template }: { template: typeof TEMPLATES[0] }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative w-full aspect-[1/1.4] rounded-2xl cursor-pointer perspective-[1000px]"
        >
            <div className="absolute inset-0 glass-card border-white/10 overflow-hidden rounded-2xl transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-[0_0_80px_rgba(108,99,255,0.2)]">
                {/* Simulated Template Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-surface to-background opacity-80" />

                {/* UI Details on Card */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex justify-between items-start">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-white/90">
                            <Sparkles className="w-3 h-3 text-accent" /> {template.atsScore}% ATS
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl font-display font-bold mix-blend-plus-lighter">{template.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-foreground/60 font-mono">
                            <span className="text-accent">{template.category}</span>
                            <span className="w-1 h-1 rounded-full bg-foreground/20" />
                            <span>{template.style}</span>
                        </div>
                    </div>
                </div>

                {/* Animated Use Button (Slides up) */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20" style={{ transform: "translateZ(50px)" }}>
                    <Magnetic strength={0.1}>
                        <Button
                            variant="primary"
                            className="w-full shadow-2xl bg-white text-black hover:bg-accent-sharp hover:text-white transition-all"
                        >
                            Use Template
                        </Button>
                    </Magnetic>
                </div>
            </div>
        </motion.div>
    );
}

export default function TemplateGalleryPage() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]); // Adjust -65% based on number of cards

    // Background Mesh Gradient
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

    return (
        <main className="bg-bg-void relative selection:bg-accent/30 selection:text-white">
            <Navbar />

            {/* ── Mobile / Tablet: Standard Grid ── */}
            <div className="lg:hidden pt-24 pb-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase italic mb-3">
                            The Showcase <span className="font-sans not-italic text-accent-sharp">/</span>
                        </h1>
                        <p className="text-foreground/40 text-base leading-relaxed">
                            Every template is meticulously crafted for ATS compliance and visual impact.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {TEMPLATES.map((template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Desktop: Cinematic Horizontal Scroll ── */}
            <div ref={targetRef} className="hidden lg:block h-[300vh] relative">
                {/* Background Parallax Mesh */}
                <motion.div style={{ scale: bgScale }} className="fixed inset-0 z-0 pointer-events-none opacity-30">
                    <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] bg-secondary/10 blur-[180px] rounded-full mix-blend-screen" />
                </motion.div>

                <PageEntrance className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden z-10 px-8 xl:px-24">
                    <div className="mb-12 max-w-2xl">
                        <EntranceItem>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl xl:text-7xl font-display font-black mb-4 tracking-tighter uppercase italic"
                                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                            >
                                The Showcase <span className="font-sans not-italic text-accent-sharp font-black ml-2">/</span>
                            </motion.h1>
                        </EntranceItem>
                        <EntranceItem>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-foreground/40 leading-relaxed"
                            >
                                Scroll to explore our engineering masterpieces.{' '}
                                <span className="text-foreground/80 font-medium italic">
                                    Every template is meticulously crafted for ATS compliance and visual impact.
                                </span>
                            </motion.p>
                        </EntranceItem>
                    </div>

                    <div className="relative">
                        <motion.div style={{ x }} className="flex gap-10 py-10 pl-4 pr-[50vw]">
                            {TEMPLATES.map((template) => (
                                <div key={template.id} className="w-[320px] xl:w-[380px] shrink-0">
                                    <EntranceItem>
                                        <TemplateCard template={template} />
                                    </EntranceItem>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </PageEntrance>
            </div>
        </main>
    );
}
