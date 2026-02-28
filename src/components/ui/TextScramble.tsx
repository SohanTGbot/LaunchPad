"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TextScrambleProps {
    text: string;
    className?: string;
    duration?: number;
    delay?: number;
    baseChars?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function TextScramble({
    text,
    className,
    duration = 1.5,
    delay = 0,
    baseChars = DEFAULT_CHARS
}: TextScrambleProps) {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const scramble = useCallback(() => {
        let iteration = 0;
        const totalIterations = text.length * 2; // Scramble intensity
        const interval = (duration * 1000) / totalIterations;

        const timer = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split('')
                    .map((char, index) => {
                        if (index < iteration / 2) {
                            return text[index];
                        }
                        return baseChars[Math.floor(Math.random() * baseChars.length)];
                    })
                    .join('')
            );

            if (iteration >= totalIterations) {
                clearInterval(timer);
                setDisplayText(text);
                setIsComplete(true);
            }

            iteration += 1;
        }, interval);

        return () => clearInterval(timer);
    }, [text, duration, baseChars]);

    useEffect(() => {
        const timeout = setTimeout(scramble, delay * 1000);
        return () => clearTimeout(timeout);
    }, [scramble, delay]);

    return (
        <span className={className}>
            {displayText || ' '}
        </span>
    );
}
