import React from 'react';
import type { AppMode } from '../hooks/useMode';

interface ModeToggleProps {
    mode: AppMode;
    onToggle: () => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
    return (
        <div className="flex items-center gap-3">
            {/* Mode Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                mode === 'reviewer'
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-600 text-white'
            }`}>
                {mode === 'reviewer' ? '👥 Reviewer Mode' : '👤 Student Mode'}
            </div>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="relative inline-flex items-center h-8 w-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{
                    backgroundColor: mode === 'reviewer' ? '#7c3aed' : '#2563eb'
                }}
                aria-label="Toggle between Student and Reviewer mode"
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                        mode === 'reviewer' ? 'translate-x-9' : 'translate-x-1'
                    }`}
                >
                    <span className="flex items-center justify-center h-full text-xs">
                        {mode === 'reviewer' ? '👥' : '👤'}
                    </span>
                </span>
            </button>

            {/* Mode Label */}
            <span className="text-sm text-slate-300 font-medium">
                {mode === 'reviewer' ? 'Reviewing Questions' : 'Practice Mode'}
            </span>
        </div>
    );
};

export default ModeToggle;
