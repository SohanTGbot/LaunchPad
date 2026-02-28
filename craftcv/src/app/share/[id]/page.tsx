"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useResumeStore, ResumeData } from '@/store/useResumeStore';
import { MeridianTemplate } from '@/templates/MeridianTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Printer, Globe, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PublicSharePage() {
    const params = useParams();
    const id = params.id as string;
    const { fetchResume } = useResumeStore();
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be an unauthenticated call to a public API
        // For now, we use the store but simulate the fetch
        const load = async () => {
            setIsLoading(true);
            try {
                // Mock delay for cinematic loading
                await new Promise(r => setTimeout(r, 1500));
                // We'll try to find it in the store or simulate a load
                // In a real prod environment, we'd fetch from DB by sharing token
                const data = await fetchResume(id);
                if (data) setResumeData(data);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id, fetchResume]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-void flex flex-col items-center justify-center p-4">
                <div className="relative w-24 h-24">
                    <motion.div
                        animate={{
                            rotate: 360,
                            borderRadius: ["20%", "50%", "20%"],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-accent/20"
                    />
                    <motion.div
                        animate={{
                            rotate: -360,
                            borderRadius: ["50%", "20%", "50%"],
                            scale: [1, 0.9, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-2 border-secondary/20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-accent animate-pulse" />
                    </div>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 italic"
                >
                    Resolving Secure Access...
                </motion.p>
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="min-h-screen bg-bg-void flex flex-col items-center justify-center p-4">
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-md">
                    <Shield className="w-12 h-12 text-red-500/40 mx-auto mb-6" />
                    <h1 className="text-2xl font-black font-display text-white mb-2">Access Revoked</h1>
                    <p className="text-foreground/40 text-sm leading-relaxed mb-8">
                        This resume link is either invalid or has been set to private by the owner.
                    </p>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-void selection:bg-accent/30 selection:text-white">
            {/* Premium Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 premium-glass border-b border-white/5 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                        <span className="text-sm font-black text-white">C</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 leading-none">Verified Resume</p>
                        <p className="text-sm font-bold text-white mt-1">{resumeData.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-foreground/40 hover:text-white">
                        <Download className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Download PDF</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="items-center gap-2 shadow-xl shadow-accent/20">
                        <Share2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Copy URL</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-24 px-4 flex flex-col items-center">
                {/* Hero Context */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                        <Eye className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Public View Protocol Active</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tighter mb-4">
                        Curated for Excellence
                    </h1>
                    <p className="text-foreground/40 text-lg leading-relaxed italic">
                        "Experience the professional journey of world-class talent, optimized for readability and impact."
                    </p>
                </motion.div>

                {/* Resume Paper View */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="relative group transition-all duration-1000"
                >
                    {/* Perspective Glows */}
                    <div className="absolute -inset-40 bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    <div className="absolute -inset-1 bg-gradient-to-tr from-accent/20 via-transparent to-secondary/20 rounded-lg blur-lg opacity-30" />

                    <div className="relative bg-white shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
                        style={{ width: 'min(90vw, 850px)', minHeight: '1202px' }}>

                        {/* Paper Texture */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply transition-opacity group-hover:opacity-[0.05]"
                            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]" />

                        {/* Template Rendering */}
                        <div className="p-0 text-black">
                            {resumeData.templateId === 't1' ? (
                                <MeridianTemplate data={resumeData} />
                            ) : (
                                <div className="p-20 text-center font-mono opacity-20">Renderer Default</div>
                            )}
                        </div>
                    </div>

                    {/* Quick Labels */}
                    <div className="absolute -right-24 top-20 flex flex-col gap-4 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-700 hidden lg:flex">
                        <div className="px-4 py-2 premium-glass border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> A4 Layout
                        </div>
                        <div className="px-4 py-2 premium-glass border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                            Full Quality
                        </div>
                    </div>
                </motion.div>

                {/* Footer Brand */}
                <div className="mt-24 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
                        Crafted with <span className="text-accent">CraftCV</span>
                    </p>
                </div>
            </main>

            {/* Floating Action Button for mobile */}
            <div className="fixed bottom-6 right-6 sm:hidden z-50">
                <Button size="lg" className="rounded-full w-14 h-14 p-0 shadow-2xl shadow-accent">
                    <Download className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
