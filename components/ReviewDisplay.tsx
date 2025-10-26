import React from 'react';

interface ReviewDisplayProps {
    rating: number | null;
    comment: string;
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ rating, comment }) => {
    // Don't render if no review exists
    if (rating === null && !comment) {
        return null;
    }

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-6 h-6 ${i <= (rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill={i <= (rating || 0) ? 'currentColor' : 'none'}
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
            );
        }
        return stars;
    };

    return (
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-200">Team Review</h4>
                {rating !== null && (
                    <div className="flex items-center gap-1">
                        {renderStars()}
                        <span className="ml-2 text-sm font-semibold text-slate-300">
                            {rating}/5
                        </span>
                    </div>
                )}
            </div>

            {comment && (
                <div className="mt-3">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {comment}
                    </p>
                </div>
            )}

            {!rating && !comment && (
                <p className="text-sm text-slate-400 italic">
                    No review available for this question yet.
                </p>
            )}
        </div>
    );
};

export default ReviewDisplay;
