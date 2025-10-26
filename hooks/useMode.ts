import { useState, useEffect, useCallback } from 'react';

export type AppMode = 'user' | 'reviewer';

interface UseModeReturn {
    mode: AppMode;
    isReviewerMode: boolean;
    isUserMode: boolean;
    toggleMode: () => void;
    setMode: (mode: AppMode) => void;
}

/**
 * Custom hook to manage application mode (User vs Reviewer)
 * Mode is stored in URL query parameter for easy sharing
 */
export const useMode = (): UseModeReturn => {
    const [mode, setModeState] = useState<AppMode>('user');

    // Read mode from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const modeParam = params.get('mode');

        if (modeParam === 'reviewer' || modeParam === 'user') {
            setModeState(modeParam as AppMode);
        }
    }, []);

    // Update URL when mode changes
    const setMode = useCallback((newMode: AppMode) => {
        setModeState(newMode);

        // Update URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('mode', newMode);
        window.history.pushState({}, '', url.toString());
    }, []);

    // Toggle between user and reviewer mode
    const toggleMode = useCallback(() => {
        const newMode = mode === 'user' ? 'reviewer' : 'user';
        setMode(newMode);
    }, [mode, setMode]);

    return {
        mode,
        isReviewerMode: mode === 'reviewer',
        isUserMode: mode === 'user',
        toggleMode,
        setMode
    };
};
