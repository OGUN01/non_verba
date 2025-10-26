export interface NVRTopic {
    name: string;
    description: string;
}

export interface QuestionOption {
    label: string;
    svg: string;
}

export interface QuestionData {
    question: string;
    options: QuestionOption[];
    answer: string;
    explanation: string;
    rating: number | null;
    comment: string;
}

export type SavedQuestions = Record<string, QuestionData[]>;
