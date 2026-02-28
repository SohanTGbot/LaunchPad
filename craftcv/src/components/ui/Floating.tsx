"use client";

import { motion } from "framer-motion";
import React from "react";

interface FloatingProps {
    children: React.ReactNode;
    duration?: number;
    amount?: number;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function Floating({
    children,
    duration = 4,
    amount = 10,
    delay = 0,
    className = "",
    style
}: FloatingProps) {
    return (
        <motion.div
            animate={{
                y: [0, -amount, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}
