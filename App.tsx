import React, { useState, useCallback, useEffect, useRef } from 'react';
import { NVR_TOPICS } from './constants';
import type { NVRTopic, QuestionData } from './types';
import { generateNVRQuestion } from './services/geminiService';
import { loadQuestionsForTopic, saveQuestionsForTopic } from './utils/storage';
import Header from './components/Header';
import TopicSelector from './components/TopicSelector';
import DifficultySelector, { DIFFICULTIES } from './components/DifficultySelector';
import QuestionDisplay from './components/QuestionDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<NVRTopic>(NVR_TOPICS[0]);
    const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[1]); // Default to Medium
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<QuestionData[] | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [numToGenerate, setNumToGenerate] = useState<number>(1);
    const [savedQuestionCount, setSavedQuestionCount] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateSavedCount = useCallback((topic: string) => {
        const saved = loadQuestionsForTopic(topic);
        setSavedQuestionCount(saved.length);
    }, []);

    useEffect(() => {
        updateSavedCount(selectedTopic.name);
        setQuestions(null);
        setError(null);
    }, [selectedTopic, updateSavedCount]);

    const handleGenerateQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setQuestions(null);
        setCurrentQuestionIndex(0);

        try {
            const promises = Array.from({ length: numToGenerate }, () => generateNVRQuestion(selectedTopic.name, difficulty));
            const results = await Promise.all(promises);
            saveQuestionsForTopic(selectedTopic.name, results);
            setQuestions(results);
            updateSavedCount(selectedTopic.name);
        } catch (err) {
            console.error(err);
            setError(`Failed to generate questions. The model may be busy. Please try again. (${err.message})`);
        } finally {
            setIsLoading(false);
        }
    }, [selectedTopic, difficulty, numToGenerate, updateSavedCount]);
    
    const handleExportQuestions = useCallback(() => {
        const questionsToExport = loadQuestionsForTopic(selectedTopic.name);
        if (questionsToExport.length === 0) {
            setError("No questions saved for this topic to export.");
            return;
        }

        const dataStr = JSON.stringify(questionsToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `NVR_${selectedTopic.name.replace(/\s+/g, '_')}_Questions.json`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }, [selectedTopic.name]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleReviewUpdate = useCallback((index: number, rating: number | null, comment: string) => {
        if (!questions) return;

        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            rating,
            comment
        };

        setQuestions(updatedQuestions);
        saveQuestionsForTopic(selectedTopic.name, updatedQuestions);
    }, [questions, selectedTopic.name]);

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File is not readable.");
                }
                const importedQuestions: QuestionData[] = JSON.parse(text);

                // Basic validation
                if (!Array.isArray(importedQuestions) || importedQuestions.some(q => !q.question || !q.options)) {
                    throw new Error("Invalid question file format.");
                }

                // Add missing rating and comment fields for backward compatibility
                const normalizedQuestions = importedQuestions.map(q => ({
                    ...q,
                    rating: q.rating ?? null,
                    comment: q.comment ?? ""
                }));

                saveQuestionsForTopic(selectedTopic.name, normalizedQuestions);
                updateSavedCount(selectedTopic.name);
                setQuestions(normalizedQuestions);
                setCurrentQuestionIndex(0);
                setError(null);

            } catch (err) {
                console.error("Import error:", err);
                setError(`Failed to import questions. Make sure the file is a valid JSON export. (${err.message})`);
            }
        };
        reader.onerror = () => {
            setError("Error reading the selected file.");
        }
        reader.readAsText(file);

        // Reset file input to allow re-importing the same file
        event.target.value = '';
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <Header />

                <main className="mt-8 bg-slate-800/50 p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700">
                    <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-start">
                        <div className="flex-grow w-full md:w-1/3 flex flex-col gap-4">
                            <div>
                                <TopicSelector
                                    topics={NVR_TOPICS}
                                    selectedTopic={selectedTopic}
                                    onTopicChange={setSelectedTopic}
                                />
                                <p className="text-sm text-slate-400 mt-2">{selectedTopic.description}</p>
                            </div>
                            <DifficultySelector 
                                selectedDifficulty={difficulty}
                                onDifficultyChange={setDifficulty}
                            />
                        </div>
                        <div className="flex flex-col gap-4 flex-grow">
                             <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={numToGenerate}
                                    onChange={(e) => setNumToGenerate(parseInt(e.target.value, 10) || 1)}
                                    className="w-20 bg-slate-700 border border-slate-600 text-white rounded-lg p-3 text-center font-bold focus:ring-2 focus:ring-indigo-500"
                                    aria-label="Number of questions to generate"
                                />
                                <button
                                    onClick={handleGenerateQuestion}
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Spinner /> : '✨'}
                                    <span>{isLoading ? `Generating ${numToGenerate}...` : 'Generate'}</span>
                                </button>
                            </div>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <input type="file" ref={fileInputRef} onChange={handleFileImport} accept="application/json" className="hidden" />
                                <button
                                    onClick={handleImportClick}
                                    disabled={isLoading}
                                    className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500/50"
                                >
                                    Import Questions
                                </button>
                                <button
                                    onClick={handleExportQuestions}
                                    disabled={isLoading || savedQuestionCount === 0}
                                    className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-sky-500 disabled:bg-sky-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-sky-500/50"
                                >
                                    Export ({savedQuestionCount})
                                </button>
                             </div>
                        </div>
                    </div>

                    <div className="mt-8 min-h-[300px]">
                        {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                        {isLoading && !questions && (
                           <div className="flex flex-col items-center justify-center text-slate-400 h-[300px]">
                                <Spinner size="lg" />
                                <p className="mt-4 text-lg">Generating {numToGenerate} question{numToGenerate > 1 ? 's' : ''}...</p>
                                <p className="text-sm">This may take a moment.</p>
                           </div>
                        )}
                        {questions && questions.length > 0 && (
                            <QuestionDisplay
                                questions={questions}
                                currentIndex={currentQuestionIndex}
                                onNavigate={setCurrentQuestionIndex}
                                onReviewUpdate={handleReviewUpdate}
                            />
                        )}
                        {!isLoading && !questions && !error && (
                            <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full p-8 border-2 border-dashed border-slate-700 rounded-lg min-h-[300px]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                <h3 className="text-xl font-semibold">Ready to Start?</h3>
                                <p>Generate new questions or import a saved question file.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;