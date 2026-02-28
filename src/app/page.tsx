"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Sparkles, FileText, Download } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { Navbar } from "@/components/home/Navbar";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialMarquee } from "@/components/home/TestimonialMarquee";
import { TimelineSection } from "@/components/home/TimelineSection";
import { TemplateShowcase } from "@/components/home/TemplateShowcase";
import { PageEntrance, EntranceItem } from "@/components/ui/PageEntrance";
import { useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.1, 0.3]);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: "AI Co-Pilot",
      desc: "Real-time context-aware writing tools that quantify impact and refine your tone instantly."
    },
    {
      icon: <FileText className="w-6 h-6 text-secondary" />,
      title: "Direct Influence",
      desc: "12+ editorial-grade templates that bypass ATS constraints while maintaining radical visual clarity."
    },
    {
      icon: <Download className="w-6 h-6 text-accent-sharp" />,
      title: "Cinematic Export",
      desc: "Export pixel-perfect vector PDF or share a live, motion-enabled digital portfolio link."
    }
  ];

  return (
    <main className="min-h-screen bg-bg-void text-foreground overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          style={{ y: backgroundY, opacity: glowOpacity }}
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.06),transparent_70%)] blur-[120px]"
        />
        <div className="noise opacity-[0.02] mix-blend-overlay inset-0 absolute" />
      </div>

      <Navbar />

      {/* ① Hero */}
      <HeroSection />

      {/* ② Template Showcase */}
      <TemplateShowcase />

      {/* ③ Feature Highlights */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto relative">
        <PageEntrance>
          <EntranceItem>
            <div className="text-center mb-14 md:mb-24">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6"
              >
                Intelligence by Gemini
              </motion.div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tighter leading-none mb-5">
                Engineered for{" "}
                <span className="block sm:inline text-accent underline decoration-accent/20 underline-offset-8">
                  Peak Performance.
                </span>
              </h2>
              <p className="text-foreground/40 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                Our hybrid systems blend generative AI with precision design tokens to give you a competitive edge.
              </p>
            </div>
          </EntranceItem>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {features.map((feat, i) => (
              <EntranceItem key={i}>
                <div className="group relative h-full">
                  <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />
                  <Card className="relative p-8 md:p-12 h-full border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-500 group-hover:scale-[1.02] group-hover:bg-white/[0.04] overflow-hidden rounded-3xl">
                    <div className="mb-6 md:mb-10 p-4 rounded-2xl bg-white/[0.03] inline-block border border-white/10 group-hover:border-accent/30 transition-colors">
                      {feat.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-black mb-3 md:mb-4 tracking-tighter text-white">{feat.title}</h3>
                    <p className="text-foreground/40 leading-relaxed text-sm md:text-lg group-hover:text-foreground/60 transition-colors">{feat.desc}</p>
                  </Card>
                </div>
              </EntranceItem>
            ))}
          </div>
        </PageEntrance>
      </section>

      {/* ④ How it Works */}
      <TimelineSection />

      {/* ⑤ Stats */}
      <StatsSection />

      {/* ⑥ Testimonials */}
      <TestimonialMarquee />

      {/* ⑦ Footer CTA */}
      <footer className="border-t border-white/5 py-16 sm:py-20 md:py-28 text-center bg-bg-void relative z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-accent-sharp/20 bg-accent-sharp/5 text-[10px] font-black uppercase tracking-[0.3em] text-accent-sharp mb-8"
          >
            Ready to Elevate?
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter mb-8 text-white">
            Start your creation today.
          </h2>
          <p className="text-foreground/40 text-lg mb-10 leading-relaxed">
            Join 1.25M+ professionals who've already elevated their careers with LaunchPad.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="px-10 sm:px-14 rounded-full h-14 font-black uppercase tracking-widest text-[11px] shadow-3xl shadow-accent/20">
              Initiate Builder →
            </Button>
          </Link>
          <p className="mt-14 text-foreground/20 text-[10px] font-black uppercase tracking-[0.5em]">
            LaunchPad © {new Date().getFullYear()}. Designed for the 1%.
          </p>
        </div>
      </footer>
    </main>
  );
}
