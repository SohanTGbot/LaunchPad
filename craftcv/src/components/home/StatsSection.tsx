"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
            }
        });
    }, [springValue]);

    return <span ref={ref}>0</span>;
}

export function StatsSection() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto border-y border-white/5 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                {[
                    { label: "Resumes Built", value: 1250000, suffix: "+" },
                    { label: "Templates", value: 12, suffix: "" },
                    { label: "ATS Pass Rate", value: 98, suffix: "%" },
                    { label: "Time Saved", value: 45, suffix: "m" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl border border-white/[0.04] bg-white/[0.01]"
                    >
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-2 leading-none">
                            <AnimatedNumber value={stat.value} />
                            {stat.suffix}
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-foreground/50 tracking-wider uppercase font-mono">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

        </section>
    );
}
