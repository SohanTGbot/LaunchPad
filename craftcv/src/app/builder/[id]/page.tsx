"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SectionNavigator } from './components/SectionNavigator';
import { EditorPane } from './components/EditorPane';
import { LivePreview } from './components/LivePreview';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { useAutoSave } from '@/hooks/useAutoSave';
import {
    ArrowLeft, Download, Sparkles, Maximize2, Minimize2,
    History, LayoutList, PenLine, Monitor, CheckCheck,
    ChevronDown, Check
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { insforge } from '@/lib/insforge';
import { calculateHeuristicScore } from '@/lib/ats';
import { motion, AnimatePresence } from 'framer-motion';
import { PageEntrance, EntranceItem } from '@/components/ui/PageEntrance';
import { Magnetic } from '@/components/ui/Magnetic';


// ─── ATS Score Color helper ─────────────────────────────────────────────────
function getAtsColor(score: number) {
    if (score >= 80) return '#A3FF12';    // accent-sharp green
    if (score >= 60) return '#0CF0C5';    // teal
    if (score >= 40) return '#f59e0b';    // amber
    return '#ef4444';                     // red
}

// ─── Command Button ──────────────────────────────────────────────────────────
function CommandButton({
    icon, label, onClick, disabled, accent
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    accent?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${disabled ? 'opacity-20 cursor-not-allowed' : accent
                    ? 'text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:border-accent/40'
                    : 'text-foreground/40 hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/5'
                }`}
        >
            <span className={`transition-all duration-200 ${!disabled && !accent ? 'group-hover:scale-110 group-hover:text-accent' : ''}`}>
                {icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">{label}</span>
        </button>
    );
}

// ─── Save Indicator ──────────────────────────────────────────────────────────
function SaveIndicator({ isSaving }: { isSaving?: boolean }) {
    return (
        <AnimatePresence mode="wait">
            {isSaving ? (
                <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-2.5 h-2.5 rounded-full border border-t-foreground/30 border-foreground/10"
                    />
                    <span className="hidden sm:block">Saving</span>
                </motion.div>
            ) : (
                <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
                    <Check className="w-3 h-3 text-accent-sharp" />
                    <span className="hidden sm:block">Saved</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Mobile Tab Bar ──────────────────────────────────────────────────────────
function MobileTabBar({
    tab, setTab, onExport, onToggleAI, atsScore
}: {
    tab: string;
    setTab: (t: any) => void;
    onExport: () => void;
    onToggleAI: () => void;
    atsScore: number;
}) {
    const tabs = [
        { id: 'outline', label: 'Outline', icon: <LayoutList className="w-4 h-4" /> },
        { id: 'editor', label: 'Editor', icon: <PenLine className="w-4 h-4" /> },
        { id: 'preview', label: 'Preview', icon: <Monitor className="w-4 h-4" /> },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/[0.06] bg-bg-base/90 backdrop-blur-2xl px-2 py-1.5 safe-area-pb">
            {tabs.map(t => (
                <button
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={`relative flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all duration-300
                        ${tab === t.id ? 'text-accent' : 'text-foreground/30'}`}
                >
                    {tab === t.id && (
                        <motion.div
                            layoutId="mobileTabIndicator"
                            className="absolute inset-0 bg-accent/8 rounded-xl border border-accent/15 -z-10"
                            transition={{ type: 'spring', bounce: 0.12, duration: 0.45 }}
                        />
                    )}
                    {t.icon}
                    <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
                </button>
            ))}

            {/* AI Button */}
            <button
                onClick={onToggleAI}
                className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl text-accent/70 hover:text-accent transition-all"
            >
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest">AI</span>
            </button>

            {/* ATS score mini chip */}
            <div className="flex flex-col items-center gap-0.5 flex-1">
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center border-2 text-[9px] font-black"
                    style={{ borderColor: getAtsColor(atsScore), color: getAtsColor(atsScore) }}
                >
                    {atsScore}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-foreground/20">ATS</span>
            </div>
        </div>
    );
}


// ─── Floating Command Bar ────────────────────────────────────────────────────
function CommandBar({
    onUndo, onRedo, onToggleAI, onFocus, onExport,
    past, future, atsScore
}: {
    onUndo: () => void;
    onRedo: () => void;
    onToggleAI: () => void;
    onFocus: () => void;
    onExport: () => void;
    past: any[];
    future: any[];
    atsScore: number;
}) {
    const color = getAtsColor(atsScore);

    return (
        <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.6 }}
            className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] items-center gap-1.5 p-2 rounded-2xl border border-white/[0.08] bg-bg-elevated/80 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] shadow-black"
        >
            {/* ATS Score Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl mr-1" style={{ backgroundColor: color + '12', border: `1px solid ${color}25` }}>
                <div className="relative w-6 h-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke={color + '20'} strokeWidth="2.5" />
                        <motion.circle
                            cx="12" cy="12" r="10" fill="none"
                            stroke={color} strokeWidth="2.5" strokeLinecap="round"
                            strokeDasharray="62.83"
                            initial={{ strokeDashoffset: 62.83 }}
                            animate={{ strokeDashoffset: 62.83 - (62.83 * atsScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black" style={{ color }}>
                        {atsScore}
                    </span>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest leading-none" style={{ color }}>ATS</p>
                    <p className="text-[8px] font-bold text-foreground/25 leading-none mt-0.5">
                        {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : atsScore >= 40 ? 'Fair' : 'Needs Work'}
                    </p>
                </div>
            </div>

            <div className="w-px h-7 bg-white/[0.05]" />

            {/* History */}
            <CommandButton icon={<History className="w-4 h-4" />} label="Undo" onClick={onUndo} disabled={past.length === 0} />
            <CommandButton icon={<History className="w-4 h-4 scale-x-[-1]" />} label="Redo" onClick={onRedo} disabled={future.length === 0} />

            <div className="w-px h-7 bg-white/[0.05]" />

            <CommandButton icon={<Sparkles className="w-4 h-4" />} label="AI Assist" onClick={onToggleAI} accent />
            <CommandButton icon={<Maximize2 className="w-4 h-4" />} label="Focus" onClick={onFocus} />

            <div className="w-px h-7 bg-white/[0.05] mx-1" />

            <Magnetic strength={0.08}>
                <Button
                    size="sm"
                    className="h-10 rounded-xl px-6 bg-foreground text-bg-void font-black uppercase tracking-wider text-[10px] hover:bg-accent-sharp hover:text-white transition-all shadow-xl hover:shadow-accent-sharp/20 flex items-center gap-2"
                    onClick={onExport}
                >
                    <Download className="w-3.5 h-3.5" />
                    Export
                </Button>
            </Magnetic>
        </motion.div>
    );
}

// ─── Builder Page ─────────────────────────────────────────────────────────────
export default function BuilderPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = React.use(paramsPromise);
    const { resume, updateTitle, setResume, undo, redo, past, future, setAtsAnalysis, atsAnalysis } = useResumeStore();
    const printRef = useRef<HTMLDivElement>(null);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<'outline' | 'editor' | 'preview'>('editor');
    const [isLoading, setIsLoading] = useState(params.id !== 'new');
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isSaving, setIsSaving] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Real-time ATS Scoring
    useEffect(() => {
        if (!isLoading) {
            const score = calculateHeuristicScore(resume);
            setAtsAnalysis({ score });
        }
    }, [resume, isLoading, setAtsAnalysis]);

    // Mouse tracking for ambient BG
    useEffect(() => {
        const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', h, { passive: true });

        // Mobile check
        setIsMobile(window.innerWidth < 1024);

        return () => window.removeEventListener('mousemove', h);
    }, []);

    // Fetch resume
    useEffect(() => {
        if (params.id === 'new') return;
        const fetch = async () => {
            try {
                const { data, error } = await insforge.database.from('resumes').select('*').eq('id', params.id).single();
                if (error) throw error;
                if (data?.data) setResume(data.data);
            } catch (err) {
                console.error('Failed to load resume:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [params.id, setResume]);

    useAutoSave(params.id, isLoading);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: resume.title || 'CraftCV_Resume',
    });

    const safeExport = useCallback(() => handlePrint(), [handlePrint]);
    const toggleAI = useCallback(() => setIsAIAssistantOpen(v => !v), []);
    const toggleFocus = useCallback(() => setIsFocusMode(v => !v), []);


    const atsScore = atsAnalysis?.score || 0;
    const atsColor = getAtsColor(atsScore);

    return (
        <div className="h-[100dvh] w-full bg-bg-void flex flex-col overflow-hidden text-foreground selection:bg-accent/30 selection:text-white">

            {/* Ambient mesh gradient */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-bg-void">
                <div className="absolute inset-0 opacity-15">
                    <motion.div
                        animate={{ x: mousePos.x / 40, y: mousePos.y / 40 }}
                        transition={{ type: 'spring', damping: 60, stiffness: 50 }}
                        className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-accent/30 blur-[130px]"
                    />
                    <motion.div
                        animate={{ x: -mousePos.x / 30, y: -mousePos.y / 30 }}
                        transition={{ type: 'spring', damping: 50, stiffness: 40 }}
                        className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-secondary/20 blur-[150px]"
                    />
                </div>
                <div className="noise mix-blend-overlay opacity-[0.015]" />
            </div>

            {/* ── Header ── */}
            <EntranceItem>
                <header className="h-14 sm:h-16 border-b border-white/[0.06] bg-bg-elevated/60 flex items-center justify-between px-4 sm:px-6 shrink-0 backdrop-blur-2xl z-50 gap-4">

                    {/* Left: Back + Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Link
                            href="/dashboard"
                            className="p-2 text-foreground/30 hover:text-foreground transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 group shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>

                        <div className="w-px h-5 bg-white/8 hidden sm:block shrink-0" />

                        {/* Editable title */}
                        <div className="flex flex-col min-w-0 flex-1">
                            <input
                                type="text"
                                value={resume.title}
                                onChange={e => updateTitle(e.target.value)}
                                className="bg-transparent font-display text-sm font-bold border-none outline-none focus:ring-0 rounded px-0 py-0 text-foreground/80 hover:text-foreground focus:text-accent transition-colors w-full truncate max-w-[160px] sm:max-w-xs uppercase tracking-wider leading-none"
                                spellCheck={false}
                            />
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-sharp animate-pulse shadow-[0_0_6px_var(--accent-sharp)]" />
                                <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em] hidden sm:block leading-none">Editing Studio</span>
                            </div>
                        </div>

                        {/* Save indicator */}
                        <div className="hidden md:block">
                            <SaveIndicator isSaving={isSaving} />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* ATS Score pill in header */}
                        <div
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest"
                            style={{ color: atsColor, borderColor: atsColor + '30', backgroundColor: atsColor + '10' }}
                        >
                            <div className="w-4 h-4 relative">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 16 16">
                                    <circle cx="8" cy="8" r="6" fill="none" stroke={atsColor + '30'} strokeWidth="2" />
                                    <motion.circle
                                        cx="8" cy="8" r="6" fill="none"
                                        stroke={atsColor} strokeWidth="2" strokeLinecap="round"
                                        strokeDasharray="37.7"
                                        initial={{ strokeDashoffset: 37.7 }}
                                        animate={{ strokeDashoffset: 37.7 - (37.7 * atsScore) / 100 }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                    />
                                </svg>
                            </div>
                            <span>{atsScore}% ATS</span>
                        </div>

                        <div className="w-px h-5 bg-white/[0.06] hidden sm:block" />


                        {/* AI Assistant */}
                        <Magnetic strength={0.08}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:flex gap-2 text-accent bg-accent/8 hover:bg-accent/15 border border-accent/20 hover:border-accent/40 rounded-full px-4 h-9 transition-all duration-300 group"
                                onClick={toggleAI}
                            >
                                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold uppercase tracking-wider text-[10px]">AI</span>
                            </Button>
                        </Magnetic>

                        {/* Export */}
                        <Magnetic strength={0.08}>
                            <Button
                                size="sm"
                                className="px-5 sm:px-7 h-9 rounded-full bg-foreground text-bg-void hover:bg-accent-sharp hover:text-white transition-all shadow-xl group"
                                onClick={safeExport}
                            >
                                <Download className="w-3.5 h-3.5 mr-1.5 sm:block hidden group-hover:-translate-y-0.5 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-[10px]">Export</span>
                            </Button>
                        </Magnetic>
                    </div>
                </header>
            </EntranceItem>

            {/* ── Three-panel layout ── */}
            <PageEntrance className="flex-1 flex overflow-hidden p-0 lg:p-5 lg:gap-5 relative pb-16 lg:pb-28 bg-transparent">
                <motion.div
                    className="flex-1 flex w-full h-full lg:gap-5"
                    drag={isMobile ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                        const tabs: ('outline' | 'editor' | 'preview')[] = ['outline', 'editor', 'preview'];
                        const idx = tabs.indexOf(mobileTab);
                        if (info.offset.x < -80 || info.velocity.x < -400) { if (idx < 2) setMobileTab(tabs[idx + 1]); }
                        else if (info.offset.x > 80 || info.velocity.x > 400) { if (idx > 0) setMobileTab(tabs[idx - 1]); }
                    }}
                >
                    {/* Left: Section Navigator */}
                    <AnimatePresence mode="wait">
                        {!isFocusMode && (
                            <motion.aside
                                key="nav"
                                initial={{ x: -320, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -320, opacity: 0 }}
                                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                                className={`shrink-0 flex-col lg:rounded-2xl bg-white/[0.015] border border-white/[0.06] overflow-hidden shadow-xl
                                    lg:w-72 xl:w-80 lg:flex
                                    ${mobileTab === 'outline' ? 'flex w-full' : 'hidden'}
                                `}
                            >
                                <SectionNavigator />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Center: Editor */}
                    <motion.main
                        className={`flex-1 lg:rounded-2xl bg-white/[0.015] border border-white/[0.06] overflow-y-auto scrollbar-thin shadow-xl transition-all duration-500
                            ${isFocusMode ? 'max-w-3xl mx-auto shadow-[0_0_120px_rgba(0,0,0,0.9)]' : ''}
                            ${mobileTab === 'editor' ? 'block w-full' : 'hidden lg:block'}
                        `}
                    >
                        <div className="max-w-2xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-14 min-h-full">
                            <EditorPane />
                        </div>
                    </motion.main>

                    {/* Right: Live Preview */}
                    <AnimatePresence mode="wait">
                        {!isFocusMode && (
                            <motion.aside
                                key="preview"
                                initial={{ x: 320, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 320, opacity: 0 }}
                                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                                className={`h-full lg:rounded-2xl bg-white/[0.01] border border-white/[0.05] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]
                                    ${mobileTab === 'preview' ? 'flex w-full' : 'hidden lg:flex'}
                                `}
                            >
                                <LivePreview ref={printRef} />
                            </motion.aside>
                        )}
                    </AnimatePresence>
                </motion.div>
            </PageEntrance>

            {/* ── Floating Command Bar (desktop) ── */}
            {!isFocusMode && (
                <CommandBar
                    onUndo={undo}
                    onRedo={redo}
                    onToggleAI={toggleAI}
                    onFocus={toggleFocus}
                    onExport={safeExport}
                    past={past}
                    future={future}
                    atsScore={atsScore}
                />
            )}

            {/* ── Focus Mode Exit ── */}
            <AnimatePresence>
                {isFocusMode && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={toggleFocus}
                        className="fixed top-6 right-6 z-[70] flex items-center gap-2 px-5 py-2.5 rounded-full bg-bg-elevated/80 border border-white/10 hover:border-white/20 backdrop-blur-2xl transition-all group shadow-2xl"
                    >
                        <Minimize2 className="w-4 h-4 text-accent" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Exit Focus</span>
                        <kbd className="text-[9px] font-mono text-foreground/30 bg-white/5 px-1.5 py-0.5 rounded hidden sm:block">⌘↵</kbd>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Mobile Tab Bar ── */}
            <MobileTabBar
                tab={mobileTab}
                setTab={setMobileTab}
                onExport={safeExport}
                onToggleAI={toggleAI}
                atsScore={atsScore}
            />

            {/* ── AI Assistant Drawer ── */}
            <AIAssistantDrawer isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />

            {/* ── Loading Overlay ── */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        className="fixed inset-0 z-[100] bg-bg-void/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="w-20 h-20 rounded-full border border-t-accent/60 border-accent/10"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-3 rounded-full border border-b-secondary/60 border-secondary/10"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-display font-black tracking-tighter italic text-shimmer mb-2">
                                Crafting Excellence
                            </h2>
                            <p className="text-foreground/30 text-[10px] tracking-[0.4em] uppercase font-mono">
                                Synthesizing your professional identity
                            </p>
                        </div>
                        {/* Loading progress bar */}
                        <motion.div className="w-48 h-0.5 rounded-full overflow-hidden bg-white/5">
                            <motion.div
                                className="h-full bg-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2, ease: 'easeInOut' }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
