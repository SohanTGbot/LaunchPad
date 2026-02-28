"use client";

import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { insforge } from '@/lib/insforge';
import { useToast } from './use-toast';

export function useAutoSave(resumeId: string, isLoading: boolean = false) {
    const { resume } = useResumeStore();
    const { toast } = useToast();

    // Keep track of the initial load to prevent saving immediately
    const isFirstLoad = useRef(true);
    // Keep track of the last saved state string to prevent redundant saves
    const lastSavedState = useRef<string>('');

    useEffect(() => {
        if (isLoading) return; // Wait for initial fetch

        // Validate resumeId - if it's 'new' we skip the UUID check for the update logic
        // But if it's not 'new', it MUST be a valid UUID string
        const isValidUuid = (uuid: string) => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(uuid);
        };

        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            lastSavedState.current = JSON.stringify(resume);
            return;
        }

        const currentState = JSON.stringify(resume);
        if (currentState === lastSavedState.current) return;

        const timeoutId = setTimeout(async () => {
            try {
                const { data: { session } } = await insforge.auth.getCurrentSession();

                if (!session) {
                    // Don't show error for guests, it's annoying. 
                    // LocalStorage (via Zustand persist) will handle their draft.
                    return;
                }

                if (resumeId === 'new') {
                    const { data, error } = await insforge.database
                        .from('resumes')
                        .insert([{
                            title: resume.title,
                            template_id: resume.templateId, // Correct column name is template_id
                            data: resume,
                            user_id: session.user.id,
                            updated_at: new Date().toISOString()
                        }])
                        .select()
                        .single();

                    if (error) throw error;
                    if (data?.id) {
                        lastSavedState.current = currentState;
                        // Redirect to the new URL with the UUID
                        window.location.href = `/builder/${data.id}`;
                    }
                    return;
                }

                if (!isValidUuid(resumeId)) {
                    console.warn('Skipping auto-save update: Invalid resume ID', resumeId);
                    return;
                }

                // Update existing resume
                const { error } = await insforge.database
                    .from('resumes')
                    .update({
                        title: resume.title,
                        template_id: resume.templateId,
                        data: resume,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', resumeId)
                    .eq('user_id', session.user.id);

                if (error) {
                    console.error('InsForge Update Error:', error);
                    throw error;
                }

                lastSavedState.current = currentState;

            } catch (error: any) {
                console.error('Auto-save failed:', error.message);
                toast(`Auto-save failed: ${error.message}`, 'error');
            }
        }, 3000); // 3 second debounce to be safe

        return () => clearTimeout(timeoutId);
    }, [resume, resumeId, toast, isLoading]);
}
