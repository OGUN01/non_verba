import React from 'react';

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

interface DifficultySelectorProps {
    selectedDifficulty: string;
    onDifficultyChange: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onDifficultyChange }) => {
    return (
        <div>
            <label htmlFor="difficulty-select" className="block text-sm font-medium text-slate-300 mb-2">
                Choose a Difficulty
            </label>
            <select
                id="difficulty-select"
                value={selectedDifficulty}
                onChange={(e) => onDifficultyChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
                {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                        {difficulty}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DifficultySelector;