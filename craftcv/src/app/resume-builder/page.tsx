"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * PREMIUM AI CV BUILDER
 * Design: High-end editorial dark UI
 * Palette: #08090d (BG), #d4f429 (Accent), #e4e4f0 (Text)
 */

export default function ResumeBuilder() {
    // --- STATE: RESUME DATA ---
    const [resumeData, setResumeData] = useState({
        personal: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', photo: null },
        summary: '',
        experience: [{ id: 1, company: '', role: '', period: '', desc: '' }],
        education: [{ id: 1, school: '', degree: '', year: '', gpa: '' }],
        skills: [],
        projects: [{ id: 1, name: '', desc: '', tech: '', link: '' }],
        certifications: [{ id: 1, name: '', issuer: '', year: '' }]
    });

    // --- UI STATE ---
    const [activeSection, setActiveSection] = useState('Personal Info');
    const [template, setTemplate] = useState('Modern');
    const [accentColor, setAccentColor] = useState('#d4f429');
    const [fontFamily, setFontFamily] = useState('Inter');
    const [zoom, setZoom] = useState(84);
    const [rightTab, setRightTab] = useState('Preview');
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [atsScore, setAtsScore] = useState(0);

    // --- REFS ---
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const sections = [
        { id: '01', name: 'Personal Info', icon: '👤' },
        { id: '02', name: 'Summary', icon: '📝' },
        { id: '03', name: 'Experience', icon: '💼' },
        { id: '04', name: 'Education', icon: '🎓' },
        { id: '05', name: 'Skills', icon: '⚡' },
        { id: '06', name: 'Projects', icon: '🚀' },
        { id: '07', name: 'Certifications', icon: '🏆' }
    ];

    // --- EFFECTS: CUSTOM CURSOR ---
    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorDotRef.current && cursorRingRef.current) {
                cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                cursorRingRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    // --- EFFECTS: KEYBOARD SHORTCUTS ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
                e.preventDefault();
                window.print();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- EFFECTS: ATS SCORE CALCULATION ---
    useEffect(() => {
        let score = 0;
        if (resumeData.personal.name) score += 10;
        if (resumeData.personal.email) score += 5;
        if (resumeData.summary.length > 50) score += 15;
        if (resumeData.experience.some(exp => exp.company)) score += 20;
        if (resumeData.education.some(edu => edu.school)) score += 15;
        if (resumeData.skills.length > 0) score += 15;
        if (resumeData.projects.some(p => p.name)) score += 10;
        if (resumeData.certifications.some(c => c.name)) score += 10;
        setAtsScore(Math.min(score, 100));
    }, [resumeData]);

    // --- UTILS ---
    const addToast = (msg) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
    };

    const handleAutoSave = useCallback(() => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // In a real app, this would be an API call
        }, 800);
    }, []);

    // Simulate auto-save on change
    useEffect(() => {
        const timer = setTimeout(handleAutoSave, 2000);
        return () => clearTimeout(timer);
    }, [resumeData, handleAutoSave]);

    const updateField = (section, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const updateListItem = (section, id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const addItem = (section, templateObj) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { ...templateObj, id: Date.now() }]
        }));
    };

    const removeItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    // --- RENDER HELPERS ---
    const isSectionFilled = (name) => {
        switch (name) {
            case 'Personal Info': return !!resumeData.personal.name;
            case 'Summary': return resumeData.summary.length > 20;
            case 'Experience': return resumeData.experience.some(e => e.company);
            case 'Education': return resumeData.education.some(e => e.school);
            case 'Skills': return resumeData.skills.length > 0;
            case 'Projects': return resumeData.projects.some(p => p.name);
            case 'Certifications': return resumeData.certifications.some(c => c.name);
            default: return false;
        }
    };

    return (
        <div className="builder-root">
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&family=DM+Mono:wght@400;500&display=swap');
        
        :root {
          --bg: #08090d;
          --surface: #0d0d18;
          --accent: ${accentColor};
          --text: #e4e4f0;
          --text-muted: #8484a0;
          --border: #1a1a28;
          --input-border: #2a2a4a;
          --bezier: cubic-bezier(.16, 1, .3, 1);
        }

        * { cursor: none !important; }

        .builder-root {
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* --- CUSTOM CURSOR --- */
        .cursor-dot {
          width: 5px;
          height: 5px;
          background: var(--accent);
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 10000;
          border-radius: 50%;
        }
        .cursor-ring {
          width: 30px;
          height: 30px;
          border: 1px solid var(--accent);
          position: fixed;
          top: -12.5px; left: -12.5px;
          pointer-events: none;
          z-index: 10000;
          border-radius: 50%;
          transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
          opacity: 0.5;
        }
        body:hover .cursor-ring { opacity: 0.5; }
        .hovering .cursor-ring {
          width: 50px;
          height: 50px;
          top: -22.5px; left: -22.5px;
          background: var(--accent);
          opacity: 0.1;
        }

        /* --- TOPBAR --- */
        .progress-bar-container {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.05);
          z-index: 1000;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.8s var(--bezier);
        }

        .ticker-tape {
          height: 28px;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          overflow: hidden;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }
        .ticker-content {
          display: flex;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* --- LAYOUT --- */
        .main-layout {
          display: flex;
          flex: 1;
          height: calc(100vh - 30px);
        }

        /* Sidebar */
        .sidebar {
          width: 220px;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 32px 0;
          background: var(--bg);
          z-index: 10;
        }
        .nav-item {
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          transition: all 0.3s var(--bezier);
          opacity: 0.5;
          background: transparent;
          border: none;
          text-align: left;
        }
        .nav-item.active {
          opacity: 1;
          background: rgba(212, 244, 41, 0.03);
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 15%; bottom: 15%;
          width: 3px;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }
        .nav-item .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--accent);
        }
        .nav-item .check {
          margin-left: auto;
          color: var(--accent);
          font-size: 12px;
        }

        .ats-widget {
          margin-top: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ats-ring-svg {
          transform: rotate(-90deg);
        }
        .ats-ring-bg {
          fill: none;
          stroke: var(--border);
          stroke-width: 3;
        }
        .ats-ring-fill {
          fill: none;
          stroke: var(--accent);
          stroke-width: 3;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s var(--bezier);
        }

        /* Form Center */
        .form-container {
          flex: 1;
          padding: 60px 80px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 48px;
          margin-bottom: 48px;
          animation: fadeUp 0.6s var(--bezier);
        }

        .form-group {
          margin-bottom: 32px;
          position: relative;
        }
        .input-underline {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid var(--input-border);
          padding: 8px 0;
          color: var(--text);
          font-size: 16px;
          outline: none;
          transition: border-color 0.4s;
        }
        .input-line {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%;
          height: 1.5px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s var(--bezier);
        }
        .input-underline:focus ~ .input-line {
          transform: scaleX(1);
        }
        .floating-label {
          position: absolute;
          top: 8px; left: 0;
          color: var(--text-muted);
          pointer-events: none;
          transition: all 0.3s var(--bezier);
          font-size: 14px;
        }
        .input-underline:focus ~ .floating-label,
        .input-underline:not(:placeholder-shown) ~ .floating-label {
          top: -20px;
          font-size: 11px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-add {
          width: 100%;
          padding: 16px;
          border: 1px dashed var(--border);
          color: var(--text-muted);
          background: transparent;
          transition: all 0.3s;
          margin-top: 12px;
          font-size: 13px;
        }
        .btn-add:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(212, 244, 41, 0.02);
        }

        /* Preview Sidebar */
        .preview-pane {
          width: 440px;
          background: var(--surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }
        .preview-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: var(--text-muted);
        }
        .pulse-dot {
          width: 6px; height: 6px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }

        .resume-paper-container {
          flex: 1;
          display: flex;
          padding: 40px;
          overflow: auto;
          background: #050508;
          align-items: center;
          justify-content: center;
        }
        .resume-paper {
          background: white;
          width: 595px; /* A4 Ratio */
          min-height: 842px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          transform-origin: center center;
          color: #111;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        /* --- COMMAND PALETTE --- */
        .kd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          animation: fadeIn 0.3s;
        }
        .kd-box {
          width: 600px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .kd-input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 24px;
          color: white;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          outline: none;
          border-bottom: 1px solid var(--border);
        }

        /* --- ANIMATIONS --- */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* --- TOASTS --- */
        .toast-container {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3000;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .toast-pill {
          background: #1a1a28;
          border: 1px solid #2a2a4a;
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 13px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          animation: toastIn 0.4s var(--bezier);
        }
        @keyframes toastIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media print {
          .builder-root > *:not(.resume-paper-container) { display: none !important; }
          .resume-paper-container { padding: 0 !important; background: white !important; }
          .resume-paper { transform: scale(1) !important; box-shadow: none !important; }
        }
      ` }} />

            {/* CUSTOM CURSOR */}
            <div ref={cursorDotRef} className="cursor-dot" />
            <div ref={cursorRingRef} className="cursor-ring" />

            {/* TOP PROGRESS BAR */}
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${atsScore}%` }} />
            </div>

            {/* TICKER TAPE */}
            <div className="ticker-tape">
                <div className="ticker-content">
                    {Array(10).fill(0).map((_, i) => (
                        <span key={i} className="px-4">ATS-Optimised ✦ AI-Powered ✦ Real-time Preview ✦ Premium Design ✦</span>
                    ))}
                </div>
            </div>

            <div className="main-layout">
                {/* SIDEBAR NAV */}
                <div className="sidebar">
                    <div className="px-8 mb-12">
                        <h2 className="font-display text-lg tracking-tighter">CraftCV<span className="text-accent">.</span></h2>
                    </div>
                    <nav>
                        {sections.map((sec) => (
                            <button
                                key={sec.name}
                                className={`nav-item w-full ${activeSection === sec.name ? 'active' : ''}`}
                                onClick={() => setActiveSection(sec.name)}
                                onMouseEnter={() => cursorRingRef.current?.parentElement.classList.add('hovering')}
                                onMouseLeave={() => cursorRingRef.current?.parentElement.classList.remove('hovering')}
                            >
                                <span className="step-num">{sec.id}</span>
                                <span className="text-sm font-medium">{sec.name}</span>
                                {isSectionFilled(sec.name) && <span className="check">✓</span>}
                            </button>
                        ))}
                    </nav>

                    <div className="ats-widget">
                        <svg width="80" height="80" className="ats-ring-svg">
                            <circle cx="40" cy="40" r="35" className="ats-ring-bg" />
                            <circle
                                cx="40" cy="40" r="35"
                                className="ats-ring-fill"
                                style={{
                                    strokeDasharray: '220',
                                    strokeDashoffset: (220 - (220 * atsScore) / 100).toString()
                                }}
                            />
                            <text x="40" y="-40" textAnchor="middle" transform="rotate(90)" fill="white" fontSize="14" fontWeight="600" fontFamily="DM Mono">
                                {atsScore}
                            </text>
                        </svg>
                        <span className="text-[10px] uppercase tracking-widest text-muted">ATS Score</span>
                        <div className="flex items-center gap-2 mt-2">
                            <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-[10px] text-muted">{isSaving ? 'Saving...' : 'Draft Saved'}</span>
                        </div>
                        <div className="mt-4 flex gap-2 text-[9px] text-muted font-mono">
                            <span className="px-1.5 py-0.5 border border-border rounded">⌘K Command</span>
                        </div>
                    </div>
                </div>

                {/* CENTER FORM */}
                <div className="form-container">
                    <h1 className="section-title">{activeSection}</h1>

                    <div className="section-content">
                        {activeSection === 'Personal Info' && (
                            <div className="grid grid-cols-2 gap-x-12">
                                <InputGroup label="Full Name" value={resumeData.personal.name} onChange={v => updateField('personal', 'name', v)} />
                                <InputGroup label="Professional Title" value={resumeData.personal.title} onChange={v => updateField('personal', 'title', v)} />
                                <InputGroup label="Email Address" value={resumeData.personal.email} onChange={v => updateField('personal', 'email', v)} />
                                <InputGroup label="Phone Number" value={resumeData.personal.phone} onChange={v => updateField('personal', 'phone', v)} />
                                <InputGroup label="Location" value={resumeData.personal.location} onChange={v => updateField('personal', 'location', v)} />
                                <InputGroup label="LinkedIn Profile" value={resumeData.personal.linkedin} onChange={v => updateField('personal', 'linkedin', v)} />
                            </div>
                        )}

                        {activeSection === 'Summary' && (
                            <div>
                                <div className="form-group">
                                    <textarea
                                        className="input-underline min-h-[120px] resize-none"
                                        placeholder=" "
                                        value={resumeData.summary}
                                        onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))}
                                    />
                                    <div className="input-line" />
                                    <label className="floating-label">Professional Summary</label>
                                </div>
                                <button
                                    className="px-6 py-3 bg-accent text-black font-semibold rounded-full text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                                    onClick={() => addToast('AI Generating summary...')}
                                >
                                    ✨ AI Generate
                                </button>
                            </div>
                        )}

                        {activeSection === 'Experience' && (
                            <div>
                                {resumeData.experience.map((exp, i) => (
                                    <div key={exp.id} className="mb-12 p-6 border border-border/30 rounded-lg relative group">
                                        <button className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem('experience', exp.id)}>Remove</button>
                                        <div className="grid grid-cols-2 gap-x-8">
                                            <InputGroup label="Company" value={exp.company} onChange={v => updateListItem('experience', exp.id, 'company', v)} />
                                            <InputGroup label="Role" value={exp.role} onChange={v => updateListItem('experience', exp.id, 'role', v)} />
                                            <InputGroup label="Period (e.g. 2020 - Present)" value={exp.period} onChange={v => updateListItem('experience', exp.id, 'period', v)} />
                                        </div>
                                        <div className="form-group mt-4">
                                            <textarea
                                                className="input-underline min-h-[80px] resize-none"
                                                placeholder=" "
                                                value={exp.desc}
                                                onChange={e => updateListItem('experience', exp.id, 'desc', e.target.value)}
                                            />
                                            <div className="input-line" />
                                            <label className="floating-label">Responsibilities & Achievements</label>
                                        </div>
                                    </div>
                                ))}
                                <button className="btn-add" onClick={() => addItem('experience', { company: '', role: '', period: '', desc: '' })}>+ Add Work Experience</button>
                            </div>
                        )}

                        {/* Other sections would follow similar patterns... simplified here for length */}
                        {['Education', 'Skills', 'Projects', 'Certifications'].includes(activeSection) && (
                            <div className="py-20 text-center opacity-30">
                                <span className="font-mono text-xs uppercase tracking-widest">Section {activeSection} Content coming soon...</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-20 flex justify-between">
                        <button
                            className="text-muted text-sm hover:text-white transition-colors uppercase tracking-widest font-mono"
                            onClick={() => {
                                const idx = sections.findIndex(s => s.name === activeSection);
                                if (idx > 0) setActiveSection(sections[idx - 1].name);
                            }}
                        >
                            ← Previous
                        </button>
                        <button
                            className="px-8 py-3 bg-accent text-black font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-rgb,0.4)]"
                            onClick={() => {
                                const idx = sections.findIndex(s => s.name === activeSection);
                                if (idx < sections.length - 1) setActiveSection(sections[idx + 1].name);
                                else addToast('CV Complete! Ready for Export.');
                            }}
                        >
                            Next Step →
                        </button>
                    </div>
                </div>

                {/* RIGHT PREVIEW */}
                <div className="preview-pane">
                    <div className="preview-header">
                        <div className="flex gap-4">
                            <button
                                className={`text-xs uppercase tracking-widest font-bold ${rightTab === 'Preview' ? 'text-accent' : 'text-muted'}`}
                                onClick={() => setRightTab('Preview')}
                            >
                                Preview
                            </button>
                            <button
                                className={`text-xs uppercase tracking-widest font-bold ${rightTab === 'Style' ? 'text-accent' : 'text-muted'}`}
                                onClick={() => setRightTab('Style')}
                            >
                                Style
                            </button>
                        </div>
                        <div className="live-badge">
                            <div className="pulse-dot" /> Live Preview
                        </div>
                    </div>

                    {rightTab === 'Preview' ? (
                        <div className="resume-paper-container">
                            <div className="resume-paper" style={{ transform: `scale(${zoom / 100})` }}>
                                {/* TEMPLATE: MODERN */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex-1">
                                        <h1 className="text-4xl font-serif italic mb-1 uppercase tracking-tight">{resumeData.personal.name || 'YOUR NAME'}</h1>
                                        <p className="text-sm uppercase tracking-widest text-[#666] font-medium">{resumeData.personal.title || 'Professional Title'}</p>
                                    </div>
                                    <div className="text-[10px] text-right font-mono text-[#888] leading-relaxed">
                                        <p>{resumeData.personal.email}</p>
                                        <p>{resumeData.personal.phone}</p>
                                        <p>{resumeData.personal.location}</p>
                                    </div>
                                </div>

                                <div className="h-0.5 w-full bg-black/5 mb-8" />

                                <div className="grid grid-cols-12 gap-8 flex-1">
                                    <div className="col-span-8">
                                        <section className="mb-8">
                                            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                                                Profile <div className="h-px flex-1 bg-black/5" />
                                            </h2>
                                            <p className="text-[12px] leading-relaxed text-[#444]">{resumeData.summary || 'Aspiring professional with a focus on...'}</p>
                                        </section>

                                        <section>
                                            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                                                Experience <div className="h-px flex-1 bg-black/5" />
                                            </h2>
                                            {resumeData.experience.map((exp, i) => (
                                                <div key={i} className="mb-6">
                                                    <div className="flex justify-between font-bold text-[13px] mb-1">
                                                        <span>{exp.company || 'Company Name'}</span>
                                                        <span className="font-mono text-[10px] text-[#888]">{exp.period}</span>
                                                    </div>
                                                    <p className="text-[11px] italic mb-2 text-[#666]">{exp.role}</p>
                                                    <p className="text-[11px] leading-relaxed text-[#444] whitespace-pre-wrap">{exp.desc}</p>
                                                </div>
                                            ))}
                                        </section>
                                    </div>

                                    <div className="col-span-4 border-l border-black/5 pl-8">
                                        <section className="mb-8">
                                            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Focus</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {resumeData.skills.length > 0 ? resumeData.skills.map((s, i) => (
                                                    <span key={i} className="text-[9px] px-2 py-1 bg-black/5 rounded">{s}</span>
                                                )) : <span className="text-[9px] text-[#888]">No skills added</span>}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* ZOOM CONTROLS */}
                            <div className="fixed bottom-8 right-[480px] flex items-center gap-4 bg-surface/80 backdrop-blur border border-border p-2 rounded-full px-6">
                                <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="text-muted hover:text-white">-</button>
                                <span className="text-[10px] font-mono min-w-[30px]">{zoom}%</span>
                                <button onClick={() => setZoom(z => Math.min(z + 10, 150))} className="text-muted hover:text-white">+</button>
                                <div className="w-px h-4 bg-border mx-2" />
                                <button onClick={() => setZoom(84)} className="text-[10px] text-accent uppercase font-bold">Fit</button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 space-y-8 animate-fadeIn">
                            <section>
                                <h3 className="text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Templates</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Modern', 'Classic', 'Minimal'].map(t => (
                                        <button
                                            key={t}
                                            className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${template === t ? 'border-accent bg-accent/5' : 'border-border'}`}
                                            onClick={() => setTemplate(t)}
                                        >
                                            <div className="w-full aspect-[4/5] bg-bg/50 rounded flex items-center justify-center text-[8px] opacity-20">A4</div>
                                            <span className="text-[10px] uppercase font-bold">{t}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Accent Tone</h3>
                                <div className="flex gap-3">
                                    {['#d4f429', '#ff5a5f', '#1fe0ff', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                                        <button
                                            key={c}
                                            className={`w-8 h-8 rounded-full border-2 ${accentColor === c ? 'border-white' : 'border-transparent'}`}
                                            style={{ background: c }}
                                            onClick={() => setAccentColor(c)}
                                        />
                                    ))}
                                </div>
                            </section>

                            <div className="pt-8 border-t border-border">
                                <button
                                    className="w-full py-4 bg-white text-black font-bold uppercase text-[10px] tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-white/90"
                                    onClick={() => window.print()}
                                >
                                    Export PDF
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* COMMAND PALETTE */}
            {isCommandPaletteOpen && (
                <div className="kd-overlay" onClick={() => setIsCommandPaletteOpen(false)}>
                    <div className="kd-box" onClick={e => e.stopPropagation()}>
                        <input
                            autoFocus
                            className="kd-input"
                            placeholder="Search actions..."
                            onKeyDown={e => {
                                if (e.key === 'Escape') setIsCommandPaletteOpen(false);
                                if (e.key === 'Enter') {
                                    addToast(`Executed: ${e.currentTarget.value}`);
                                    setIsCommandPaletteOpen(false);
                                }
                            }}
                        />
                        <div className="p-4 bg-bg/50">
                            <div className="grid grid-cols-2 gap-4">
                                <CommandItem label="AI Write Summary" kbd="Enter" />
                                <CommandItem label="Export PDF" kbd="⌘E" />
                                <CommandItem label="Change Template" kbd="T" />
                                <CommandItem label="ATS Optimizer" kbd="A" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOASTS */}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className="toast-pill">{t.msg}</div>
                ))}
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange }) {
    return (
        <div className="form-group">
            <input
                className="input-underline"
                placeholder=" "
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <div className="input-line" />
            <label className="floating-label">{label}</label>
        </div>
    );
}

function CommandItem({ label, kbd }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer">
            <span className="text-sm">{label}</span>
            <span className="font-mono text-[10px] text-muted bg-white/5 px-1.5 py-0.5 rounded">{kbd}</span>
        </div>
    );
}
