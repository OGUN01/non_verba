import React, { useState, useEffect } from 'react';
import type { QuestionData } from '../types';
import ReviewPanel from './ReviewPanel';

interface QuestionDisplayProps {
    questions: QuestionData[];
    currentIndex: number;
    onNavigate: (newIndex: number) => void;
    onReviewUpdate: (index: number, rating: number | null, comment: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questions, currentIndex, onNavigate, onReviewUpdate }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

    const data = questions[currentIndex];

    useEffect(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
        setIsReviewOpen(false);
    }, [currentIndex, questions]);

    const handleReviewSave = (rating: number | null, comment: string) => {
        onReviewUpdate(currentIndex, rating, comment);
    };

    const hasReview = data.rating !== null || data.comment.trim() !== '';

    const getOptionClasses = (label: string) => {
        let classes = 'p-4 bg-slate-700/50 rounded-lg cursor-pointer transition-all duration-300 border-2 ';
        if (showAnswer) {
            if (label === data.answer) {
                classes += 'border-green-500 bg-green-900/50 scale-105 shadow-lg shadow-green-500/20';
            } else if (label === selectedAnswer) {
                classes += 'border-red-500 bg-red-900/50';
            } else {
                classes += 'border-transparent opacity-60';
            }
        } else {
            if (label === selectedAnswer) {
                classes += 'border-indigo-500 bg-slate-700 scale-105';
            } else {
                classes += 'border-transparent hover:border-slate-500 hover:bg-slate-700';
            }
        }
        return classes;
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-4">
                <p className="text-slate-400 font-semibold">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <h2 className="text-xl font-bold text-center mb-6 text-slate-200">{data.question}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                {data.options.map((option) => (
                    <div
                        key={option.label}
                        onClick={() => !showAnswer && setSelectedAnswer(option.label)}
                        className={getOptionClasses(option.label)}
                        role="button"
                        aria-pressed={selectedAnswer === option.label}
                        tabIndex={0}
                    >
                        <div
                            className="w-full h-32 bg-slate-800 rounded-md flex items-center justify-center p-2"
                            dangerouslySetInnerHTML={{ __html: option.svg }}
                        />
                        <p className="text-center font-bold mt-3 text-lg">{option.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => onNavigate(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-slate-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => setShowAnswer(true)}
                        disabled={showAnswer || !selectedAnswer}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                    >
                        Check Answer
                    </button>

                    <button
                        onClick={() => onNavigate(currentIndex + 1)}
                        disabled={currentIndex === questions.length - 1}
                         className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-slate-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    >
                        Next
                    </button>
                </div>

                {/* Review Button */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => setIsReviewOpen(true)}
                        className="bg-amber-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-amber-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/50 flex items-center gap-2"
                    >
                        {hasReview ? (
                            <>
                                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>Edit Review</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>Review Question</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {showAnswer && (
                <div className="mt-8 p-6 bg-slate-900/70 border border-slate-700 rounded-lg animate-fade-in text-center">
                    <h3 className="text-2xl font-bold">
                        {selectedAnswer === data.answer ? (
                             <span className="text-green-400">Correct!</span>
                        ) : (
                             <span className="text-red-400">Not Quite.</span>
                        )}
                    </h3>
                    <p className="text-lg mt-2">The correct answer is <span className="font-bold text-xl text-indigo-400">{data.answer}</span>.</p>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">{data.explanation}</p>
                </div>
            )}

            {/* Review Panel */}
            <ReviewPanel
                rating={data.rating}
                comment={data.comment}
                onSave={handleReviewSave}
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
            />
        </div>
    );
};

export default QuestionDisplay;
