import React from 'react';
import { ResumeData, ResumeSection } from '@/store/useResumeStore';

// Meridian Template - Clean, ATS-Friendly, Single Column
export function MeridianTemplate({ data }: { data: ResumeData }) {

    // Custom font family injected from state
    const fontStyle = { fontFamily: data.fontFamily || 'sans-serif' };
    const accentColor = data.themeColor || '#000000';

    const personalInfo = data.sections.find(s => s.type === 'personal') as any;
    const summary = data.sections.find(s => s.type === 'summary') as any;

    // Sort sections by order
    const orderedSections = [...data.sections].sort((a, b) => a.order - b.order);

    return (
        <div className="p-12 w-full h-full text-[13px] leading-relaxed bg-white" style={fontStyle}>
            {/* HEADER: Personal Info */}
            {personalInfo?.isVisible && (
                <header className="mb-6 border-b-2 pb-6 flex items-center justify-between" style={{ borderColor: accentColor }}>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-1" style={{ color: accentColor }}>
                            {personalInfo.data.fullName || "Your Name"}
                        </h1>
                        <h2 className="text-xl text-gray-600 font-medium">
                            {personalInfo.data.jobTitle || "Professional Title"}
                        </h2>
                    </div>
                    <div className="text-right text-gray-500 text-sm space-y-1">
                        {personalInfo.data.email && <div className="flex items-center justify-end gap-2">{personalInfo.data.email}</div>}
                        {personalInfo.data.phone && <div>{personalInfo.data.phone}</div>}
                        {personalInfo.data.location && <div>{personalInfo.data.location}</div>}
                        {personalInfo.data.linkedin && <div>{personalInfo.data.linkedin}</div>}
                        {personalInfo.data.website && <div>{personalInfo.data.website}</div>}
                    </div>
                </header>
            )}

            {/* DYNAMIC SECTIONS */}
            <div className="space-y-6">
                {orderedSections.map(section => {
                    if (!section.isVisible) return null;

                    if (section.type === 'personal') return null; // Already rendered in header

                    if (section.type === 'summary') {
                        const sumData = section as any;
                        if (!sumData.data.content) return null;
                        return (
                            <section key={section.id}>
                                <SectionHeader title={section.title} color={accentColor} />
                                <p className="text-gray-700 whitespace-pre-wrap">{sumData.data.content}</p>
                            </section>
                        );
                    }

                    if (section.type === 'experience' || section.type === 'education' || ['projects', 'certifications', 'custom'].includes(section.type)) {
                        const listData = section as any;
                        if (!listData.items || listData.items.length === 0) return null;

                        return (
                            <section key={section.id}>
                                <SectionHeader title={section.title} color={accentColor} />
                                <div className="space-y-4">
                                    {listData.items.map((item: any) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 className="font-bold text-[14px] text-gray-900">
                                                        {item.role || item.degree || item.title || "Position / Degree"}
                                                    </h3>
                                                    <div className="font-medium text-gray-600">
                                                        {item.company || item.institution || item.subtitle || "Organization"}
                                                    </div>
                                                </div>
                                                <div className="text-right whitespace-nowrap text-sm font-medium text-gray-500">
                                                    {item.startDate && item.endDate
                                                        ? `${item.startDate} – ${item.isCurrent ? 'Present' : item.endDate}`
                                                        : (item.date || "")}
                                                </div>
                                            </div>
                                            {item.description && (
                                                <p className="text-gray-700 whitespace-pre-wrap mt-1.5">{item.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    }

                    if (section.type === 'skills') {
                        const skillData = section as any;
                        if (!skillData.items || skillData.items.length === 0) return null;
                        return (
                            <section key={section.id}>
                                <SectionHeader title={section.title} color={accentColor} />
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    {skillData.items.map((skill: any, i: number) => (
                                        <span key={skill.id} className="text-gray-800">
                                            {skill.name}{i < skillData.items.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )
                    }

                    return null;
                })}
            </div>
        </div>
    );
}

function SectionHeader({ title, color }: { title: string, color: string }) {
    return (
        <h3
            className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ color: color, borderColor: color + '40' }}
        >
            {title}
        </h3>
    );
}
