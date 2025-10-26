
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                Non-Verbal Reasoning AI
            </h1>
            <p className="mt-2 text-lg text-slate-400">
                Generate limitless practice questions with detailed SVG diagrams.
            </p>
        </header>
    );
};

export default Header;
