"use client";

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { Sparkles, FileSearch, Loader2, AlertCircle, CheckCircle2, Wand2, Plus, Type, MessageSquare, RotateCcw, XCircle, Briefcase, GraduationCap, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiffViewer } from './DiffViewer';
import { StreamingText } from '@/components/ui/StreamingText';

interface AIAssistantDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

function ToolButton({ icon, label, description, onClick, isLoading, compact }: any) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden active:scale-[0.98]
                ${isLoading
                    ? 'border-accent/40 bg-accent/5 cursor-wait'
                    : 'border-white/[0.05] bg-white/[0.02] hover:border-accent/40 hover:bg-accent/[0.02] hover:shadow-xl hover:shadow-accent/5'
                }
                ${compact ? 'p-3' : 'p-5'}
            `}
        >
            <div className="flex items-center gap-4">
                <div className={`shrink-0 flex items-center justify-center transition-all duration-500 rounded-xl
                    ${isLoading ? 'bg-accent/20 text-accent rotate-12 scale-110' : 'bg-white/[0.03] text-foreground/40 group-hover:text-accent group-hover:bg-accent/10 group-hover:rotate-6'}
                    ${compact ? 'w-10 h-10' : 'w-12 h-12'}
                `}>
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : React.cloneElement(icon, { className: compact ? "w-5 h-5" : "w-6 h-6" })}
                </div>
                <div className="flex-1">
                    <p className={`font-bold transition-colors tracking-tight
                        ${isLoading ? 'text-accent' : 'text-foreground/70 group-hover:text-foreground'}
                        ${compact ? 'text-sm' : 'text-lg'}
                    `}>{label}</p>
                    {description && <p className="text-xs text-foreground/30 mt-0.5 group-hover:text-foreground/50 transition-colors">{description}</p>}
                </div>
            </div>

            {/* Animated Loading Bar */}
            {isLoading && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent via-secondary to-accent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            )}

            {/* Hover Magic Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl" />
        </button>
    );
}

export function AIAssistantDrawer({ isOpen, onClose }: AIAssistantDrawerProps) {
    const { resume, updateSection } = useResumeStore();
    const [activeTab, setActiveTab] = useState<'ats' | 'copilot'>('ats');
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [activeToneIndex, setActiveToneIndex] = useState(1);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [stagedSuggestion, setStagedSuggestion] = useState<{
        sectionId: string;
        oldContent: string;
        newContent: string;
        title: string;
        type: 'text' | 'list';
        itemId?: string;
    } | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const { activeSectionId } = useResumeStore();
    const activeSection = resume.sections.find(s => s.id === activeSectionId);

    const handleStreamingAI = async (
        type: string,
        content: string,
        onChunk: (text: string) => void,
        onStart?: () => void,
        onEnd?: () => void
    ) => {
        const controller = new AbortController();
        setAbortController(controller);
        onStart?.();

        try {
            const res = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, type }),
                signal: controller.signal
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP error ${res.status}`);
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullText += chunk;
                    onChunk(fullText);
                }
            }
            return fullText;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Stream aborted');
                return null;
            }
            throw err;
        } finally {
            setAbortController(null);
            onEnd?.();
        }
    };

    const handleStopGeneration = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsGenerating(null);
        }
    };

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError('Please paste a job description first.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/ai/analyze-ats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeData: resume,
                    jobDescription,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze resume.');
            }

            setResult(data.analysis);
        } catch (err: any) {
            console.error('ATS Analysis Error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const commitSuggestion = () => {
        if (!stagedSuggestion) return;

        const section = resume.sections.find(s => s.id === stagedSuggestion.sectionId);
        if (!section) return;

        if (stagedSuggestion.type === 'text') {
            const textSection = section as any;
            updateSection(stagedSuggestion.sectionId, {
                data: { ...textSection.data, content: stagedSuggestion.newContent },
                metadata: {
                    isAiInfluenced: true,
                    originalContent: textSection.data?.content
                }
            });
        } else if (stagedSuggestion.type === 'list') {
            const listSection = section as any;
            const items = stagedSuggestion.newContent.split(',').map((s, idx) => ({
                id: `skill-gen-${Date.now()}-${idx}`,
                name: s.trim()
            })).filter(s => s.name);

            updateSection(stagedSuggestion.sectionId, {
                items,
                metadata: {
                    isAiInfluenced: true,
                    originalContent: listSection.items // Store old items for revert
                }
            });
        }

        setStagedSuggestion(null);
    };

    const handleGenerateSummary = async () => {
        const context = resume.sections
            .filter(s => ['experience', 'education', 'projects'].includes(s.type))
            .map(s => {
                const title = s.title;
                const items = 'items' in s ? (s.items as any[]).map((i: any) => JSON.stringify(i)).join(' ') : '';
                return `${title}: ${items}`;
            })
            .join('\n');

        const summarySection = resume.sections.find(s => s.type === 'summary');
        if (!summarySection || !('data' in summarySection)) return;

        let streamingText = '';
        await handleStreamingAI(
            'summarize',
            context || 'I am a professional looking to create a resume.',
            (text) => {
                streamingText = text;
                // We keep it in a temp var so we can stage it at the end
            },
            () => setIsGenerating('summary'),
            () => {
                setIsGenerating(null);
                setStagedSuggestion({
                    sectionId: summarySection.id,
                    oldContent: summarySection.data?.content || '',
                    newContent: streamingText,
                    title: "AI Professional Summary",
                    type: 'text'
                });
            }
        );
    };

    const handleAdjustTone = async (toneType: 'tone_formal' | 'tone_confident') => {
        const summarySection = resume.sections.find(s => s.type === 'summary');
        if (!summarySection || !('data' in summarySection) || !summarySection.data?.content) return;

        let streamingText = '';
        await handleStreamingAI(
            toneType,
            summarySection.data.content,
            (text) => {
                streamingText = text;
            },
            () => setIsGenerating(toneType),
            () => {
                setIsGenerating(null);
                setStagedSuggestion({
                    sectionId: summarySection.id,
                    oldContent: summarySection.data.content,
                    newContent: streamingText,
                    title: toneType === 'tone_formal' ? "Formal Refinement" : "Confident Refinement",
                    type: 'text'
                });
            }
        );
    };

    const handleSuggestSkills = async () => {
        const context = resume.sections
            .filter(s => ['experience', 'projects'].includes(s.type))
            .map(s => {
                const title = s.title;
                const items = 'items' in s ? (s.items as any[]).map((i: any) => JSON.stringify(i)).join(' ') : '';
                return `${title}: ${items}`;
            })
            .join('\n');

        const skillsSection = resume.sections.find(s => s.type === 'skills');
        if (!skillsSection) return;

        let streamingText = '';
        await handleStreamingAI(
            'suggest_skills',
            context || 'General professional experience.',
            (text) => {
                streamingText = text;
            },
            () => setIsGenerating('skills'),
            () => {
                setIsGenerating(null);
                setStagedSuggestion({
                    sectionId: skillsSection.id,
                    oldContent: (skillsSection as any).items?.map((i: any) => i.name).join(', ') || '',
                    newContent: streamingText,
                    title: "AI Skill Suggestions",
                    type: 'list'
                });
            }
        );
    };

    const handleContextTool = async (toolType: string, label: string) => {
        if (!activeSection) return;

        // Context depends on section type
        let context = '';
        if ('items' in activeSection) {
            context = activeSection.items.map((i: any) => JSON.stringify(i)).join('\n');
        } else if ('data' in activeSection) {
            context = JSON.stringify(activeSection.data);
        }

        let streamingText = '';
        await handleStreamingAI(
            toolType,
            context || 'Professional content.',
            (text) => {
                streamingText = text;
            },
            () => setIsGenerating(toolType),
            () => {
                setIsGenerating(null);
                setStagedSuggestion({
                    sectionId: activeSection.id,
                    oldContent: 'items' in activeSection
                        ? (activeSection.items as any[]).map(i => i.description || i.name).join('\n')
                        : (activeSection as any).data?.content || '',
                    newContent: streamingText,
                    title: label,
                    type: activeSection.type === 'skills' ? 'list' : 'text'
                });
            }
        );
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="AI Resume Assistant">
            <div className="flex flex-col gap-6 h-full relative">
                {/* Staged Suggestion Overlay */}
                <AnimatePresence>
                    {stagedSuggestion && (
                        <div className="absolute inset-x-0 top-0 z-[100] h-full bg-bg-void/80 backdrop-blur-md px-1 flex flex-col justify-start pt-12 overflow-y-auto custom-scrollbar">
                            <DiffViewer
                                title={stagedSuggestion.title}
                                oldContent={stagedSuggestion.oldContent}
                                newContent={stagedSuggestion.newContent}
                                onApply={commitSuggestion}
                                onDiscard={() => setStagedSuggestion(null)}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="flex bg-surface/50 p-1 rounded-xl border border-border">
                    <button
                        onClick={() => setActiveTab('ats')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all
                            ${activeTab === 'ats' ? 'bg-background text-accent shadow-sm' : 'text-foreground/40 hover:text-foreground/60'}
                        `}
                    >
                        <FileSearch className="w-3.5 h-3.5" />
                        ATS Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('copilot')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all
                            ${activeTab === 'copilot' ? 'bg-background text-accent shadow-sm' : 'text-foreground/40 hover:text-foreground/60'}
                        `}
                    >
                        <Wand2 className="w-3.5 h-3.5" />
                        AI Co-pilot
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'ats' ? (
                        <motion.div
                            key="ats"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Input Section */}
                            <div>
                                <label className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                                    <FileSearch className="w-4 h-4 text-accent" />
                                    Paste Job Description
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => {
                                        setJobDescription(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    placeholder="Paste the target job description here to analyze how well your resume matches..."
                                    className="w-full min-h-[150px] p-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm resize-y"
                                />
                            </div>

                            <div className="relative group">
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !jobDescription.trim()}
                                    className="w-full h-12 gap-2 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                    {isAnalyzing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isAnalyzing ? 'Scanning Resume Architecture...' : 'Analyze Market Fit'}
                                </Button>

                                {isAnalyzing && (
                                    <motion.div
                                        initial={{ top: "0%" }}
                                        animate={{ top: "100%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-accent/40 blur-sm pointer-events-none z-10"
                                    />
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Results Section */}
                            {result && (
                                <div className="flex-1 overflow-y-auto pr-1 space-y-6 pb-8 border-t border-border pt-6 mt-2 custom-scrollbar">
                                    {/* Score Circle */}
                                    <div className="flex flex-col items-center justify-center p-10 premium-glass rounded-3xl shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-secondary/20 opacity-30 pointer-events-none" />

                                        {/* Animated Background Magic */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 90, 0],
                                                opacity: [0.1, 0.2, 0.1]
                                            }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.2),transparent_70%)]"
                                        />

                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <defs>
                                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#6C63FF" />
                                                        <stop offset="100%" stopColor="#00D4FF" />
                                                    </linearGradient>
                                                    <filter id="glow">
                                                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                        <feMerge>
                                                            <feMergeNode in="coloredBlur" />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                </defs>
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="54"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.03)"
                                                    strokeWidth="10"
                                                />
                                                <motion.circle
                                                    cx="64"
                                                    cy="64"
                                                    r="54"
                                                    fill="none"
                                                    stroke="url(#scoreGradient)"
                                                    strokeWidth="10"
                                                    strokeLinecap="round"
                                                    strokeDasharray="339"
                                                    style={{ filter: 'url(#glow)' }}
                                                    initial={{ strokeDashoffset: 339 }}
                                                    animate={{ strokeDashoffset: 339 - (result.score / 100) * 339 }}
                                                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <motion.span
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                                    className="text-5xl font-bold font-display tracking-tighter text-white"
                                                >
                                                    {result.score}
                                                </motion.span>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-col items-center gap-1">
                                            <p className="font-bold text-foreground text-center tracking-[0.2em] uppercase text-[10px] opacity-40">
                                                Match Score
                                            </p>
                                            <div className="h-1 w-12 bg-gradient-to-r from-accent to-secondary rounded-full" />
                                        </div>
                                    </div>

                                    {/* Strengths */}
                                    {result.strengths && result.strengths.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A3FF12] mb-4 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> Competitive Advantages
                                            </h3>
                                            <div className="space-y-3">
                                                {result.strengths.map((s: string, i: number) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                                        className="text-sm text-foreground/80 flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#A3FF12]/20 transition-colors"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF12] mt-1.5 shrink-0 shadow-[0_0_8px_#A3FF12]" />
                                                        <span className="leading-relaxed">{s}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Improvements */}
                                    {result.improvements && result.improvements.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <h3 className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> Optimization Roadmap
                                            </h3>
                                            <div className="space-y-3">
                                                {result.improvements.map((s: string, i: number) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                                        className="text-sm text-foreground/80 flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/20 transition-colors"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0 shadow-[0_0_8px_rgba(108,99,255,0.6)]" />
                                                        <span className="leading-relaxed">{s}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copilot"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Active Context Bar */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                        {activeSection?.type === 'experience' ? <Briefcase className="w-4 h-4 text-accent" /> :
                                            activeSection?.type === 'education' ? <GraduationCap className="w-4 h-4 text-accent" /> :
                                                <PenTool className="w-4 h-4 text-accent" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold leading-none">Focusing On</p>
                                        <p className="text-sm font-bold text-foreground mt-1">{activeSection?.title || 'General'}</p>
                                    </div>
                                </div>
                                {isGenerating && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleStopGeneration}
                                        className="h-8 gap-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20"
                                    >
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Stop AI</span>
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-2">Global Tools</h3>

                                <ToolButton
                                    icon={<Wand2 />}
                                    label="Generate Summary"
                                    description="AI writes a summary based on your experience"
                                    onClick={handleGenerateSummary}
                                    isLoading={isGenerating === 'summary'}
                                />

                                <ToolButton
                                    icon={<Plus />}
                                    label="Suggest Skills"
                                    description="AI extracts top skills from your background"
                                    onClick={handleSuggestSkills}
                                    isLoading={isGenerating === 'skills'}
                                />

                                {activeSection && activeSection.type !== 'summary' && activeSection.type !== 'skills' && (
                                    <>
                                        <div className="h-px bg-border/50 my-4" />
                                        <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-2">
                                            Context Tools: {activeSection.title}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-3">
                                            {activeSection.type === 'experience' && (
                                                <ToolButton
                                                    icon={<Sparkles />}
                                                    label="Quantify Impact"
                                                    description="Add metrics and results to your bullet points"
                                                    onClick={() => handleContextTool('quantify_experience', 'Quantified Experience')}
                                                    isLoading={isGenerating === 'quantify_experience'}
                                                />
                                            )}
                                            {activeSection.type === 'projects' && (
                                                <ToolButton
                                                    icon={<PenTool />}
                                                    label="Expand Description"
                                                    description="Elaborate on technical challenges and solutions"
                                                    onClick={() => handleContextTool('expand_project', 'Expanded Project Details')}
                                                    isLoading={isGenerating === 'expand_project'}
                                                />
                                            )}
                                            {activeSection.type === 'education' && (
                                                <ToolButton
                                                    icon={<GraduationCap />}
                                                    label="Synthesize Learnings"
                                                    description="Convert coursework into professional competencies"
                                                    onClick={() => handleContextTool('summarize_edu', 'Synthesized Education')}
                                                    isLoading={isGenerating === 'summarize_edu'}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="h-px bg-border my-4" />

                                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-2">Tone Adjuster (Summary)</h3>

                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-6">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">
                                        <span>Formal</span>
                                        <span>Confident</span>
                                        <span>Creative</span>
                                    </div>
                                    <div className="relative h-2 bg-white/5 rounded-full px-2 flex items-center">
                                        <motion.div
                                            className="absolute left-0 h-full bg-accent/20 rounded-full"
                                            animate={{ width: ['0%', '50%', '100%'][activeToneIndex] }}
                                        />
                                        <input
                                            type="range"
                                            min="0" max="2" step="1"
                                            className="w-full appearance-none bg-transparent cursor-pointer relative z-10 accent-accent"
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setActiveToneIndex(val);
                                                const toneMap = ['tone_formal', 'tone_confident', 'tone_creative'];
                                                handleAdjustTone(toneMap[val] as any);
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-center text-foreground/30 font-bold">
                                        {['Strictly professional & conservative', 'Bold & achievement-oriented', 'Unique & storytelling-focused'][activeToneIndex]}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto p-4 rounded-2xl bg-accent/5 border border-accent/10">
                                <p className="text-xs text-foreground/60 leading-relaxed italic">
                                    "Pro-tip: Fill out your work experience and education first so the AI has enough context to help you."
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Drawer>
    );
}
