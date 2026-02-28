"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            life: number;
            maxLife: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 1.5;
                this.maxLife = Math.random() * 100 + 100;
                this.life = this.maxLife;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
                this.life--;
                if (this.life <= 0) {
                    this.x = Math.random() * w;
                    this.y = Math.random() * h;
                    this.life = this.maxLife;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                const opacity = this.life / this.maxLife;
                ctx.fillStyle = `rgba(163, 255, 18, ${opacity * 0.3})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = Array.from({ length: 50 }, () => new Particle(canvas.width, canvas.height));
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update(canvas.width, canvas.height);
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resize);
        resize();
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none -z-10 opacity-30"
        />
    );
}

export function WordMorph({ words }: { words: string[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <div className="relative inline-block min-w-[200px] h-[1.1em] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ y: 20, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -20, opacity: 0, rotateX: 90 }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 15,
                        duration: 0.6
                    }}
                    className="absolute left-0 text-accent italic"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
