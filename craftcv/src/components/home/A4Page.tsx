"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface A4PageProps {
    className?: string;
}

export function A4Page({ className = "" }: A4PageProps) {
    return (
        <div className={`aspect-[1/1.414] w-full bg-white shadow-2xl relative overflow-hidden text-[#1a1a1a] p-[8%] flex flex-col ${className}`}>
            {/* Header / Personal Info */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-[2.8em] font-bold leading-none tracking-tight text-[#000]">Sohan Mandal</h1>
                        <h2 className="text-[1.2em] font-medium text-accent mt-2 tracking-wide uppercase">Senior Product Designer</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-1 mt-6 text-[0.8em] text-gray-400 font-medium">
                    <div className="flex items-center gap-2"><Mail size={12} className="text-accent/40" /> sohan@craftcv.ai</div>
                    <div className="flex items-center gap-2"><Phone size={12} className="text-accent/40" /> +91 9988776655</div>
                    <div className="flex items-center gap-2"><MapPin size={12} className="text-accent/40" /> Bangalore, India</div>
                    <div className="flex items-center gap-2"><Globe size={12} className="text-accent/40" /> craftcv.design</div>
                </div>
            </div>

            {/* Content Mirroring Meridian Template Logic */}
            <div className="space-y-6 flex-1">
                {/* Summary */}
                <section>
                    <div className="text-[0.7em] font-black uppercase tracking-[0.2em] text-accent/30 mb-2 border-b border-gray-100 pb-1 flex justify-between items-center">
                        Professional Narrative
                        <Sparkles size={10} className="text-accent animate-pulse" />
                    </div>
                    <p className="text-[0.85em] leading-relaxed text-gray-600">
                        Award-winning Product Designer with 8+ years of experience in building cinematic interface systems. Expert in bridging the gap between high-end digital aesthetics and functional usability.
                    </p>
                </section>

                {/* Experience */}
                <section>
                    <div className="text-[0.7em] font-black uppercase tracking-[0.2em] text-accent/30 mb-3 border-b border-gray-100 pb-1">
                        Work Experience
                    </div>
                    <div className="space-y-4">
                        <div className="relative pl-4 border-l-2 border-accent/10">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[1em] font-bold text-gray-900">Lead Design Strategist</h3>
                                <span className="text-[0.7em] font-bold text-gray-400">2022 - Present</span>
                            </div>
                            <p className="text-[0.8em] font-medium text-gray-500 mb-2 underline decoration-accent/20 underline-offset-4">Creative Studio Inc.</p>
                            <ul className="text-[0.75em] text-gray-600 space-y-1.5 list-disc pl-3 marker:text-accent">
                                <li>Spearheaded the redesign of the core productivity platform, resulting in a 40% uptick in user retention.</li>
                                <li>Orchestrated cross-functional teams of 15 designers and engineers to deliver cinematic web experiences.</li>
                            </ul>
                        </div>

                        <div className="relative pl-4 border-l-2 border-accent/10">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[1em] font-bold text-gray-900">Senior UI Designer</h3>
                                <span className="text-[0.7em] font-bold text-gray-400">2019 - 2022</span>
                            </div>
                            <p className="text-[0.8em] font-medium text-gray-500 mb-2 underline decoration-accent/20 underline-offset-4">TechFlow Dynamics</p>
                            <ul className="text-[0.75em] text-gray-600 space-y-1.5 list-disc pl-3 marker:text-accent">
                                <li>Designed and implemented a scalable design system used across 5 flagship applications.</li>
                                <li>Reduced time-to-market for new features by 30% through standardized UI tokenization.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <div className="text-[0.7em] font-black uppercase tracking-[0.2em] text-accent/30 mb-3 border-b border-gray-100 pb-1">
                        Expertise & Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'Framer Motion', 'TypeScript', 'UI Engineering', 'Design Systems', '3D Visuals'].map(skill => (
                            <span key={skill} className="px-2 py-1 bg-accent/5 text-accent text-[0.7em] font-bold rounded-md border border-accent/10">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        </div>
    );
}
