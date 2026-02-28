import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Type Definitions ---
export type SectionType =
    | 'personal'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'certifications'
    | 'languages'
    | 'custom';

export interface BaseSection {
    id: string;
    type: SectionType;
    title: string;
    isVisible: boolean;
    order: number;
    metadata?: {
        isAiInfluenced?: boolean;
        originalContent?: any;
    };
}

// 1. Personal Info
export interface PersonalInfoSection extends BaseSection {
    type: 'personal';
    data: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        linkedin: string;
        photoUrl?: string;
    };
}

// 2. Summary
export interface SummarySection extends BaseSection {
    type: 'summary';
    data: {
        content: string; // Rich text or plain string depending on editor
    };
}

// 3. Work Experience 
export interface WorkExperienceItem {
    id: string;
    metadata?: { isAiInfluenced?: boolean; originalContent?: any };
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    location: string;
    description: string; // Bullet points or rich text
}

export interface ExperienceSection extends BaseSection {
    type: 'experience';
    items: WorkExperienceItem[];
}

// 4. Education
export interface EducationItem {
    id: string;
    metadata?: { isAiInfluenced?: boolean; originalContent?: any };
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    gpa: string;
    description: string;
}

export interface EducationSection extends BaseSection {
    type: 'education';
    items: EducationItem[];
}

// 5. Skills
export interface SkillItem {
    id: string;
    metadata?: { isAiInfluenced?: boolean; originalContent?: any };
    name: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillsSection extends BaseSection {
    type: 'skills';
    items: SkillItem[];
}

// Generic Array Section for others (Projects, Certs, etc)
export interface GenericItem {
    id: string;
    metadata?: { isAiInfluenced?: boolean; originalContent?: any };
    title: string;
    subtitle: string;
    date: string;
    url: string;
    description: string;
}

export interface GenericArraySection extends BaseSection {
    type: 'projects' | 'certifications' | 'languages' | 'custom';
    items: GenericItem[];
}

export type ResumeSection =
    | PersonalInfoSection
    | SummarySection
    | ExperienceSection
    | EducationSection
    | SkillsSection
    | GenericArraySection;

export interface ResumeData {
    id: string;
    title: string;
    templateId: string;
    themeColor: string;
    fontFamily: string;
    sections: ResumeSection[];
}

interface ResumeStore {
    resume: ResumeData;
    activeSectionId: string | null;

    // Actions
    setResume: (data: ResumeData) => void;
    updateTitle: (title: string) => void;
    updateTheme: (color: string, font: string) => void;
    setActiveSection: (id: string | null) => void;

    // Section Management
    updateSection: (id: string, data: Partial<ResumeSection>) => void;
    addSection: (type: SectionType, title: string) => void;
    removeSection: (id: string) => void;
    reorderSections: (startIndex: number, endIndex: number) => void;

    // Item Management inside Sections
    addItemToSection: (sectionId: string, item: any) => void;
    updateItemInSection: (sectionId: string, itemId: string, data: any) => void;
    removeItemFromSection: (sectionId: string, itemId: string) => void;
    reorderItemsInSection: (sectionId: string, startIndex: number, endIndex: number) => void;

    // Internal Helpers
    takeSnapshot: () => void;

    // History & Features
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    atsAnalysis: {
        score: number;
        strengths: string[];
        improvements: string[];
        lastAnalyzed: number;
    };
    setAtsAnalysis: (analysis: Partial<ResumeStore['atsAnalysis']>) => void;
}

interface HistoryState {
    past: ResumeData[];
    future: ResumeData[];
}

// Initial Default State
const DEFAULT_RESUME: ResumeData = {
    id: 'new',
    title: 'Untitled Resume',
    templateId: 't1', // Meridian
    themeColor: '#6C63FF',
    fontFamily: 'Inter',
    sections: [
        {
            id: 'personal-1',
            type: 'personal',
            title: 'Personal Info',
            isVisible: true,
            order: 0,
            data: {
                fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: ''
            }
        },
        {
            id: 'summary-1',
            type: 'summary',
            title: 'Professional Summary',
            isVisible: true,
            order: 1,
            data: { content: '' }
        },
        {
            id: 'exp-1',
            type: 'experience',
            title: 'Work Experience',
            isVisible: true,
            order: 2,
            items: []
        },
        {
            id: 'edu-1',
            type: 'education',
            title: 'Education',
            isVisible: true,
            order: 3,
            items: []
        },
        {
            id: 'skills-1',
            type: 'skills',
            title: 'Skills',
            isVisible: true,
            order: 4,
            items: []
        }
    ]
};

export const useResumeStore = create<ResumeStore & HistoryState>()(
    persist(
        (set, get) => ({
            resume: DEFAULT_RESUME,
            activeSectionId: 'personal-1',
            past: [],
            future: [],
            atsAnalysis: {
                score: 0,
                strengths: [],
                improvements: [],
                lastAnalyzed: 0
            },

            // History Helpers
            takeSnapshot: () => {
                const { resume, past } = get();
                // Limit history to 50 steps
                const newPast = [JSON.parse(JSON.stringify(resume)), ...past].slice(0, 50);
                set({ past: newPast, future: [] });
            },

            setResume: (data) => {
                get().takeSnapshot();
                set({ resume: data });
            },

            updateTitle: (title) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: { ...state.resume, title }
                }));
            },

            updateTheme: (themeColor, fontFamily) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: { ...state.resume, themeColor, fontFamily }
                }));
            },

            setActiveSection: (id) => set({ activeSectionId: id }),

            updateSection: (id, data) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: {
                        ...state.resume,
                        sections: state.resume.sections.map(sec =>
                            sec.id === id ? { ...sec, ...data } as ResumeSection : sec
                        )
                    }
                }));
            },

            addSection: (type, title) => {
                get().takeSnapshot();
                set((state) => {
                    const newId = `${type}-${Date.now()}`;
                    let newSection: ResumeSection;

                    const base = { id: newId, type, title, isVisible: true, order: state.resume.sections.length };

                    switch (type) {
                        case 'personal':
                            newSection = { ...base, type: 'personal', data: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '' } }; break;
                        case 'summary':
                            newSection = { ...base, type: 'summary', data: { content: '' } }; break;
                        case 'experience':
                            newSection = { ...base, type: 'experience', items: [] }; break;
                        case 'education':
                            newSection = { ...base, type: 'education', items: [] }; break;
                        case 'skills':
                            newSection = { ...base, type: 'skills', items: [] }; break;
                        default:
                            newSection = { ...base, type: type as any, items: [] }; break;
                    }

                    return {
                        resume: {
                            ...state.resume,
                            sections: [...state.resume.sections, newSection]
                        }
                    };
                });
            },

            removeSection: (id) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: {
                        ...state.resume,
                        sections: state.resume.sections.filter(sec => sec.id !== id)
                    },
                    activeSectionId: state.activeSectionId === id ? null : state.activeSectionId
                }));
            },

            reorderSections: (startIndex, endIndex) => {
                get().takeSnapshot();
                set((state) => {
                    const result = Array.from(state.resume.sections);
                    const [removed] = result.splice(startIndex, 1);
                    result.splice(endIndex, 0, removed);
                    return {
                        resume: {
                            ...state.resume,
                            // Update order properties
                            sections: result.map((sec, index) => ({ ...sec, order: index }))
                        }
                    };
                });
            },

            addItemToSection: (sectionId, item) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: {
                        ...state.resume,
                        sections: state.resume.sections.map(sec => {
                            if (sec.id === sectionId && 'items' in sec) {
                                return { ...sec, items: [...sec.items, item] };
                            }
                            return sec;
                        })
                    }
                }));
            },

            updateItemInSection: (sectionId, itemId, data) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: {
                        ...state.resume,
                        sections: state.resume.sections.map(sec => {
                            if (sec.id === sectionId && 'items' in sec) {
                                return {
                                    ...sec,
                                    items: sec.items.map(item => item.id === itemId ? { ...item, ...data } : item)
                                };
                            }
                            return sec;
                        })
                    }
                }));
            },

            removeItemFromSection: (sectionId, itemId) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: {
                        ...state.resume,
                        sections: state.resume.sections.map(sec => {
                            if (sec.id === sectionId && 'items' in sec) {
                                return { ...sec, items: sec.items.filter(item => item.id !== itemId) } as any;
                            }
                            return sec;
                        })
                    }
                }));
            },

            reorderItemsInSection: (sectionId, startIndex, endIndex) => {
                get().takeSnapshot();
                set((state) => ({
                    resume: {
                        ...state.resume,
                        sections: state.resume.sections.map(sec => {
                            if (sec.id === sectionId && 'items' in sec) {
                                const result = Array.from(sec.items as any[]);
                                const [removed] = result.splice(startIndex, 1);
                                result.splice(endIndex, 0, removed);
                                return { ...sec, items: result } as any;
                            }
                            return sec;
                        })
                    }
                }));
            },

            // History Actions
            undo: () => {
                const { past, resume, future } = get();
                if (past.length === 0) return;

                const previous = past[0];
                const newPast = past.slice(1);
                set({
                    resume: previous,
                    past: newPast,
                    future: [JSON.parse(JSON.stringify(resume)), ...future]
                });
            },

            redo: () => {
                const { past, resume, future } = get();
                if (future.length === 0) return;

                const next = future[0];
                const newFuture = future.slice(1);
                set({
                    resume: next,
                    past: [JSON.parse(JSON.stringify(resume)), ...past],
                    future: newFuture
                });
            },

            canUndo: false, // Computed below or handled via selector but simple for now
            canRedo: false,

            setAtsAnalysis: (analysis) => set((state) => ({
                atsAnalysis: { ...state.atsAnalysis, ...analysis }
            }))
        }),
        {
            name: 'craft-cv-resume-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
