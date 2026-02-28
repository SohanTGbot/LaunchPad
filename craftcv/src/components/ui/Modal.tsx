"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Frosted Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:px-6">
                        <motion.div
                            initial={{ y: "100%", scale: 1, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                // Scale in on desktop, slide up on mobile
                                scale: typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 1,
                            }}
                            exit={{
                                y: typeof window !== 'undefined' && window.innerWidth < 640 ? "100%" : 10,
                                scale: typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 0.95,
                                opacity: 0
                            }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg overflow-hidden rounded-t-2xl sm:rounded-2xl bg-surface border border-border shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border/50">
                                <h3 className="text-lg font-medium font-display">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-foreground/60 hover:text-foreground transition-colors rounded-full hover:bg-background/50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
