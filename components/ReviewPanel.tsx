import React, { useState, useEffect } from 'react';

interface ReviewPanelProps {
    rating: number | null;
    comment: string;
    onSave: (rating: number | null, comment: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({ rating, comment, onSave, isOpen, onClose }) => {
    const [localRating, setLocalRating] = useState<number | null>(rating);
    const [localComment, setLocalComment] = useState<string>(comment);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    useEffect(() => {
        setLocalRating(rating);
        setLocalComment(comment);
    }, [rating, comment, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(localRating, localComment);
        onClose();
    };

    const handleClear = () => {
        setLocalRating(null);
        setLocalComment('');
    };

    const renderStar = (index: number) => {
        const isFilled = hoveredStar !== null ? index <= hoveredStar : localRating !== null && index <= localRating;

        return (
            <button
                key={index}
                type="button"
                onClick={() => setLocalRating(index)}
                onMouseEnter={() => setHoveredStar(index)}
                onMouseLeave={() => setHoveredStar(null)}
                className="focus:outline-none transition-transform duration-200 hover:scale-110"
                aria-label={`Rate ${index} star${index > 1 ? 's' : ''}`}
            >
                <svg
                    className={`w-10 h-10 ${isFilled ? 'text-yellow-400' : 'text-gray-600'} transition-colors duration-200`}
                    fill={isFilled ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl shadow-2xl p-6 w-full max-w-2xl animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-100">Review Question</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        aria-label="Close review panel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                            Rating {localRating !== null && `(${localRating}/5)`}
                        </label>
                        <div className="flex gap-2 items-center">
                            {[1, 2, 3, 4, 5].map(renderStar)}
                            {localRating !== null && (
                                <button
                                    onClick={() => setLocalRating(null)}
                                    className="ml-4 text-sm text-slate-400 hover:text-slate-200 underline"
                                >
                                    Clear rating
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="review-comment" className="block text-sm font-semibold text-slate-300 mb-3">
                            Comment
                        </label>
                        <textarea
                            id="review-comment"
                            value={localComment}
                            onChange={(e) => setLocalComment(e.target.value)}
                            placeholder="Add your review comments here..."
                            rows={6}
                            maxLength={1000}
                            className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-slate-400 mt-2 text-right">
                            {localComment.length}/1000 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleClear}
                            className="flex-1 bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                        >
                            Save Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewPanel;
