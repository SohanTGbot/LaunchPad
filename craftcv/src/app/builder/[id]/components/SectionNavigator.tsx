"use client";

import React from 'react';
import {
    DndContext, closestCenter, KeyboardSensor,
    PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore } from '@/store/useResumeStore';
import {
    GripVertical, EyeOff, Plus, Eye,
    User, AlignLeft, Briefcase, GraduationCap, Zap,
    Code2, Award, Globe, LayoutTemplate, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Section type config ─────────────────────────────────────────────────────
const SECTION_META: Record<string, { icon: React.ReactNode; color: string }> = {
    personal: { icon: <User className="w-3.5 h-3.5" />, color: '#6C63FF' },
    summary: { icon: <AlignLeft className="w-3.5 h-3.5" />, color: '#0CF0C5' },
    experience: { icon: <Briefcase className="w-3.5 h-3.5" />, color: '#A3FF12' },
    education: { icon: <GraduationCap className="w-3.5 h-3.5" />, color: '#f59e0b' },
    skills: { icon: <Zap className="w-3.5 h-3.5" />, color: '#ec4899' },
    projects: { icon: <Code2 className="w-3.5 h-3.5" />, color: '#8b5cf6' },
    certifications: { icon: <Award className="w-3.5 h-3.5" />, color: '#f97316' },
    languages: { icon: <Globe className="w-3.5 h-3.5" />, color: '#06b6d4' },
    custom: { icon: <LayoutTemplate className="w-3.5 h-3.5" />, color: '#64748b' },
};

function getCompletionStatus(section: any): 'complete' | 'partial' | 'empty' {
    if (section.type === 'personal') {
        const d = section.data || {};
        const filled = [d.fullName, d.email, d.jobTitle, d.phone].filter(Boolean).length;
        if (filled >= 4) return 'complete';
        if (filled > 0) return 'partial';
        return 'empty';
    }
    if (section.data?.content) {
        return section.data.content.length > 20 ? 'complete' : 'partial';
    }
    if (section.items?.length > 0) {
        return section.items.length >= 2 ? 'complete' : 'partial';
    }
    return 'empty';
}

// ─── Sortable Section Item ───────────────────────────────────────────────────
function SortableSectionItem({ id, section, isActive, onToggleVisibility, onClick }: any) {
    const {
        attributes, listeners, setNodeRef,
        transform, transition, isDragging,
    } = useSortable({ id });

    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };
    const meta = SECTION_META[section.type] || SECTION_META.custom;
    const completion = getCompletionStatus(section);

    const completionDot = {
        complete: 'bg-accent-sharp shadow-[0_0_8px_rgba(163,255,18,0.4)]',
        partial: 'bg-amber-400',
        empty: 'bg-white/10',
    }[completion];

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: section.isVisible ? 1 : 0.35, x: 0 }}
            className={`relative group flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-300
                ${isActive
                    ? 'bg-accent/8 border-accent/25 shadow-[0_0_20px_rgba(108,99,255,0.08)]'
                    : 'bg-transparent border-transparent hover:border-white/8 hover:bg-white/[0.02]'
                }
                ${isDragging ? 'opacity-60 scale-[1.02] rotate-1 shadow-2xl border-accent/40' : ''}
            `}
            onClick={onClick}
        >
            {/* Section type icon chip */}
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                    backgroundColor: meta.color + (isActive ? '25' : '12'),
                    color: meta.color,
                    border: `1px solid ${meta.color}${isActive ? '40' : '20'}`,
                }}
            >
                {meta.icon}
            </div>

            {/* Label */}
            <span className={`flex-1 text-[11px] font-bold uppercase tracking-widest truncate leading-none transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground/60'}`}>
                {section.title}
            </span>

            {/* Status + actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Visibility toggle */}
                <button
                    onClick={e => { e.stopPropagation(); onToggleVisibility(); }}
                    className="p-1 rounded-md text-foreground/20 hover:text-foreground transition-colors"
                    title={section.isVisible ? 'Hide' : 'Show'}
                >
                    {section.isVisible
                        ? <Eye className="w-3.5 h-3.5" />
                        : <EyeOff className="w-3.5 h-3.5" />
                    }
                </button>
                {/* Drag handle */}
                <button
                    className="p-1 rounded-md text-foreground/20 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
                    {...attributes}
                    {...listeners}
                    onClick={e => e.stopPropagation()}
                >
                    <GripVertical className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Completion dot — always visible */}
            <div className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${completionDot} group-hover:opacity-0`} />

            {/* Active glow */}
            {isActive && (
                <motion.div
                    layoutId="sectionActiveGlow"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
        </motion.div>
    );
}

// ─── Main Navigator ──────────────────────────────────────────────────────────
export function SectionNavigator() {
    const { resume, atsAnalysis, activeSectionId, setActiveSection, removeSection, updateSection, reorderSections, addSection } = useResumeStore();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIdx = resume.sections.findIndex(s => s.id === active.id);
            const newIdx = resume.sections.findIndex(s => s.id === over.id);
            reorderSections(oldIdx, newIdx);
        }
    };

    const atsScore = atsAnalysis?.score || 0;
    const atsColor = atsScore >= 80 ? '#A3FF12' : atsScore >= 60 ? '#0CF0C5' : atsScore >= 40 ? '#f59e0b' : '#ef4444';
    const atsLabel = atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : atsScore >= 40 ? 'Fair' : 'Needs Work';

    const completedSections = resume.sections.filter(s => getCompletionStatus(s) === 'complete').length;
    const totalSections = resume.sections.length;

    // Glowing border for critical low score
    const isCritical = atsScore < 50;

    const availableSections = [
        { type: 'experience', label: 'Experience' },
        { type: 'education', label: 'Education' },
        { type: 'skills', label: 'Skills' },
        { type: 'projects', label: 'Projects' },
        { type: 'certifications', label: 'Certifications' },
        { type: 'languages', label: 'Languages' },
        { type: 'custom', label: 'Custom' },
    ];

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">

            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-white/[0.05] shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/25">
                        Sections
                    </h2>
                    <span className="text-[10px] font-black text-foreground/20 tabular-nums">
                        {completedSections}<span className="text-foreground/10">/{totalSections}</span>
                    </span>
                </div>
                {/* Overall progress bar */}
                <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: atsColor }}
                        initial={{ width: 0 }}
                        animate={{ width: totalSections > 0 ? `${(completedSections / totalSections) * 100}%` : '0%' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* ── Section List ── */}
            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={resume.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-1">
                            {resume.sections.map(section => (
                                <SortableSectionItem
                                    key={section.id}
                                    id={section.id}
                                    section={section}
                                    isActive={activeSectionId === section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    onToggleVisibility={() => updateSection(section.id, { isVisible: !section.isVisible })}
                                    onDelete={() => removeSection(section.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {/* ── Add Section ── */}
                <div className="mt-6 mb-4">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/15 mb-3 flex items-center gap-2">
                        Add Section <div className="h-px flex-1 bg-white/[0.04]" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {availableSections.map(sec => {
                            const meta = SECTION_META[sec.type];
                            return (
                                <button
                                    key={sec.type}
                                    onClick={() => addSection(sec.type as any, sec.label)}
                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-foreground/30 hover:border-white/10 hover:text-foreground/60 hover:bg-white/[0.04] transition-all"
                                >
                                    <span style={{ color: meta?.color }}>{meta?.icon}</span>
                                    {sec.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── ATS Score Widget ── */}
            <div className="p-4 border-t border-white/[0.05] shrink-0">
                <motion.div
                    animate={isCritical ? {
                        boxShadow: [
                            `0 0 0px #ef444400`,
                            `0 0 20px #ef444420`,
                            `0 0 0px #ef444400`
                        ],
                        borderColor: ['#ef444420', '#ef444460', '#ef444420']
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-4 rounded-2xl transition-all duration-500 relative overflow-hidden group/ats"
                    style={{ backgroundColor: atsColor + '08', border: `1px solid ${atsColor}20` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                        {/* Ring */}
                        <div className="relative w-14 h-14 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="24" fill="none" stroke={atsColor + '15'} strokeWidth="3" />
                                <motion.circle
                                    cx="28" cy="28" r="24" fill="none"
                                    stroke={atsColor} strokeWidth="3"
                                    strokeDasharray="150.8"
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 150.8 }}
                                    animate={{ strokeDashoffset: 150.8 - (150.8 * atsScore) / 100 }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    style={{ filter: `drop-shadow(0 0 8px ${atsColor}80)` }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-black font-mono" style={{ color: atsColor }}>{atsScore}</span>
                            </div>
                        </div>

                        {/* Label */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/25 leading-none mb-1">ATS Index</p>
                            <div className="flex items-center gap-2">
                                <p className="text-base font-black font-display leading-none" style={{ color: atsColor }}>{atsLabel}</p>
                                {isCritical && <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                            </div>
                            <p className="text-[9px] text-foreground/20 mt-1 font-bold leading-tight">
                                {atsScore < 50 ? 'Critical optimization required' : atsScore < 80 ? 'Add more details to improve' : 'Your resume is well-optimized'}
                            </p>
                        </div>
                    </div>

                    {/* Score bar breakdown */}
                    <div className="mt-3 w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: atsColor, boxShadow: `0 0 10px ${atsColor}40` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${atsScore}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
