import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set runtime to edge for better streaming performance
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate Request
        // BYPASSED for local testing/verification as per original implementation
        // const { user } = await auth();

        // 2. Parse payload
        const body = await req.json();
        const { content, type = 'enhance', customInstruction } = body;

        // Validation: certain types need content, others might generate from context (to be added later if needed)
        if (!content && !['suggest_skills', 'generate_summary'].includes(type)) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // 3. Initialize Gemini API
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini AI is not configured securely on the server.' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use confirmed Gemini 2.x/2.5 models available for this API key
        const modelConfigs = [
            { name: "gemini-2.5-flash", version: "v1" },
            { name: "gemini-2.0-flash", version: "v1" },
            { name: "gemini-2.5-pro", version: "v1" },
            { name: "gemini-2.0-flash-lite", version: "v1" }
        ];

        // 4. Construct Prompt based on Type
        const baseSystem = "You are an expert resume writer and ATS optimizer. Return ONLY the requested content. Do not include conversational filler, explanations, markdown code blocks (like ```), or quotes. Maintain the professional tone.";

        let prompt = '';
        switch (type) {
            case 'enhance':
                prompt = `${baseSystem}\nTask: Enhance the following text to be more professional, impactful, and ATS-friendly. Use strong action verbs.\n\nText: ${content}`;
                break;
            case 'summarize':
                prompt = `${baseSystem}\nTask: Write a compelling 3-4 sentence professional summary based on the following professional background. Focus on value proposition.\n\nBackground: ${content}`;
                break;
            case 'suggest_skills':
                prompt = `${baseSystem}\nTask: Based on the following professional experience, suggest 12-15 highly relevant technical and soft skills. Return ONLY as a comma-separated list.\n\nExperience: ${content}`;
                break;
            case 'tone_formal':
                prompt = `${baseSystem}\nTask: Rewrite the following to sound more formal, executive, and sophisticated.\n\nText: ${content}`;
                break;
            case 'tone_confident':
                prompt = `${baseSystem}\nTask: Rewrite the following to sound more confident, assertive, and achievement-focused.\n\nText: ${content}`;
                break;
            case 'tone_creative':
                prompt = `${baseSystem}\nTask: Rewrite the following to sound more creative, unique, and storytelling-oriented while maintaining professionalism.\n\nText: ${content}`;
                break;
            case 'fix_grammar':
                prompt = `${baseSystem}\nTask: Fix any grammar, spelling, or punctuation errors in the following text while keeping the meaning identical.\n\nText: ${content}`;
                break;
            case 'custom':
                prompt = `${baseSystem}\nTask: ${customInstruction}\n\nText: ${content}`;
                break;
            default:
                prompt = `${baseSystem}\nTask: Improve the following text: ${content}`;
        }

        // 5. Generate Streaming Content with Fallback
        const attemptGeneration = async (modelInstance: any) => {
            return await modelInstance.generateContentStream(prompt);
        };

        try {
            let result;
            let currentConfigIndex = 0;

            while (currentConfigIndex < modelConfigs.length) {
                const config = modelConfigs[currentConfigIndex];
                try {
                    const currentModel = genAI.getGenerativeModel(
                        { model: config.name },
                        { apiVersion: config.version as any }
                    );
                    result = await attemptGeneration(currentModel);
                    break;
                } catch (err: any) {
                    currentConfigIndex++;
                    if (currentConfigIndex >= modelConfigs.length) throw err;
                    console.warn(`Gemini model ${config.name} (${config.version}) failed, trying ${modelConfigs[currentConfigIndex].name}`);
                }
            }

            if (!result) throw new Error("Failed to initialize Gemini stream");

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of result.stream) {
                            const chunkText = chunk.text();
                            if (chunkText) {
                                controller.enqueue(encoder.encode(chunkText));
                            }
                        }
                    } catch (streamError: any) {
                        console.error("Stream error:", streamError);
                        // Send the error message through the stream so the UI can show it
                        controller.enqueue(encoder.encode(`\n[STREAM_ERROR]: ${streamError.message || 'Unknown stream error'}`));
                        controller.error(streamError);
                    } finally {
                        controller.close();
                    }
                },
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                },
            });
        } catch (genError: any) {
            console.error("Gemini Generation Error:", genError);
            return NextResponse.json({
                error: `Gemini Error: ${genError.message || 'Unknown generation error'}`,
                suggestion: "If this persists, check your API key or model availability in your region."
            }, { status: 502 });
        }

    } catch (error: any) {
        console.error('AI Enhance Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process AI request' }, { status: 500 });
    }
}
