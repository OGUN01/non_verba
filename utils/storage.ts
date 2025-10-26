import type { QuestionData, SavedQuestions } from '../types';

const STORAGE_KEY = 'nvr-questions-repo';

// Function to get all saved questions from localStorage
const getAllSavedQuestions = (): SavedQuestions => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
        console.error("Failed to parse saved questions from localStorage:", error);
        return {};
    }
};

// Function to get saved questions for a specific topic
export const loadQuestionsForTopic = (topic: string): QuestionData[] => {
    const allQuestions = getAllSavedQuestions();
    const questions = allQuestions[topic] || [];

    // Ensure backward compatibility - add missing rating and comment fields
    return questions.map(q => ({
        ...q,
        rating: q.rating ?? null,
        comment: q.comment ?? ""
    }));
};

// Function to save new questions for a specific topic, replacing existing ones
export const saveQuestionsForTopic = (topic: string, newQuestions: QuestionData[]): void => {
    if (newQuestions.length === 0) return;

    const allQuestions = getAllSavedQuestions();

    // Replace existing questions with new ones
    allQuestions[topic] = newQuestions;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allQuestions));
    } catch (error) {
        console.error("Failed to save questions to localStorage:", error);
    }
};
