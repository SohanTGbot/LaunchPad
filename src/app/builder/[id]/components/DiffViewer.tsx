"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DiffViewerProps {
    oldContent: string;
    newContent: string;
    title?: string;
    onApply: () => void;
    onDiscard: () => void;
}

export function DiffViewer({ oldContent, newContent, title = "AI Suggestion", onApply, onDiscard }: DiffViewerProps) {
    // Simple word-level diff for visualization
    const oldWords = oldContent.split(' ');
    const newWords = newContent.split(' ');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6 premium-glass p-6 rounded-[32px] border border-accent/20 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-24 h-24 text-accent" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold">Review AI Enhancement</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Current</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-sm leading-relaxed text-foreground/40 italic line-through decoration-red-500/50">
                        {oldContent || "Section was empty."}
                    </div>
                </div>

                {/* After */}
                <div className="flex flex-col gap-3 relative">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit shadow-[0_0_15px_rgba(163,255,18,0.1)]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-sharp">Enhanced</span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-sm leading-relaxed text-foreground shadow-[inset_0_0_20px_rgba(163,255,18,0.05)]"
                    >
                        {newContent}
                    </motion.div>

                    {/* Visual Connection */}
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 hidden md:block">
                        <div className="w-6 h-6 rounded-full bg-bg-void border border-accent/30 flex items-center justify-center shadow-lg">
                            <ArrowRight className="w-3 h-3 text-accent" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <Button
                    variant="primary"
                    onClick={onApply}
                    className="flex-1 gap-2 h-12 bg-accent-sharp hover:bg-accent text-bg-void font-black uppercase tracking-wider text-xs shadow-xl shadow-accent/20"
                >
                    <Check className="w-4 h-4" />
                    Accept Changes
                </Button>
                <Button
                    variant="outline"
                    onClick={onDiscard}
                    className="gap-2 h-12 px-6 border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all text-foreground/60"
                >
                    <X className="w-4 h-4" />
                    Discard
                </Button>
            </div>
        </motion.div>
    );
}
