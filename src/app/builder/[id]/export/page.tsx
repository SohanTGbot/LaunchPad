"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/useResumeStore';
import { MeridianTemplate } from '@/templates/MeridianTemplate';
import { motion } from 'framer-motion';
import { Download, FileText, Printer, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ExportPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { resume } = useResumeStore();
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const handleExport = async (type: string) => {
        setIsExporting(type);
        // Simulate export process
        await new Promise(r => setTimeout(r, 2000));
        setIsExporting(null);
        window.print(); // Traditional print as fallback/primary for PDF
    };

    if (!resume) return null;

    return (
        <div className="min-h-screen bg-bg-void text-white">
            {/* Header */}
            <header className="h-20 premium-glass border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl hover:bg-white/5 transition-colors text-foreground/40 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black font-display tracking-tight">Finalize & Export</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Resume Architecture: {resume.title}</p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#A3FF12]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">ATS Verified</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Export Options */}
                <div className="lg:col-span-4 space-y-8">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/20 mb-6">Download Options</h3>
                        <div className="space-y-4">
                            {[
                                { id: 'pdf', label: 'PDF Document', desc: 'Standard for all applications', icon: <Download className="w-5 h-5" />, accent: 'accent' },
                                { id: 'docx', label: 'Word Document', desc: 'Editable format', icon: <FileText className="w-5 h-5" />, accent: 'secondary' },
                                { id: 'text', label: 'Plain Text', desc: 'For simple ATS systems', icon: <Printer className="w-5 h-5" />, accent: 'foreground/40' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleExport(opt.id)}
                                    disabled={!!isExporting}
                                    className="w-full p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 group text-left relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-foreground/40 group-hover:text-accent transition-colors`}>
                                            {isExporting === opt.id ? <Zap className="w-6 h-6 animate-pulse" /> : opt.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-accent transition-colors">{opt.label}</p>
                                            <p className="text-xs text-foreground/30">{opt.desc}</p>
                                        </div>
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-accent/5 border border-accent/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck className="w-20 h-20 text-accent" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-accent mb-2">Pro Tip</h4>
                        <p className="text-xs text-foreground/60 leading-relaxed italic">
                            "PDF is the most stable format for layout preservation. Ensure your summary matches the target JD for a 12% higher interview rate."
                        </p>
                    </section>
                </div>

                {/* Right: Print Preview */}
                <div className="lg:col-span-8 flex flex-col items-center">
                    <div className="w-full mb-6 flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/20">Final Review</h3>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#A3FF12] shadow-[0_0_8px_#A3FF12]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Ready for Launch</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group print:m-0"
                    >
                        {/* Shadow Glow */}
                        <div className="absolute -inset-10 bg-accent/10 blur-[100px] opacity-20 pointer-events-none" />

                        <div className="relative bg-white shadow-2xl overflow-hidden print:shadow-none"
                            style={{ width: 'min(70vw, 794px)', transform: 'scale(1)', transformOrigin: 'top center' }}>

                            {/* Realistic Paper texture only shown on screen */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply print:hidden"
                                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

                            <div className="text-black">
                                <MeridianTemplate data={resume} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    nav, header, aside, button, .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    main {
                        display: block !important;
                        padding: 0 !important;
                        max-width: none !important;
                    }
                    .lg\\:col-span-8 {
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
