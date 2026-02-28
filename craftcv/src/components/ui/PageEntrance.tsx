"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { transition, variants } from '@/lib/motion.config';

interface PageEntranceProps {
    children: React.ReactNode;
    staggerDelay?: number;
    className?: string;
}

/**
 * Award-winning orchestration wrapper for page elements.
 * Automatically staggers child motion elements.
 */
export function PageEntrance({ children, staggerDelay = 0.08, className }: PageEntranceProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
                animate: {
                    transition: transition.stagger(staggerDelay)
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Animated component to be used inside PageEntrance
 */
export function EntranceItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            variants={variants.fadeInUp}
            transition={transition.pageEntrance}
            className={className}
        >
            {children}
        </motion.div>
    );
}
