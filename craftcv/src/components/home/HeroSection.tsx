"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { TextScramble } from "@/components/ui/TextScramble";
import { PageEntrance, EntranceItem } from "@/components/ui/PageEntrance";
import { transition } from "@/lib/motion.config";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { ParticleField, WordMorph } from "./HeroEffects";

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            animate(0, value, {
                duration,
                onUpdate: (latest) => setCount(Math.floor(latest)),
                ease: "easeOut",
            });
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{count}</span>;
}

function BackgroundMesh() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px] mix-blend-screen"
            />
            <motion.div
                animate={{
                    x: [0, -30, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen"
            />
        </div>
    );
}

function StaggeredHeadline({ text }: { text: string }) {
    const words = text.split(" ");
    return (
        <span className="inline-flex flex-wrap gap-x-[0.2em]">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

export function HeroSection() {
    const [isMounted, setIsMounted] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 150, mass: 0.5 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);
    const rotateX = useTransform(smoothMouseY, [0, 900], [6, -6]);
    const rotateY = useTransform(smoothMouseX, [0, 1440], [-6, 6]);

    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-24 pb-16">
            {/* Animated Mesh Background & Particle Field */}
            <BackgroundMesh />
            <ParticleField />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(108,99,255,0.2),transparent)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
                {/* ── LEFT: Text Content ── */}
                <div className="relative z-10 flex flex-col items-start">
                    <PageEntrance className="flex flex-col items-start">
                        {/* Badge */}
                        <EntranceItem>
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-xl mb-8 shadow-lg">
                                <span className="flex h-2 w-2 rounded-full bg-accent-sharp animate-pulse shadow-[0_0_8px_var(--accent-sharp)]" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-foreground/50 uppercase">CraftCV AI Studio</span>
                            </div>
                        </EntranceItem>

                        {/* Headline */}
                        <EntranceItem>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-6 text-white flex flex-col items-start">
                                <motion.span
                                    className="block opacity-40 mb-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                >
                                    <StaggeredHeadline text="The definitive" />
                                </motion.span>
                                <span className="block relative">
                                    <StaggeredHeadline text="resume" />
                                    <motion.span
                                        className="absolute -bottom-2 left-0 h-1.5 bg-accent rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "60%" }}
                                        transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </span>
                                <WordMorph words={["builder.", "architect.", "arsenal.", "storyteller."]} />
                            </h1>
                        </EntranceItem>

                        {/* Sub */}
                        <EntranceItem>
                            <p className="text-base sm:text-lg md:text-xl text-foreground/40 mb-10 max-w-lg leading-relaxed tracking-tight">
                                Elevate your career with an award-winning layout.{" "}
                                <span className="text-foreground/70 font-medium italic">
                                    Radical clarity meets intelligent design.
                                </span>
                            </p>
                        </EntranceItem>

                        {/* CTAs */}
                        <EntranceItem>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                                <Magnetic strength={0.1}>
                                    <Link href="/onboarding" className="block">
                                        <Button size="lg" className="w-full sm:w-auto px-8 sm:px-12 rounded-full shadow-3xl shadow-accent/20 font-black uppercase tracking-widest text-[11px] h-14 shimmer-btn">
                                            Start Building <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </Magnetic>
                                <Magnetic strength={0.1}>
                                    <Link href="/templates" className="block">
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 sm:px-12 rounded-full hover:border-white/20 transition-all h-14 font-black uppercase tracking-widest text-[11px] shimmer-btn">
                                            View Templates
                                        </Button>
                                    </Link>
                                </Magnetic>
                            </div>
                        </EntranceItem>

                        {/* Trust signals */}
                        <EntranceItem>
                            <div className="mt-10 flex flex-wrap items-center gap-5 text-foreground/30">
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                                    <Zap className="w-3.5 h-3.5 text-accent-sharp" /> AI-Powered
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                                    <Shield className="w-3.5 h-3.5 text-secondary" /> <Counter value={98} />% ATS Pass Rate
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                                    <Sparkles className="w-3.5 h-3.5 text-accent" /> <Counter value={12} />+ Templates
                                </div>
                            </div>
                        </EntranceItem>
                    </PageEntrance>
                </div>

                {/* ── RIGHT: Resume Mockup with 3D Tilt ── */}
                <div className="relative flex justify-center items-center lg:justify-end">
                    {isMounted ? (
                        <motion.div
                            style={{ perspective: 1200, rotateX, rotateY, transformStyle: "preserve-3d" }}
                            className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto lg:mx-0"
                        >
                            {/* Main A4 Card */}
                            <motion.div
                                className="relative rounded-xl overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.5)] border border-white/10"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <ResumePreviewCard />
                                {/* Gloss overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                            </motion.div>

                            {/* Floating Badge: ATS */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -right-2 sm:-top-6 sm:-right-8 z-20 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-bg-elevated/80 border border-accent/30 flex items-center gap-2 sm:gap-3 shadow-2xl backdrop-blur-xl"
                                style={{ transform: "translateZ(40px)" }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-accent leading-none mb-0.5">AI Verified</p>
                                    <p className="text-sm font-bold text-white">98% ATS Match</p>
                                </div>
                            </motion.div>

                            {/* Floating Badge: Gemini */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-4 -left-2 sm:-bottom-4 sm:-left-8 z-20 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-bg-elevated/80 border border-secondary/30 flex items-center gap-2 sm:gap-3 shadow-2xl backdrop-blur-xl"
                                style={{ transform: "translateZ(60px)" }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary leading-none mb-0.5">Gemini Pro</p>
                                    <p className="text-sm font-bold text-white">Refining Summary...</p>
                                </div>
                            </motion.div>

                            {/* Glow beneath */}
                            <motion.div
                                style={{ transform: "translateZ(-20px)" }}
                                className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-accent/20 blur-[80px] -z-10 rounded-full opacity-60"
                            />
                        </motion.div>
                    ) : (
                        // SSR placeholder to prevent layout shift
                        <div className="w-full max-w-[460px] aspect-[1/1.41] rounded-xl bg-bg-surface animate-pulse" />
                    )}
                </div>
            </div>
        </section>
    );
}

/** Inline high-fidelity resume preview card */
function ResumePreviewCard() {
    return (
        <div className="bg-white text-gray-900 w-full" style={{ aspectRatio: "1 / 1.414", fontFamily: "Georgia, serif" }}>
            {/* Header */}
            <div className="bg-[#6C63FF] px-6 pt-5 pb-4">
                <h2 className="text-white font-bold text-xl tracking-tight">Sohan Mandal</h2>
                <p className="text-white/80 text-[11px] uppercase tracking-widest font-sans mt-0.5">Senior Product Designer</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5">
                    {["sohan@craftcv.ai", "Bangalore, India", "+91 9955776655"].map(d => (
                        <span key={d} className="text-white/70 text-[9px] font-sans">{d}</span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-3">
                {/* Summary */}
                <div>
                    <p className="text-[8px] font-sans font-black uppercase tracking-[0.2em] text-[#6C63FF] mb-1">Professional Narrative</p>
                    <p className="text-[9px] leading-relaxed text-gray-600">
                        Award-winning Product Designer with 8+ years of experience building cinematic interface systems. Expert in bridging high-end digital aesthetics and functional usability.
                    </p>
                </div>

                {/* Experience */}
                <div>
                    <p className="text-[8px] font-sans font-black uppercase tracking-[0.2em] text-[#6C63FF] mb-1.5">Work Experience</p>
                    {[
                        { role: "Lead Design Strategist", co: "Creative, Inc.", date: "2022–Present", bullets: ["Spearheaded core productivity platform redesign — 40% retention uplift", "Architected cross-functional design system adopted by 15 engineers"] },
                        { role: "Senior UX Designer", co: "Flow Dynamics", date: "2019–2022", bullets: ["Designed scalable UI used across 5 flagship applications", "Reduced time-to-market by 30% via standardized tokenization"] }
                    ].map((job) => (
                        <div key={job.co} className="mb-2.5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-900">{job.role}</p>
                                    <p className="text-[8px] text-gray-500 font-sans">{job.co}</p>
                                </div>
                                <p className="text-[8px] text-gray-400 font-sans shrink-0">{job.date}</p>
                            </div>
                            <ul className="mt-1 space-y-0.5">
                                {job.bullets.map(b => (
                                    <li key={b} className="text-[8px] text-gray-600 leading-relaxed pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-[#6C63FF]">{b}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div>
                    <p className="text-[8px] font-sans font-black uppercase tracking-[0.2em] text-[#6C63FF] mb-1.5">Expertise & Stack</p>
                    <div className="flex flex-wrap gap-1">
                        {["React", "Next.js", "Framer Motion", "TypeScript", "UI Engineering", "Design Systems", "3D Visuals"].map(s => (
                            <span key={s} className="text-[8px] px-2 py-0.5 rounded bg-[#6C63FF]/10 text-[#6C63FF] font-sans font-bold">{s}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
