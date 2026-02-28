import { ResumeData } from "@/store/useResumeStore";

export function calculateHeuristicScore(resume: ResumeData): number {
    let score = 0;
    const maxScore = 100;

    // 1. Contact Information (15 pts)
    const personal = resume.sections.find(s => s.type === 'personal');
    if (personal && 'data' in personal) {
        const data = personal.data;
        if (data.fullName) score += 3;
        if (data.email && data.email.includes('@')) score += 3;
        if (data.phone) score += 3;
        if (data.location) score += 3;
        if (data.linkedin || data.website) score += 3;
    }

    // 2. Summary Presence (10 pts)
    const summary = resume.sections.find(s => s.type === 'summary');
    if (summary && 'data' in summary && summary.data.content.length > 50) {
        score += 10;
    } else if (summary && 'data' in summary && summary.data.content.length > 0) {
        score += 5;
    }

    // 3. Work Experience Density (30 pts)
    const experience = resume.sections.find(s => s.type === 'experience');
    if (experience && 'items' in experience && experience.items.length > 0) {
        const itemWeight = Math.min(experience.items.length * 10, 30);
        score += itemWeight;

        // Bonus for descriptions
        const hasDescriptions = experience.items.every(item => item.description.length > 30);
        if (hasDescriptions) score += 5;
    }

    // 4. Skills (15 pts)
    const skills = resume.sections.find(s => s.type === 'skills');
    if (skills && 'items' in skills && skills.items.length >= 5) {
        score += 15;
    } else if (skills && 'items' in skills && skills.items.length > 0) {
        score += 8;
    }

    // 5. Education (15 pts)
    const education = resume.sections.find(s => s.type === 'education');
    if (education && 'items' in education && education.items.length > 0) {
        score += 15;
    }

    // 6. Impact & Quantifiable Results (15 pts) - Heuristic check for numbers/percentages
    const allText = JSON.stringify(resume.sections);
    const hasNumbers = /\d+%|\$\d+|[1-9]\d* (years|users|projects|team)/i.test(allText);
    if (hasNumbers) score += 15;

    // Cap at 100
    return Math.min(score, maxScore);
}
