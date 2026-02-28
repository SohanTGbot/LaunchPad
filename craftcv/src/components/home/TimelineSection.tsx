"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, FileText, Download } from "lucide-react";

export function TimelineSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const steps = [
        {
            icon: <FileText className="w-6 h-6 text-accent" />,
            title: "Choose a Template",
            desc: "Select perfectly balanced typography and layout."
        },
        {
            icon: <Sparkles className="w-6 h-6 text-secondary" />,
            title: "AI Generation",
            desc: "Gemini and OpenRouter rewrite your impact."
        },
        {
            icon: <Download className="w-6 h-6 text-green-400" />,
            title: "One-Click Export",
            desc: "Pixel-perfect A4 PDF or sharable web link."
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 md:py-32 px-6 max-w-4xl mx-auto relative">
            <div className="text-center mb-16 md:mb-24">
                <h2 className="text-3xl md:text-5xl font-display mb-4 tracking-tight">The process is simple.</h2>
                <p className="text-foreground/60 text-base md:text-lg">Three steps to your next career move.</p>
            </div>

            <div className="relative">
                {/* SVG Connecting Line — desktop only */}
                <svg className="hidden md:block absolute top-10 left-[45px] h-[calc(100%-40px)] w-[2px] overflow-visible" viewBox="0 0 2 100" preserveAspectRatio="none">
                    <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <motion.line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="100"
                        stroke="#6C63FF"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        style={{ pathLength }}
                    />
                </svg>

                <div className="flex flex-col gap-12 md:gap-24 relative z-10">
                    {steps.map((step, i) => (
                        <div key={i} className="flex gap-6 md:gap-12 items-start group">
                            {/* Icon Node */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="w-16 h-16 md:w-24 md:h-24 rounded-full glass-card border flex items-center justify-center shrink-0 border-white/10 group-hover:border-accent/50 group-hover:shadow-[0_0_30px_rgba(108,99,255,0.2)] transition-all duration-500 relative bg-surface/80"
                            >
                                {step.icon}
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-[9px] font-bold flex items-center justify-center text-white border border-background">
                                    0{i + 1}
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex flex-col justify-center pt-2"
                            >
                                <h3 className="text-xl md:text-2xl font-display mb-1.5 md:mb-2">{step.title}</h3>
                                <p className="text-foreground/60 text-sm md:text-lg leading-relaxed max-w-md">{step.desc}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
