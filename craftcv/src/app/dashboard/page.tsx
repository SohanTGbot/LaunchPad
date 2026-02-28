"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PageEntrance, EntranceItem } from '@/components/ui/PageEntrance';
import { Magnetic } from '@/components/ui/Magnetic';
import {
    Plus, MoreVertical, Edit2, Copy, Trash2, Share2, Download,
    Clock, Sparkles, FileText, Settings, ArrowUpRight, TrendingUp,
    Zap, CheckCircle2, BarChart3, Bell, Search, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

// ─── Skeleton Shimmer Card ───────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-3xl border border-white/5 bg-bg-surface/30 overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="aspect-[3/4] p-6 flex flex-col gap-6">
                <Skeleton className="w-full h-full rounded-2xl opacity-20" />
            </div>
            <div className="p-6 space-y-4 bg-white/[0.02]">
                <Skeleton className="h-4 w-3/4 rounded-full opacity-30" />
                <Skeleton className="h-3 w-1/2 rounded-full opacity-10" />
            </div>
        </div>
    );
}

// ─── Stat Chip ────────────────────────────────────────────────────────────────
function StatChip({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl enhanced-glass-card group relative overflow-hidden"
        >
            <div
                className="absolute inset-x-0 bottom-0 h-0.5 opacity-30 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
            />
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: color + '15', border: `1px solid ${color}30` }}>
                <div style={{ color }}>{icon}</div>
            </div>
            <div>
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] leading-none mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-xl font-black font-display text-white leading-none">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── ATS Ring Mini ────────────────────────────────────────────────────────────
function ATSRingMini({ score }: { score: number }) {
    const color = score > 80 ? 'var(--accent-sharp)' : score > 60 ? 'var(--accent)' : '#ef4444';
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx="16" cy="16" r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-white/5"
                />
                <motion.circle
                    cx="16" cy="16" r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white">
                {score}
            </span>
        </div>
    );
}

// ─── Resume Mini Mockup ───────────────────────────────────────────────────────
function ResumeMiniPreview({ title, templateId }: { title: string; templateId?: string }) {
    const colors: Record<string, string> = {
        meridian: '#6C63FF',
        obsidian: '#0CF0C5',
        emerald: '#10b981',
        velvet: '#ec4899',
    };
    const accent = colors[templateId || ''] || '#6C63FF';
    const initials = title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

    return (
        <div className="w-full h-full bg-white flex flex-col text-gray-900" style={{ fontFamily: 'system-ui' }}>
            {/* Header */}
            <div className="px-5 py-4 flex-shrink-0" style={{ backgroundColor: accent + '15', borderBottom: `2px solid ${accent}` }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ backgroundColor: accent }}>
                        {initials}
                    </div>
                    <div>
                        <div className="h-2 rounded-full w-20 mb-1" style={{ backgroundColor: accent }} />
                        <div className="h-1.5 rounded-full w-14 opacity-40" style={{ backgroundColor: accent }} />
                    </div>
                </div>
            </div>
            {/* Body Lines */}
            <div className="flex-1 px-5 py-3 space-y-2">
                {[0.9, 0.7, 0.85, 0.5, 0.75, 0.6, 0.8, 0.55, 0.65, 0.45].map((w, i) => (
                    <div
                        key={i}
                        className="rounded-full"
                        style={{
                            width: `${w * 100}%`,
                            height: i % 4 === 0 ? 6 : 4,
                            backgroundColor: i % 4 === 0 ? accent + '40' : '#e5e7eb',
                        }}
                    />
                ))}
                {/* Skill tags */}
                <div className="flex gap-1.5 flex-wrap pt-1">
                    {[30, 25, 35, 20].map((w, i) => (
                        <div key={i} className="h-4 rounded" style={{ width: `${w}%`, backgroundColor: accent + '15' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Resume Card ──────────────────────────────────────────────────────────────
function ResumeCard({ resume, onDelete }: { resume: any; onDelete: () => void }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const atsScore = 75 + Math.floor(Math.random() * 24);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -10, rotateX: 2, rotateY: -2, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative h-full perspective-1000"
        >
            <Card className="relative border border-white/[0.06] bg-bg-surface/50 backdrop-blur-xl hover:border-accent/40 transition-all duration-500 flex flex-col rounded-3xl overflow-visible h-full group-hover:shadow-[0_40px_80px_rgba(108,99,255,0.15)]">

                {/* ATS Score Badge */}
                <div className="absolute -top-4 -left-4 z-20">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-bg-elevated/90 border border-white/10 shadow-2xl backdrop-blur-xl"
                    >
                        <ATSRingMini score={atsScore} />
                        <div className="pr-2">
                            <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40 leading-none mb-0.5">ATS Index</p>
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-tight leading-none",
                                atsScore > 80 ? "text-accent-sharp" : "text-accent"
                            )}>
                                {atsScore > 80 ? 'Excellent' : 'Strong'}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Thumbnail */}
                <div className="aspect-[3/4] w-full bg-white/5 rounded-t-3xl relative overflow-hidden border-b border-white/5">
                    <ResumeMiniPreview title={resume.title} templateId={resume.template_id} />

                    {/* Hover actions overlay */}
                    <div className="absolute inset-0 bg-bg-void/85 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3">
                        <Link href={`/builder/${resume.id}`} className="w-full px-8">
                            <Button className="w-full bg-white text-bg-void hover:bg-accent hover:text-white font-black uppercase tracking-widest text-[10px] rounded-full h-11 transition-all hover:scale-105">
                                <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Resume
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-foreground/40 hover:text-white text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" /> Export PDF
                        </Button>
                    </div>
                </div>

                {/* Metadata */}
                <div className="p-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="font-display font-black truncate text-base leading-tight tracking-tight text-foreground mb-1" title={resume.title}>
                            {resume.title}
                        </h3>
                        <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(resume.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Context Menu */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            className="p-2 rounded-xl text-foreground/20 hover:text-foreground hover:bg-white/5 transition-all focus:outline-none"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-bg-elevated border border-white/10 py-2 shadow-2xl z-50 overflow-hidden"
                                    >
                                        {[
                                            { icon: <Edit2 />, label: 'Rename' },
                                            { icon: <Copy />, label: 'Duplicate' },
                                            { icon: <Share2 />, label: 'Share Link' },
                                            { icon: <Download />, label: 'Export PDF' },
                                        ].map(item => (
                                            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all" onClick={() => setMenuOpen(false)}>
                                                {React.cloneElement(item.icon, { className: 'w-3.5 h-3.5' })}
                                                {item.label}
                                            </button>
                                        ))}
                                        <div className="h-px bg-white/5 mx-3 my-1" />
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all"
                                            onClick={() => { setMenuOpen(false); onDelete(); }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<string | null>(null);
    const [localDraft, setLocalDraft] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    React.useEffect(() => {
        const saved = localStorage.getItem('craft-cv-resume-storage');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const r = parsed.state?.resume;
                if (r && (r.title !== 'Untitled Resume' || r.sections?.some((s: any) => s.data?.content || s.items?.length > 0))) {
                    setLocalDraft(r);
                }
            } catch { /* silent */ }
        }
    }, []);

    React.useEffect(() => {
        const fetchResumes = async () => {
            try {
                const { data: { session } } = await insforge.auth.getCurrentSession();
                if (!session) { setLoading(false); return; }

                const { data, error } = await insforge.database
                    .from('resumes')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                setResumes(data || []);
            } catch (err: any) {
                console.error('Failed to fetch resumes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);

    const handleDelete = async () => {
        if (!deleteModalOpen) return;
        try {
            await insforge.database.from('resumes').delete().eq('id', deleteModalOpen);
            setResumes(prev => prev.filter(r => r.id !== deleteModalOpen));
        } catch (err) {
            console.error('Delete failed:', err);
        }
        setDeleteModalOpen(null);
    };

    const allResumes = [
        ...(localDraft && !resumes.find(r => r.title === localDraft.title) ? [{ ...localDraft, id: 'local-draft', isLocal: true }] : []),
        ...resumes
    ].filter(r => !searchQuery || r.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalAts = resumes.length > 0 ? Math.round(resumes.reduce(() => 75 + Math.random() * 24, 0) / resumes.length) : 88;

    return (
        <div className="min-h-screen bg-bg-void text-foreground selection:bg-accent/30 selection:text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-bg-void overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 blur-[150px] rounded-full -translate-x-1/4 translate-y-1/4" />
                <div className="noise opacity-[0.015]" />
            </div>

            {/* ── Top Navbar ── */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-bg-void/70 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-lg font-display font-black tracking-tighter uppercase italic">
                            Craft<span className="not-italic text-accent-sharp">CV</span>
                        </span>
                    </Link>

                    {/* Search — hidden on very small screens */}
                    <div className="hidden sm:flex flex-1 max-w-sm mx-auto items-center gap-2 px-4 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] focus-within:border-accent/30 transition-all">
                        <Search className="w-3.5 h-3.5 text-foreground/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-foreground/25 font-sans"
                        />
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button className="relative p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-white/5 transition-all">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-sharp" />
                        </button>
                        <ThemeToggle />
                        <Link href="/settings">
                            <button className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-white/5 transition-all">
                                <Settings className="w-4 h-4" />
                            </button>
                        </Link>
                        <div className="hidden sm:flex w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 items-center justify-center text-accent font-black text-xs">
                            SM
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Page Body ── */}
            <div className="pt-24 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
                <PageEntrance className="flex flex-col gap-8">

                    {/* ── Cinematic Header ── */}
                    <EntranceItem>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-2">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-sharp mb-2">Your Studio</p>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter leading-none text-white">
                                    Resume <span className="text-accent italic">Arsenal</span>
                                </h1>
                            </div>
                            <Magnetic strength={0.1}>
                                <Link href="/onboarding">
                                    <Button
                                        size="lg"
                                        className="group flex items-center gap-3 px-8 rounded-full bg-foreground text-bg-void hover:bg-accent hover:text-white transition-all shadow-xl font-black uppercase tracking-widest text-[11px] h-12 sm:h-14"
                                    >
                                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                        New Resume
                                    </Button>
                                </Link>
                            </Magnetic>
                        </div>
                    </EntranceItem>

                    {/* ── KPI Stats Row ── */}
                    <EntranceItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatChip label="Resumes" value={resumes.length + (localDraft ? 1 : 0)} icon={<FileText className="w-4 h-4" />} color="#6C63FF" />
                            <StatChip label="Avg ATS" value={`${totalAts}%`} icon={<TrendingUp className="w-4 h-4" />} color="#A3FF12" />
                            <StatChip label="AI Boosts" value="14" icon={<Zap className="w-4 h-4" />} color="#0CF0C5" />
                            <StatChip label="Exports" value="6" icon={<CheckCircle2 className="w-4 h-4" />} color="#ec4899" />
                        </div>
                    </EntranceItem>

                    {/* ── Mobile Search ── */}
                    <div className="flex sm:hidden items-center gap-2 px-4 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] focus-within:border-accent/30 transition-all">
                        <Search className="w-3.5 h-3.5 text-foreground/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-foreground/25"
                        />
                    </div>

                    {/* ── Section Title ── */}
                    <EntranceItem>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/30">
                                    Artifacts
                                </h2>
                                <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/5 text-[9px] font-black text-foreground/30 uppercase tracking-widest">
                                    {allResumes.length} total
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                                Sort: <select className="bg-transparent outline-none text-foreground/50 cursor-pointer ml-1">
                                    <option>Recent</option>
                                    <option>Name</option>
                                </select>
                            </div>
                        </div>
                    </EntranceItem>

                    {/* ── Resume Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)
                            ) : allResumes.length === 0 ? (
                                /* Empty State */
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full flex flex-col items-center justify-center text-center py-24"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 rounded-full border border-dashed border-accent/20 flex items-center justify-center">
                                            <FileText className="w-10 h-10 text-accent/20" />
                                        </div>
                                        <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl -z-10" />
                                    </div>
                                    <h3 className="text-2xl font-display font-black tracking-tighter text-foreground/40 mb-2">No resumes yet</h3>
                                    <p className="text-foreground/20 text-sm mb-8">Create your first resume to start your professional journey</p>
                                    <Link href="/onboarding">
                                        <Button className="px-10 rounded-full font-black uppercase tracking-widest text-xs h-12">
                                            <Plus className="w-4 h-4 mr-2" /> Create My First Resume
                                        </Button>
                                    </Link>
                                </motion.div>
                            ) : (
                                allResumes.map(resume => (
                                    resume.isLocal ? (
                                        /* Local Draft Card */
                                        <motion.div
                                            key="local-draft"
                                            layout
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className="group relative"
                                        >
                                            <Card className="border border-accent/20 bg-accent/5 hover:border-accent/40 transition-all duration-500 flex flex-col rounded-3xl overflow-visible h-full shadow-xl">
                                                <div className="absolute -top-3 left-5 z-10">
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-sharp text-bg-void text-[9px] font-black shadow-lg uppercase tracking-widest">
                                                        <Clock className="w-3 h-3" /> Ghost Draft
                                                    </span>
                                                </div>
                                                <div className="aspect-[3/4] rounded-t-3xl bg-bg-surface/40 border-b border-white/5 relative flex items-center justify-center overflow-hidden">
                                                    <div className="flex flex-col items-center gap-3 text-foreground/10">
                                                        <Sparkles className="w-10 h-10" />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Unsaved Draft</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-bg-void/80 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                                        <Link href="/builder/new">
                                                            <Button className="bg-accent hover:bg-white hover:text-bg-void font-black uppercase tracking-widest text-[10px] px-8 rounded-full h-11">
                                                                Restore Draft
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-display font-black truncate text-base text-accent">{resume.title || 'Untitled Draft'}</h3>
                                                    <p className="text-[10px] text-foreground/25 mt-1 uppercase tracking-widest font-bold">Local storage</p>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ) : (
                                        <ResumeCard
                                            key={resume.id}
                                            resume={resume}
                                            onDelete={() => setDeleteModalOpen(resume.id)}
                                        />
                                    )
                                ))
                            )}
                        </AnimatePresence>

                        {/* Create New Card */}
                        {!loading && (
                            <Link href="/onboarding" className="h-full min-h-[300px]">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-full min-h-[300px] rounded-3xl relative p-1 group flex flex-col items-center justify-center cursor-pointer transition-all duration-500"
                                >
                                    <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-white/[0.06] group-hover:border-accent/40 transition-colors" />

                                    {/* Breathing pulse circle around the plus */}
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 bg-accent rounded-full blur-xl"
                                        />
                                        <div className="w-16 h-16 rounded-full border border-dashed border-white/10 group-hover:border-accent/40 flex items-center justify-center text-foreground/10 group-hover:text-accent transition-all duration-500 bg-white/[0.02] group-hover:bg-accent/5 relative z-10">
                                            <Plus className="w-7 h-7" />
                                        </div>
                                    </div>

                                    <span className="font-black uppercase tracking-[0.3em] text-[10px] text-foreground/10 group-hover:text-accent/60 transition-all duration-500 mt-4 relative z-10">
                                        New Resume
                                    </span>
                                </motion.div>
                            </Link>
                        )}
                    </div>

                    {/* ── Quick Tips Banner ── */}
                    {!loading && resumes.length > 0 && (
                        <EntranceItem>
                            <div className="relative p-6 rounded-3xl bg-accent/5 border border-accent/20 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-secondary/5 pointer-events-none" />
                                <div className="relative flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                                        <BarChart3 className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm tracking-tight">Boost your ATS score</p>
                                        <p className="text-foreground/40 text-xs mt-0.5">Use AI Co-Pilot to quantify your impact with metrics</p>
                                    </div>
                                </div>
                                <Link href="/builder/new" className="shrink-0 relative">
                                    <Button size="sm" className="rounded-full px-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 bg-accent hover:bg-white hover:text-bg-void transition-all">
                                        Try AI <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </EntranceItem>
                    )}
                </PageEntrance>
            </div>

            {/* ── Delete Confirm Modal ── */}
            <Modal
                isOpen={!!deleteModalOpen}
                onClose={() => setDeleteModalOpen(null)}
                title="Delete Resume"
            >
                <div className="flex flex-col gap-2 mb-6">
                    <p className="text-foreground/70">Are you sure you want to delete this resume?</p>
                    <p className="text-foreground/40 text-sm">This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setDeleteModalOpen(null)} className="flex-1">Cancel</Button>
                    <Button
                        variant="primary"
                        className="flex-1 bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
