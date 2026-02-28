import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 4000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Helper hook for easier usage
export const useToast = () => {
    const { addToast } = useToastStore();

    return {
        toast: (message: string, type: ToastType = 'info') => addToast({ message, type }),
        success: (message: string) => addToast({ message, type: 'success' }),
        error: (message: string) => addToast({ message, type: 'error' }),
        info: (message: string) => addToast({ message, type: 'info' }),
    };
};
