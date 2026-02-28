"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StreamingTextProps {
    text: string;
    isStreaming: boolean;
    onComplete?: () => void;
    className?: string;
}

export function StreamingText({ text, isStreaming, onComplete, className }: StreamingTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const words = text.split(' ');
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        if (!isStreaming) {
            setDisplayedText(text);
            return;
        }

        if (wordIndex < words.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + (prev ? ' ' : '') + words[wordIndex]);
                setWordIndex(prev => prev + 1);
            }, 50); // Speed of streaming
            return () => clearTimeout(timeout);
        } else {
            onComplete?.();
        }
    }, [wordIndex, words, isStreaming, text, onComplete]);

    return (
        <div className={className}>
            {displayedText}
            {isStreaming && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1.5 h-4 bg-accent ml-1 align-middle"
                />
            )}
        </div>
    );
}
