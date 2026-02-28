import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './Button';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className={cn("relative w-full group", className)}>
                {/* Soft Focus Glow Background */}
                <AnimatePresence>
                    {isFocused && !error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute -inset-[2px] rounded-2xl bg-accent-sharp/10 blur-sm -z-10"
                        />
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -inset-1 rounded-2xl bg-red-500/20 blur-md -z-10"
                        />
                    )}
                </AnimatePresence>

                <motion.div
                    animate={error ? { x: [-3, 3, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                    className="relative"
                >
                    <input
                        id={inputId}
                        ref={ref}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        placeholder=" " // Required for the peer-placeholder-shown trick
                        className={cn(
                            "peer w-full h-16 px-6 pt-7 pb-2 rounded-2xl bg-bg-void/60 backdrop-blur-3xl border transition-all duration-700 outline-none shadow-2xl font-medium",
                            error
                                ? "border-red-500/30 focus:border-red-500 text-red-400"
                                : "border-white/5 focus:border-accent-sharp/40 focus:bg-bg-void/80 text-foreground",
                            "placeholder-transparent hover:border-white/10"
                        )}
                        {...props}
                    />
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "absolute left-6 top-5.5 text-foreground/20 transition-all duration-500 pointer-events-none origin-left text-[10px] font-black uppercase tracking-[0.3em]",
                            // Floating states
                            "peer-focus:-translate-y-4 peer-focus:scale-[0.8] peer-focus:text-accent-sharp",
                            "peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.8]",
                            error ? "peer-focus:text-red-500 text-red-500/40" : ""
                        )}
                    >
                        {label}
                    </label>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="mt-1.5 text-xs text-red-400 pl-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);
Input.displayName = "Input";
