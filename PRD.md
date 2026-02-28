# PRD — AI-Powered CV & Resume Maker
**Product Name:** CraftCV (or your preferred name)
**Version:** 1.0
**Stack:** Next.js · TailwindCSS · Framer Motion · Google Gemini · OpenRouter · Insforge DB
**Platform:** Web-first, Mobile App-ready (React Native conversion path)

---

## 1. Product Overview

CraftCV is a premium, AI-assisted CV and Resume builder that lets anyone create, customize, and export professional resumes with zero design skill. The product is built on three pillars: cinematic UI/UX, AI intelligence at every step, and frictionless user flow. Every screen feels like a shot from a design reel — matte finish, glass morphism, premium typography, Apple-level minimalism.

---

## 2. Goals & Success Metrics

**Primary Goals**
- Let any user build a complete, professional resume in under 10 minutes
- Make AI feel like a co-pilot, not a gimmick
- Deliver a design experience that rivals Figma prototypes in production

**Key Metrics**
- Time-to-first-resume under 8 minutes for new users
- Resume export success rate above 98%
- AI suggestion acceptance rate above 60%
- Mobile usability score above 90 (Lighthouse)

---

## 3. Target Users

- Fresh graduates building their first resume
- Mid-career professionals updating or pivoting
- Job seekers applying to multiple roles needing tailored resumes
- Freelancers needing polished portfolio CVs
- International users (multilingual support in v2)

---

## 4. Design System

### 4.1 Visual Language
- **Finish:** Matte background surfaces, no harsh shadows
- **Effects:** Frosted glass cards (backdrop-filter: blur), subtle noise texture on bg
- **Motion:** Framer Motion — spring physics, staggered reveals, magnetic hover buttons
- **Mode:** Dark mode default, Light mode toggle, syncs with OS preference, persists in DB
- **Color Palette:**
  - Dark BG: #0A0A0F · Surface: #13131A · Border: rgba(255,255,255,0.07)
  - Accent: Electric Indigo #6C63FF · Secondary: Cyan #00D4FF
  - Light BG: #F5F5F7 · Surface: #FFFFFF · Border: rgba(0,0,0,0.08)
- **Typography:**
  - Display: Clash Display or Cal Sans (headings)
  - Body: Inter (all weights 300–700)
  - Mono: JetBrains Mono (code/labels)
  - Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64px

### 4.2 Component Language
- **Buttons:** Gradient fill, animated shimmer on hover, scale(0.97) on press, magnetic pull effect near cursor
- **Cards:** Glass morphism — semi-transparent bg, thin border, blur backdrop
- **Inputs:** Floating labels, smooth focus ring, error shake animation
- **Modals:** Slide-up from bottom on mobile, scale-in on desktop, frosted overlay
- **Skeleton Loaders:** Animated shimmer while AI is generating
- **Toasts:** Bottom-right, slide-in, auto-dismiss, color-coded (success/error/info)

---

## 5. User Flow (Page by Page)

### Page 1 — Landing / Home
**Goal:** Convert visitor to signed-up user in one scroll

**Sections:**
- Full-viewport hero: Animated headline, live rotating resume preview mockup, two CTAs ("Build My Resume Free" / "See Templates")
- Social proof ticker: Companies where users got hired
- Feature highlights: 3 animated cards — AI Writing, Premium Templates, One-click Export
- Template showcase: Horizontal scroll gallery with hover-zoom effect
- How it works: 3-step animated illustration (Fill → AI Enhance → Export)
- Testimonials: Staggered card grid
- Final CTA: Full-width gradient banner

**Components:** Framer Motion scroll-triggered animations, magnetic CTA button, glassmorphic navbar with blur on scroll

---

### Page 2 — Auth (Sign Up / Login)
**Goal:** Zero-friction onboarding

**Layout:** Split screen — left side: animated resume preview / brand message, right side: form

**Features:**
- Google OAuth (primary)
- Email + Password (secondary)
- Magic Link option
- After signup → redirected to Onboarding Quiz (not dashboard)
- Smooth page transition animation

---

### Page 3 — Onboarding Quiz (NEW — for better UX)
**Goal:** Personalize the experience before builder opens

**Flow (max 4 steps, progress bar shown):**
1. "What's your goal?" — Job search / Freelance / Portfolio / Other
2. "What's your experience level?" — Student / 0–2 yrs / 3–7 yrs / 8+ yrs
3. "What industry?" — Tech / Design / Finance / Healthcare / etc.
4. "Start fresh or pick a template?" — Blank / Choose template

**Result:** AI pre-loads relevant template suggestions and personalizes section suggestions. Stored in user profile in Insforge DB.

---

### Page 4 — Template Gallery
**Goal:** Let user pick starting point

**Layout:** Masonry or 3-col grid

**Features:**
- Filter tabs: All / Simple / Creative / ATS-Friendly / Executive / Academic
- Hover preview with live zoom
- "Use This Template" button → opens builder
- "Preview Full" → modal with full A4 view
- Each card has tag badges: ATS Score, Industry, Style
- Search by name/category
- Favorites (saved to user account)

---

### Page 5 — Resume Builder (Core Page — Most Important)
**Goal:** Full editing experience, real-time preview, AI co-pilot

**Layout:** 3-Panel Layout
- **Left Panel (30%):** Section navigator + Add Section button
- **Center Panel (40%):** Form inputs (edit area)
- **Right Panel (30%):** Live A4 preview (updates in real-time as user types)

On mobile: Bottom sheet for sections, swipe between edit and preview

**Sections user can add/remove/reorder (drag-and-drop):**
- Personal Info (name, photo, title, email, phone, location, LinkedIn, website)
- Professional Summary
- Work Experience (multiple entries, each with: company, role, dates, bullets)
- Education
- Skills (tags/chips UI with proficiency level)
- Projects
- Certifications & Licenses
- Languages
- Volunteer Work
- Publications / Research
- Awards & Achievements
- References
- Custom Section (user defines heading and content)

**Per-section editing features:**
- Rich text for descriptions (bold, italic, bullet, link)
- Drag to reorder entries within a section
- Duplicate entry button
- Delete with confirmation
- AI Enhance button on every field (see AI Features section)
- Date picker with "Present" toggle
- Character count with soft limit warning

**Live Preview Panel:**
- True A4 proportions rendered in browser using react-pdf or HTML/CSS print view
- Font and color match selected template exactly
- Updates with ~300ms debounce (smooth, not jarring)
- Zoom in/out controls
- Scroll if content overflows one page
- Page overflow indicator (warns when content spills to page 2)

**Toolbar (top of builder):**
- Undo / Redo (ctrl+Z support)
- Save (auto-save every 30s + manual save button)
- Template swap (change design without losing data)
- Font picker (curated set of 8 resume-safe fonts)
- Color theme picker (6 accent color options per template)
- Section spacing slider
- Export button (prominent)
- AI Assistant toggle button

---

### Page 6 — AI Assistant Panel (Slide-in Drawer)
**Goal:** AI co-pilot for writing and suggestions

**Trigger:** AI button in builder toolbar or clicking sparkle icon on any field

**Features:**
- **Fix Grammar & Spelling:** One click on any text field
- **Improve This Bullet:** Rewrites weak bullet points into strong achievement-focused ones
- **Generate From Job Description:** User pastes job URL or JD text → AI tailors resume content to match keywords
- **Write Summary:** Auto-generates professional summary based on entered experience
- **Suggest Skills:** Based on role and industry, AI suggests relevant skills
- **Tone Adjuster:** Formal / Confident / Creative slider — rewrites selected text
- **ATS Score Check:** AI analyzes resume against common ATS filters, gives score + suggestions
- **Chat Mode:** Freeform chat with AI — "Make my experience sound more senior", "Add more impact to my achievements"

**AI Routing:**
- Fast, simple tasks (fix grammar, improve sentence) → Google Gemini Flash
- Complex tasks (full resume rewrite, JD matching, ATS analysis) → OpenRouter (Claude or GPT-4o)
- All AI calls streamed (text appears word-by-word, not all at once)
- User can accept suggestion, reject, or edit before applying
- AI suggestion history stored per session

---

### Page 7 — Export & Download
**Goal:** Deliver the final resume in the right format

**Export Options:**
- PDF (primary, pixel-perfect A4)
- DOCX (editable Word format)
- Plain Text (for ATS paste fields)
- Share Link (public URL with read-only view, expires in 7 days, extendable)
- Print directly from browser

**PDF Export:** Use react-pdf or Puppeteer server-side for pixel-perfect rendering

**Features:**
- Preview before download
- Filename customization
- "Optimize for ATS" checkbox (removes graphics, uses safe fonts, single column)
- Download history stored in account

---

### Page 8 — Dashboard (My Resumes)
**Goal:** Manage multiple resumes

**Layout:** Card grid

**Per Resume Card:**
- Thumbnail preview
- Resume name (editable inline)
- Last edited timestamp
- Options menu: Edit / Duplicate / Rename / Delete / Export / Share

**Features:**
- Create new resume button
- Sort by: Last edited / Created / Name
- Max resumes: Unlimited (or tier-based in v2)
- Resume version history (last 5 versions, restore any)

---

### Page 9 — Account & Settings
**Goal:** Profile management, preferences

**Sections:**
- Profile info (name, avatar, email)
- Preferences: Default language, default template, AI model preference
- Theme: Dark / Light / System
- Notification settings
- Change password / connected accounts
- Data export (download all resume data as JSON)
- Delete account

---

## 6. AI Features — Detailed Spec

### 6.1 Real-time Inline Suggestions
- As user types in any text area, AI watches for pause (1.5s debounce)
- If it detects weak phrasing ("did tasks", "responsible for"), it shows a subtle suggestion chip below the field
- User can tap chip to apply, dismiss, or ignore
- Powered by Gemini Flash (low latency, low cost)

### 6.2 Bullet Point Enhancer
- Input: "Managed social media accounts"
- Output: "Grew Instagram following by 45% in 3 months by executing data-driven content strategy across 4 platforms"
- Always uses: Action verb + metric/result + context
- Shows before/after comparison before applying

### 6.3 Job Description Matcher
- User inputs job URL or pastes JD
- AI extracts key skills, keywords, requirements
- Highlights which resume sections match and which are missing
- Suggests additions to Summary, Skills, and Experience bullets
- Gives match percentage score

### 6.4 ATS Analyzer
- Scans resume for: keyword density, formatting issues, font safety, missing sections
- Returns score 0–100 with per-section breakdown
- Lists specific improvements as clickable action items
- Re-scan after applying changes

### 6.5 Profile Builder from LinkedIn
- v1.1 feature: User pastes LinkedIn profile URL → AI scrapes public data → pre-fills form fields

---

## 7. Template Specifications

**Minimum 12 templates at launch:**

| Name | Style | Best For |
|------|-------|----------|
| Meridian | Clean, single-column | All roles, ATS safe |
| Nova | Two-column, accent sidebar | Tech, Design |
| Executive | Formal, serif headers | Senior roles, Finance |
| Minimal | Ultra-minimal, lots of whitespace | Creative fields |
| Academic | Dense, traditional | PhD, Research |
| Cascade | Modern, gradient accent bar | Marketing, Sales |
| Grid | Structured grid layout | Product, PM roles |
| Ink | Typography-forward, editorial | Writers, Journalists |
| Studio | Dark mode option, bold | Design, Media |
| Compass | Icon-integrated sections | General use |
| Spark | Colorful, energetic | Startups, Early career |
| Classic | Conservative, government-safe | Public sector, Legal |

Each template: fully color-themeable (6 accent presets), font swappable, responsive preview

---

## 8. Database Schema (Insforge)

**Tables:**

users
- id, email, name, avatar_url, auth_provider, created_at, preferences (JSON), plan

resumes
- id, user_id, title, template_id, data (JSON — full resume content), version, created_at, updated_at, is_public, share_token

resume_versions
- id, resume_id, data (JSON snapshot), created_at, label

templates
- id, name, category, thumbnail_url, config (JSON), is_premium, tags

ai_sessions
- id, user_id, resume_id, input, output, model_used, tokens_used, created_at

exports
- id, user_id, resume_id, format, file_url, created_at

---

## 9. Technical Architecture

### Frontend (Next.js App Router)
- /app/page.tsx → Landing
- /app/auth/page.tsx → Auth
- /app/onboarding/page.tsx → Quiz
- /app/templates/page.tsx → Gallery
- /app/builder/[resumeId]/page.tsx → Builder
- /app/dashboard/page.tsx → My Resumes
- /app/settings/page.tsx → Account
- /app/r/[token]/page.tsx → Public share view

### State Management
- Zustand for resume state (section data, UI state, undo/redo history)
- React Query (TanStack Query) for server data fetching and caching
- Auto-save via debounced mutation to Insforge

### AI API Layer
- /api/ai/enhance → Gemini Flash (inline suggestions, grammar fix)
- /api/ai/generate → OpenRouter (complex generation, JD match)
- /api/ai/ats-score → OpenRouter
- All endpoints: streaming responses using Server-Sent Events
- Rate limiting: 20 AI calls/hour for free users

### PDF Export
- Server-side: Puppeteer headless browser renders resume HTML → PDF
- Client fallback: react-pdf for in-browser preview
- DOCX: docx.js library

### Auth
- NextAuth.js with Google provider + email/password
- JWT sessions, stored in httpOnly cookies

### File Storage
- Resume thumbnails and exported PDFs → Cloudflare R2 or Supabase Storage

---

## 10. Responsive & Mobile Strategy

### Breakpoints
- Mobile: < 768px
- Tablet: 768–1024px
- Desktop: > 1024px

### Mobile Builder Layout
- Full-screen edit mode (no split panel)
- Bottom navigation bar: Sections / Edit / Preview / AI / Export
- Swipe left/right between edit and preview
- All modals as bottom sheets

### Mobile-First Considerations
- Touch-friendly drag handles for section reorder
- Larger tap targets (min 44px)
- No hover-dependent interactions on mobile
- Preview renders as scrollable phone-size mockup on mobile (not A4)

### React Native Conversion Path
- All business logic in shared hooks (usable in RN)
- API layer fully decoupled from UI
- Design tokens exported as JS constants (shared between web and native)
- In v2: Expo app wraps web views for fast launch, native builder in v3

---

## 11. Feature Rollout Plan

### v1.0 (Launch)
- Auth, Onboarding, Template Gallery (12 templates)
- Full Builder with all section types
- Real-time preview
- AI: Bullet enhancer, grammar fix, summary generator, ATS score
- Export: PDF + DOCX
- Dashboard with version history
- Dark/Light mode

### v1.1 (Month 2)
- JD Matcher (paste job description)
- Share link with public view
- More templates (6 additional)
- AI Chat Mode in assistant panel

### v1.2 (Month 3)
- LinkedIn import
- Cover letter builder (same editor, different template set)
- Multi-language support (Spanish, French, Bengali)

### v2.0 (Month 5)
- Pricing tiers (free/pro/team)
- React Native mobile app (Expo)
- Team/Agency workspace
- Custom domain for shared resumes

---

## 12. Security & Compliance

- All API keys server-side only (never exposed to client)
- AI prompts sanitized before sending (no raw user input to AI without cleaning)
- Resume data encrypted at rest in Insforge
- GDPR-compliant: data export and delete account features
- Rate limiting on all API routes
- CSRF protection on all mutations

---

## 13. Performance Targets

- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.5s
- Lighthouse Score: > 90 all categories
- AI response (streaming start): < 800ms
- PDF generation: < 3s
- Auto-save: silent, < 500ms, no UI disruption

---

## 14. Open Questions / Decisions Needed

1. Product name — CraftCV
2. Free tier limits — for now no limit in future 
3. Gemini vs OpenRouter default for which AI tasks? : gemini default
4. Insforge hosting region (for GDPR compliance if targeting EU)? : india user target 
5. Photo upload in resume — required or optional per template? : optional
6. Will cover letter be in v1 or pushed to v1.2? : v1.2

---

*PRD Version 1.0 — Ready for design handoff and sprint planning*