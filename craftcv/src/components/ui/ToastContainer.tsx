"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, Toast as ToastType } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOAST_ICONS = {
    success: <CheckCircle2 className="w-4 h-4 text-accent-sharp" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400" />,
};

function ToastItem({ toast }: { toast: ToastType }) {
    const { removeToast } = useToastStore();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex items-center gap-3 pl-4 pr-10 py-3 rounded-2xl border backdrop-blur-3xl shadow-2xl",
                "bg-bg-elevated/80 border-white/[0.08]"
            )}
        >
            <div className="shrink-0">
                {TOAST_ICONS[toast.type]}
            </div>
            <p className="text-[11px] font-bold text-foreground/90 leading-tight">
                {toast.message}
            </p>

            <button
                onClick={() => removeToast(toast.id)}
                className="absolute right-3 p-1 rounded-lg text-foreground/20 hover:text-foreground hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
            >
                <X className="w-3 h-3" />
            </button>

            {/* Subtle bottom progress bar for duration */}
            {toast.duration !== Infinity && (
                <motion.div
                    className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-accent/20 rounded-full overflow-hidden"
                    initial={{ opacity: 1 }}
                >
                    <motion.div
                        className="h-full bg-accent"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: (toast.duration || 4000) / 1000, ease: "linear" }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}

export function ToastContainer() {
    const { toasts } = useToastStore();

    return (
        <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none max-w-sm w-full sm:w-80">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
