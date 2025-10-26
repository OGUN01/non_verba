
import React from 'react';
import ModeToggle from './ModeToggle';
import type { AppMode } from '../hooks/useMode';

interface HeaderProps {
    mode?: AppMode;
    onToggleMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onToggleMode }) => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                Non-Verbal Reasoning AI
            </h1>
            <p className="mt-2 text-lg text-slate-400">
                Generate limitless practice questions with detailed SVG diagrams.
            </p>

            {/* Mode Toggle - only show if mode and handler are provided */}
            {mode && onToggleMode && (
                <div className="mt-6 flex justify-center">
                    <ModeToggle mode={mode} onToggle={onToggleMode} />
                </div>
            )}
        </header>
    );
};

export default Header;
