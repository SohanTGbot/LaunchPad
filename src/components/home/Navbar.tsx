"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-bg-void/60 backdrop-blur-3xl border-b border-white/5 py-3" : "bg-transparent py-5 sm:py-8"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center shrink-0">
                        <span className="text-xl sm:text-2xl font-display font-black tracking-tighter text-foreground transition-all duration-300 group-hover:text-accent-sharp uppercase italic">
                            Craft<span className="not-italic text-accent-sharp">CV</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link
                            href="/templates"
                            className="relative group text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-all"
                        >
                            Templates
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-accent-sharp group-hover:w-full transition-all duration-500" />
                        </Link>

                        <div className="flex items-center gap-8 border-l border-white/10 pl-10">
                            <Link
                                href="/auth"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-all"
                            >
                                Log in
                            </Link>
                            <ThemeToggle />
                            <Magnetic strength={0.1}>
                                <Link href="/onboarding">
                                    <Button
                                        size="sm"
                                        className="rounded-full px-8 h-10 bg-foreground text-bg-void hover:bg-accent-sharp hover:text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-foreground/5"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </Magnetic>
                        </div>
                    </div>

                    {/* Mobile: hamburger */}
                    <button
                        className="md:hidden p-2 rounded-xl text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden bg-bg-void/95 backdrop-blur-3xl border-b border-white/5"
                        >
                            <div className="flex flex-col gap-1 px-4 py-4">
                                <Link
                                    href="/templates"
                                    className="px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Templates
                                </Link>
                                <Link
                                    href="/auth"
                                    className="px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                                    <Button className="w-full mt-2 rounded-full h-12 bg-foreground text-bg-void font-black uppercase tracking-widest text-xs">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Mobile Bottom Pill Nav */}
            <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm premium-glass-dark rounded-full p-2 flex items-center justify-between z-[60] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden">
                <Link
                    href="/templates"
                    className="flex-1 text-center py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground active:scale-90 transition-all"
                >
                    Templates
                </Link>
                <div className="w-px h-5 bg-white/10" />
                <Link
                    href="/auth"
                    className="flex-1 text-center py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground active:scale-90 transition-all"
                >
                    Log in
                </Link>
                <div className="w-px h-5 bg-white/10" />
                <Link href="/onboarding" className="flex-1 px-2">
                    <Button
                        size="sm"
                        className="w-full rounded-full h-9 bg-foreground text-bg-void active:scale-95 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        Start
                    </Button>
                </Link>
            </div>
        </>
    );
}
