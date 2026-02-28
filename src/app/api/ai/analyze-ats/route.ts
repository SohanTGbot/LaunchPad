import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        // 1. Parse payload
        const body = await req.json();
        const { resumeData, jobDescription } = body;

        if (!resumeData || !jobDescription) {
            return NextResponse.json({ error: 'Resume data and job description are required' }, { status: 400 });
        }

        // 2. Initialize Gemini API (Used instead of OpenRouter to avoid 402 errors)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini AI is not configured securely on the server.' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use confirmed Gemini 2.x/2.5 models - Pro is better for critical ATS analysis
        const modelConfigs = [
            { name: "gemini-2.5-pro", version: "v1" },
            { name: "gemini-2.5-flash", version: "v1" },
            { name: "gemini-2.0-flash", version: "v1" }
        ];

        // Prepare a slimmed down version of the resume
        const textSections = resumeData.sections
            .filter((s: any) => s.isVisible)
            .map((s: any) => {
                let content = '';
                if (s.type === 'personal') {
                    content = JSON.stringify(s.data);
                } else if (s.type === 'summary') {
                    content = s.data.content;
                } else if (s.items) {
                    content = s.items.map((i: any) => JSON.stringify(i)).join('\n');
                }
                return `${s.title}:\n${content}\n`;
            })
            .join('\n');

        const prompt = `
      You are an expert Application Tracking System (ATS) and Resume Reviewer.
      Analyze the provided Resume against the provided Job Description.
      
      Resume Information:
      ${textSections}

      Target Job Description:
      ${jobDescription}

      Compare the resume against the job requirements and provide a structured JSON response.
      Be critical and professional. The score should represent the actual chances of passing an automated screening.

      Your task is to provide a structured JSON response containing:
      1. "score": An integer from 0 to 100.
      2. "strengths": An array of strings (max 4) highlighting why this candidate matches.
      3. "improvements": An array of strings (max 5) highlighting gaps or specific wording changes.

      Example format:
      {
        "score": 85,
        "strengths": ["Matched required React experience.", "Strong communication skills shown."],
        "improvements": ["Missing 'Typescript' keyword.", "Quantify achievements in last role."]
      }

      Respond ONLY with valid JSON.
    `;

        // 3. Generate Content via Gemini
        let response;
        let lastErr;
        for (const config of modelConfigs) {
            try {
                const currentModel = genAI.getGenerativeModel(
                    {
                        model: config.name,
                    },
                    { apiVersion: config.version as any }
                );
                response = await currentModel.generateContent(prompt);
                break;
            } catch (err) {
                lastErr = err;
                console.warn(`Gemini ${config.name} (${config.version}) failed for ATS, trying next...`);
            }
        }

        if (!response) {
            throw lastErr || new Error('All Gemini models failed to process ATS request');
        }

        const messageContent = response.response.text();

        // Parse the JSON
        let analysis;
        try {
            // Remove potential markdown blocks just in case
            const cleanJsonStr = messageContent.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(cleanJsonStr);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", messageContent);
            throw new Error('AI returned an invalid format. Please try again.');
        }

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error('ATS Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process AI request' }, { status: 500 });
    }
}
