"use client";

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { insforge } from '@/lib/insforge';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Github, Sparkles } from 'lucide-react';
import Link from 'next/link';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('redirect') || '/dashboard';

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: signInError } = await insforge.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                window.location.href = callbackUrl; // Force full reload to reset InsForgeProvider state context
            } else {
                const { data, error: signUpError } = await insforge.auth.signUp({
                    email,
                    password,
                    name,
                });
                if (signUpError) throw signUpError;

                if (data?.requireEmailVerification) {
                    setError("Please verify your email address to continue.");
                } else if (data?.accessToken) {
                    window.location.href = callbackUrl;
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: any) => {
        try {
            await insforge.auth.signInWithOAuth({
                provider,
                redirectTo: `${window.location.origin}${callbackUrl}`,
            });
        } catch (err: any) {
            setError(err.message || 'OAuth authentication failed.');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-background">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Back link — not absolute anymore, sits in normal flow */}
            <div className="relative z-20 px-4 sm:px-8 pt-6">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Home</span>
                </Link>
            </div>

            {/* Form container — centered in remaining space */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md z-10 p-4 sm:p-8"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                            className="w-16 h-16 bg-gradient-to-tr from-accent to-secondary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(108,99,255,0.3)]"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                            {isLogin ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-foreground/50">
                            {isLogin ? "Enter your details to access your workspace." : "Start building your professional resume today."}
                        </p>
                    </div>

                    <div className="glass-card-dark rounded-3xl p-8 relative overflow-hidden backdrop-blur-2xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                        {/* Tab Switcher */}
                        <div className="flex bg-surface/50 rounded-xl p-1 mb-8 relative z-10 w-full max-w-[200px] mx-auto border border-white/5">
                            <button
                                onClick={() => { setIsLogin(true); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${isLogin ? 'text-foreground shadow-sm bg-white/10' : 'text-foreground/50 hover:text-foreground/80'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${!isLogin ? 'text-foreground shadow-sm bg-white/10' : 'text-foreground/50 hover:text-foreground/80'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
                            <AnimatePresence mode="popLayout">
                                <motion.div className="space-y-4">
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Full Name"
                                                    className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-foreground/30"
                                                    required={!isLogin}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-foreground/30"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-foreground/30"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-400 text-center"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-base font-semibold relative overflow-hidden group"
                            >
                                {!loading && (
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                    />
                                )}
                                {loading ? "Processing..." : isLogin ? "Sign In to Workspace" : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#101014] px-2 text-foreground/40 font-semibold tracking-wider">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handleOAuth('google')}
                                    className="w-full bg-surface/20 border-white/10 hover:bg-surface/50"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleOAuth('github')}
                                    className="w-full bg-surface/20 border-white/10 hover:bg-surface/50"
                                >
                                    <Github className="w-5 h-5 mr-2" />
                                    GitHub
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin" />
            </div>
        }>
            <AuthForm />
        </Suspense>
    );
}
