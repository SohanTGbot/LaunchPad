"use client";

import React from 'react';
import { useResumeStore, ResumeSection } from '@/store/useResumeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2, GripVertical, Plus, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function EditorPane() {
    const { resume, activeSectionId, updateSection } = useResumeStore();

    const activeSection = resume.sections.find(s => s.id === activeSectionId);

    if (!activeSection) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-foreground/40 font-mono text-sm max-w-sm mx-auto text-center">
                Select a section from the left panel to start editing, or add a new section.
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 sm:mb-16 flex items-start justify-between group/header"
            >
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/40 mb-2 block">Editing Phase</span>
                    <div className="relative">
                        <input
                            type="text"
                            value={activeSection.title}
                            onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                            className="text-4xl sm:text-5xl lg:text-6xl font-display font-black bg-transparent border-none outline-none focus:ring-0 px-0 py-1 w-full placeholder:text-foreground/5 transition-all text-white tracking-tighter uppercase"
                            placeholder="Section Title"
                        />
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-accent/20 rounded-full"
                            initial={{ width: "20%" }}
                            whileFocus={{ width: "100%", backgroundColor: "var(--accent)" }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
                {activeSection.metadata?.isAiInfluenced && (
                    <div className="mt-4">
                        <AIBadge onRevert={() => {
                            const update: any = { metadata: { isAiInfluenced: false } };
                            if ('data' in activeSection) {
                                update.data = { ...activeSection.data, content: activeSection.metadata?.originalContent };
                            }
                            updateSection(activeSection.id, update);
                        }} />
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="flex-1 pb-32"
            >
                {/* AI Suggestion Chips */}
                {!activeSection.metadata?.isAiInfluenced && (
                    <AIInlineSuggestionChips section={activeSection} />
                )}
                {renderFormForSection(activeSection)}
            </motion.div>
        </div>
    );
}

function renderFormForSection(section: ResumeSection) {
    switch (section.type) {
        case 'personal':
            return <PersonalInfoForm section={section} />;
        case 'summary':
            return <SummaryForm section={section} />;
        case 'experience':
        case 'education':
        case 'projects':
        case 'certifications':
        case 'languages':
        case 'custom':
            // Using generic array form for now, will specialize later if necessary
            return <GenericArrayForm section={section} />;
        case 'skills':
            return <SkillsForm section={section} />;
        default:
            return <div>Unsupported section type.</div>;
    }
}

// --- Specific Form Components ---

const handleStreamingAI = async (
    type: string,
    content: string,
    onChunk: (text: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    signal?: AbortSignal
) => {
    onStart?.();
    try {
        const res = await fetch('/api/ai/enhance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, type }),
            signal
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
        if (err.name === 'AbortError') return;
        console.error('AI Stream Error:', err);
    } finally {
        onEnd?.();
    }
};

function PersonalInfoForm({ section }: { section: any }) {
    const { updateSection } = useResumeStore();
    const data = section.data;

    const handleChange = (field: string, value: string) => {
        updateSection(section.id, { data: { ...data, [field]: value } });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center text-foreground/40 cursor-pointer hover:border-accent hover:text-accent transition-colors overflow-hidden relative group shrink-0">
                    {data.photoUrl ? (
                        <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-sm font-medium">Upload</span>
                    )}
                    {/* Mock photo upload logic would go here */}
                </div>
                <div className="flex-1 min-w-0">
                    <Input
                        label="Full Name"
                        value={data.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                </div>
            </div>

            <Input label="Job Title" value={data.jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} />
            <Input label="Email" type="email" value={data.email} onChange={(e) => handleChange('email', e.target.value)} />
            <Input label="Phone" type="tel" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            <Input label="Location" value={data.location} onChange={(e) => handleChange('location', e.target.value)} />
            <Input label="Website" type="url" value={data.website} onChange={(e) => handleChange('website', e.target.value)} />
            <Input label="LinkedIn" value={data.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
        </div>
    );
}

function SummaryForm({ section }: { section: any }) {
    const { updateSection } = useResumeStore();
    const [isEnhancing, setIsEnhancing] = React.useState(false);
    const [displayText, setDisplayText] = React.useState(section.data.content || '');

    // Sync display text with store only when not enhancing
    React.useEffect(() => {
        if (!isEnhancing) setDisplayText(section.data.content || '');
    }, [section.data.content, isEnhancing]);

    const handleEnhance = async () => {
        if (!displayText || displayText.length < 10) return;

        setIsEnhancing(true);
        let accumulated = '';

        await handleStreamingAI(
            'enhance',
            displayText,
            (text) => {
                accumulated = text;
                setDisplayText(text); // Visual ghost-typing
            },
            () => { },
            () => {
                const oldContent = section.data?.content || '';
                updateSection(section.id, {
                    data: { content: accumulated },
                    metadata: {
                        isAiInfluenced: true,
                        originalContent: oldContent
                    }
                });
                setIsEnhancing(false);
            }
        ).catch(err => {
            console.error(err);
            setIsEnhancing(false);
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] font-black text-foreground/20 tracking-[0.5em] uppercase">Professional Narrative</label>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-accent gap-2 h-9 bg-accent/5 border border-accent/10 hover:bg-accent hover:text-bg-void transition-all rounded-xl px-5 overflow-hidden group shadow-lg"
                    onClick={handleEnhance}
                    disabled={isEnhancing || !displayText || displayText.length < 10}
                >
                    <Sparkles className={`w-3.5 h-3.5 transition-transform duration-500 ${isEnhancing ? 'animate-spin' : 'group-hover:rotate-12'}`} />
                    <span className="font-black uppercase tracking-widest text-[9px]">{isEnhancing ? 'Synthesizing...' : 'AI Enhance'}</span>
                </Button>
            </div>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <textarea
                    className="relative w-full min-h-[200px] sm:min-h-[300px] p-5 sm:p-8 rounded-3xl bg-[#08090d]/60 backdrop-blur-3xl border border-white/5 focus:border-accent/30 outline-none resize-none transition-all duration-500 leading-relaxed text-base sm:text-lg text-foreground/80 placeholder:text-foreground/10"
                    placeholder="E.g. Visionary software architect with 10+ years of..."
                    value={displayText}
                    onChange={(e) => {
                        setDisplayText(e.target.value);
                        updateSection(section.id, { data: { content: e.target.value } });
                    }}
                />
            </div>
        </div>
    );
}

// Simple text area for generic items for now
function GenericArrayForm({ section }: { section: any }) {
    const { addItemToSection, updateItemInSection, removeItemFromSection } = useResumeStore();

    const handleAdd = () => {
        let newItem: any = { id: `item-${Date.now()}` };

        // Setup basic defaults depending on type
        if (section.type === 'experience') {
            newItem = { ...newItem, company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '' };
        } else if (section.type === 'education') {
            newItem = { ...newItem, institution: '', degree: '', startDate: '', endDate: '', description: '' };
        } else {
            newItem = { ...newItem, title: '', subtitle: '', date: '', description: '' };
        }
        addItemToSection(section.id, newItem);
    };

    return (
        <div className="flex flex-col gap-6">
            <AnimatePresence>
                {section.items.map((item: any, index: number) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="flex gap-4 sm:gap-6 border border-white/[0.03] bg-white/[0.01] p-5 sm:p-8 rounded-2xl group relative overflow-hidden hover:bg-white/[0.02] hover:border-white/[0.08] transition-all duration-500 shadow-2xl">
                            <button className="text-foreground/10 hover:text-foreground/40 cursor-grab mt-6 active:cursor-grabbing transition-colors hidden sm:block">
                                <GripVertical className="w-5 h-5" />
                            </button>

                            <div className="flex-1 grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2">
                                {/* Dynamically render fields based on type using a very simple map for MVP */}
                                {Object.keys(item).filter(k => k !== 'id' && typeof item[k] === 'string').map(key => (
                                    <div key={key} className={key === 'description' ? 'md:col-span-2' : ''}>
                                        {key === 'description' ? (
                                            <div className="relative w-full group">
                                                <div className="flex justify-between items-center mb-3 px-1">
                                                    <label
                                                        htmlFor={`input-${item.id}-${key}`}
                                                        className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20"
                                                    >
                                                        Achievements & Role
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        {item.metadata?.isAiInfluenced && (
                                                            <AIBadge onRevert={() => updateItemInSection(section.id, item.id, {
                                                                [key]: item.metadata?.originalContent,
                                                                metadata: { isAiInfluenced: false }
                                                            })} />
                                                        )}
                                                        <AIInlineEnhancer
                                                            content={item[key]}
                                                            onEnhanced={(text) => {
                                                                const oldContent = item[key];
                                                                updateItemInSection(section.id, item.id, {
                                                                    [key]: text,
                                                                    metadata: { isAiInfluenced: true, originalContent: oldContent }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute -inset-0.5 bg-accent/5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                                    <textarea
                                                        id={`input-${item.id}-${key}`}
                                                        className="relative w-full min-h-[160px] p-6 rounded-2xl bg-bg-void/40 border border-white/5 focus:border-accent/20 focus:bg-bg-void/60 outline-none resize-none transition-all duration-500 text-foreground/80 text-base leading-relaxed placeholder:text-foreground/5"
                                                        placeholder="Synthesize your impact..."
                                                        value={item[key]}
                                                        style={{ fontFamily: 'Cormorant Garamond, serif' }}
                                                        onChange={(e) => updateItemInSection(section.id, item.id, { [key]: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <PremiumInput
                                                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                value={item[key]}
                                                onChange={(v) => updateItemInSection(section.id, item.id, { [key]: v })}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => removeItemFromSection(section.id, item.id)}
                                className="absolute top-4 right-4 p-2 text-foreground/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <Button
                variant="outline"
                onClick={handleAdd}
                className="w-full gap-3 border-dashed border-[1.5px] border-white/10 py-10 text-foreground/20 hover:text-accent hover:border-accent/40 hover:bg-accent/5 rounded-2xl transition-all duration-500 group"
            >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Add Component</span>
            </Button>
        </div>
    );
}

function SkillsForm({ section }: { section: any }) {
    // Simplistic comma separated input for MVP
    const { updateSection } = useResumeStore();
    const rawValue = section.items.map((i: any) => i.name).join(', ');
    const [isThinking, setIsThinking] = React.useState(false);

    const handleParse = (val: string) => {
        const items = val.split(',').map((s, idx) => ({ id: `skill-${idx}`, name: s.trim() })).filter(s => s.name);
        updateSection(section.id, { items });
    };

    const handleSuggest = async () => {
        // We'll suggest skills based on the context of the resume (can be improved)
        setIsThinking(true);
        try {
            // Simple prompt for now, can be improved by passing more context
            await handleStreamingAI(
                'suggest_skills',
                'Based on a general professional profile', // Fallback context
                (text) => {
                    // Update skills as we get them
                    handleParse(text);
                }
            );
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] font-black text-foreground/20 tracking-[0.5em] uppercase">Core Competencies</label>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent gap-2 h-9 bg-accent/5 border border-accent/10 hover:bg-accent hover:text-bg-void rounded-full px-5 transition-all shadow-lg overflow-hidden group"
                    onClick={handleSuggest}
                    disabled={isThinking}
                >
                    {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />}
                    <span className="font-black uppercase tracking-widest text-[9px]">{isThinking ? 'Suggesting...' : 'AI Suggest Skills'}</span>
                </Button>
            </div>
            <textarea
                className="w-full min-h-[150px] p-6 rounded-2xl bg-surface/50 backdrop-blur-md border border-white/5 focus:border-accent/50 focus:bg-surface outline-none resize-y transition-all duration-300 leading-relaxed text-lg shadow-sm"
                placeholder="React, Next.js, TypeScript, UI/UX Design..."
                value={rawValue}
                onChange={(e) => handleParse(e.target.value)}
            />
        </div>
    );
}


function AIInlineEnhancer({ content, onEnhanced }: { content: string, onEnhanced: (text: string) => void }) {
    const [isEnhancing, setIsEnhancing] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const handleClick = async () => {
        if (!content || content.length < 5) return;
        setIsEnhancing(true);

        await handleStreamingAI(
            'enhance',
            content,
            (text) => {
                onEnhanced(text);
                setProgress(p => Math.min(p + 5, 100));
            },
            () => setProgress(0),
            () => {
                setIsEnhancing(false);
                setProgress(100);
            }
        ).catch(err => setIsEnhancing(false));
    };

    return (
        <button
            onClick={handleClick}
            disabled={isEnhancing || !content || content.length < 5}
            className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all group
                ${isEnhancing ? 'text-accent' : 'text-foreground/20 hover:text-accent'}
                disabled:opacity-20
            `}
        >
            <div className="relative">
                {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 transition-transform group-hover:rotate-12" />}
                {isEnhancing && (
                    <motion.div
                        className="absolute inset-0 rounded-full border border-accent/30"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </div>
            {isEnhancing ? 'Refining' : 'Optimize'}
        </button>
    );
}

function AIInlineSuggestionChips({ section }: { section: any }) {
    const suggestions = {
        personal: [
            { label: 'Optimize Title', prompt: 'Refine my job title for high-impact roles' },
            { label: 'ATS Check', prompt: 'Is my contact info ATS friendly?' }
        ],
        summary: [
            { label: 'Quantify Impact', prompt: 'Add 2-3 specific metrics to this summary' },
            { label: 'Target CEO Role', prompt: 'Rewrite this for a high-level executive position' },
            { label: 'Shorter Version', prompt: 'Make this more punchy and concise' }
        ],
        experience: [
            { label: 'X-Y-Z Formula', prompt: 'Rewrite these points using the Google X-Y-Z formula' },
            { label: 'Stronger Verbs', prompt: 'Replace passive language with power verbs' },
            { label: 'Add Metrics', prompt: 'Suggest where I can add numerical impact' }
        ],
        skills: [
            { label: 'Group by Category', prompt: 'Categorize these skills into logical groups' },
            { label: 'Top 5 Focus', prompt: 'Highlight the most relevant 5 skills for senior roles' }
        ],
        default: [
            { label: 'Grammar Fix', prompt: 'Quickly correct all grammar and spelling' },
            { label: 'Refine Language', prompt: 'Make the language feel more premium' }
        ]
    };

    const activeSuggestions = suggestions[section.type as keyof typeof suggestions] || suggestions.default;
    const { updateSection } = useResumeStore();
    const [isThinking, setIsThinking] = React.useState<string | null>(null);

    const handleApply = async (suggestion: any) => {
        setIsThinking(suggestion.label);
        let accumulated = '';
        const currentContent = 'data' in section ? section.data.content : JSON.stringify(section.items);

        await handleStreamingAI(
            'custom',
            currentContent,
            (text) => { accumulated = text; },
            () => { },
            () => {
                if ('data' in section) {
                    updateSection(section.id, {
                        data: { ...section.data, content: accumulated },
                        metadata: { isAiInfluenced: true, originalContent: currentContent }
                    });
                }
                setIsThinking(null);
            },
            undefined // signal
        );
    };

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <AnimatePresence>
                {activeSuggestions.map((s, i) => (
                    <motion.button
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!!isThinking}
                        onClick={() => handleApply(s)}
                        className={cn(
                            "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                            isThinking === s.label
                                ? "bg-accent text-bg-void border-accent"
                                : "bg-white/[0.02] border-white/5 text-foreground/40 hover:text-accent hover:border-accent/40 hover:bg-accent/5"
                        )}
                    >
                        {isThinking === s.label ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {s.label}
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
    );
}

function PremiumInput({ label, value, onChange, type = "text", error }: { label: string, value: string, onChange: (v: string) => void, type?: string, error?: boolean }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value && value.length > 0;

    return (
        <motion.div
            animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col group min-h-[64px] justify-end mb-8"
        >
            <motion.label
                initial={false}
                animate={{
                    y: (isFocused || hasValue) ? -28 : 0,
                    scale: (isFocused || hasValue) ? 0.8 : 1,
                    opacity: (isFocused || hasValue) ? 0.4 : 0.2,
                    color: isFocused ? "var(--accent)" : "currentColor"
                }}
                className="absolute left-4 pointer-events-none text-[10px] font-black uppercase tracking-[0.3em] origin-left z-10"
            >
                {label}
            </motion.label>
            <div className="relative overflow-hidden rounded-2xl">
                <div className={cn(
                    "absolute inset-0 bg-white/[0.02] transition-all duration-500",
                    isFocused ? "bg-white/[0.05] ring-1 ring-accent/20" : "group-hover:bg-white/[0.03]"
                )} />
                <input
                    type={type}
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    className="relative w-full px-5 py-5 bg-transparent border border-white/5 outline-none transition-all duration-500 text-foreground/90 placeholder:text-transparent font-medium"
                    placeholder={label}
                />
                <motion.div
                    initial={false}
                    animate={{
                        scaleX: isFocused ? 1 : 0,
                        opacity: isFocused ? 1 : 0
                    }}
                    className="absolute bottom-0 left-0 h-[1.5px] w-full bg-accent origin-left"
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
}

function AIBadge({ onRevert }: { onRevert: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 shadow-[0_0_10px_rgba(163,255,18,0.1)] group/badge cursor-default shrink-0"
        >
            <Sparkles className="w-3 h-3 text-accent animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-accent">AI Enhanced</span>
            <button
                onClick={onRevert}
                className="ml-1 p-1 hover:bg-accent/20 rounded-md transition-colors text-accent/40 hover:text-accent"
                title="Revert to original"
            >
                <RotateCcw className="w-2.5 h-2.5" />
            </button>
        </motion.div>
    );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
}
