"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
    { name: "Sarah J.", role: "Product Designer at Spotify", text: "CraftCV's typography and grid systems are flawless. It literally looks like I designed my resume in Figma for hours, but it took exactly 8 minutes." },
    { name: "Michael T.", role: "Senior Engineer at Stripe", text: "The ATS scanning feature is legit. My interview rate doubled after scanning my resume against their suggestions." },
    { name: "Elena R.", role: "Marketing Director", text: "Finally, a resume builder that isn't clunky. The cinematic previews and instant exports are a game changer." },
    { name: "David O.", role: "Recent Graduate", text: "I used the AI Co-Pilot to rewrite my bullet points. It took my generic intern experience and made it sound professional and impact-driven." },
    { name: "Jessica K.", role: "UX Researcher", text: "A breathtaking UI. Using this tool is an experience in itself. The exported PDF is pixel perfect." },
    { name: "Alex W.", role: "Operations Lead", text: "I've tried them all. CraftCV is the only one that truly abstracts the pain of layout management completely away." }
];

export function TestimonialMarquee() {
    return (
        <section className="py-16 sm:py-24 overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-bg-void to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-bg-void to-transparent z-10 pointer-events-none" />

            <div className="text-center mb-12 sm:mb-16 px-4">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-display mb-3 tracking-tight">Trusted by the best.</h2>
                <p className="text-foreground/60 text-sm sm:text-base">Join thousands landing roles at top tech companies.</p>
            </div>

            {/* Single infinite scroll track */}
            <div className="flex overflow-hidden w-full">
                <motion.div
                    className="flex gap-4 sm:gap-6 shrink-0"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                    style={{ width: "max-content" }}
                >
                    {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div
                            key={i}
                            className="w-[260px] sm:w-[320px] lg:w-[360px] shrink-0 bg-white/[0.02] border border-white/5 p-5 sm:p-7 rounded-2xl flex flex-col gap-4"
                        >
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className="w-3.5 h-3.5 fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-foreground/75 leading-relaxed italic text-sm sm:text-base whitespace-normal flex-1">
                                &quot;{t.text}&quot;
                            </p>
                            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center font-bold text-accent text-sm shrink-0">
                                    {t.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-white/90 text-sm truncate">{t.name}</p>
                                    <p className="text-xs text-foreground/50 truncate">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
