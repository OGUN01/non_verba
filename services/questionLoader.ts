import type { QuestionData } from '../types';

// Mapping of topic names to folder names in /questions
const TOPIC_FOLDER_MAP: Record<string, string> = {
    "Odd One Out": "odd_one_out",
    "Series and Sequences": "series_and_sequences",
    "Analogies": "anologies",
    "Reflections (Mirror Images)": "reflections",
    "Rotations": "rotations",
    "Codes and Grids": "codes_and_grids",
    "3D Shape Relationships": "3d_shape_relationship",
    "Spatial Reasoning": "spatial_reasoining"
};

// Mapping of difficulty levels to file name suffixes
const DIFFICULTY_FILE_MAP: Record<string, string> = {
    "Easy": "easy",
    "Medium": "medium",
    "Hard": "hard"
};

/**
 * Load questions from JSON files in the /questions folder
 * @param topic - The topic name (e.g., "Analogies")
 * @param difficulty - The difficulty level (e.g., "Easy", "Medium", "Hard")
 * @returns Promise resolving to array of QuestionData
 */
export const loadQuestionsFromJSON = async (topic: string, difficulty: string): Promise<QuestionData[]> => {
    try {
        // Get folder name and difficulty suffix
        const folderName = TOPIC_FOLDER_MAP[topic];
        const difficultySuffix = DIFFICULTY_FILE_MAP[difficulty];

        if (!folderName) {
            throw new Error(`Unknown topic: ${topic}`);
        }

        if (!difficultySuffix) {
            throw new Error(`Unknown difficulty: ${difficulty}`);
        }

        // Construct the file path
        // Format: questions/{folder}/NVR_{Topic}_Questions_{difficulty}.json
        const topicFileName = topic.replace(/\s+/g, '_').replace(/[()]/g, '');
        const fileName = `NVR_${topicFileName}_Questions_${difficultySuffix}.json`;
        const filePath = `/questions/${folderName}/${fileName}`;

        // Dynamically import the JSON file
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load questions: ${response.statusText}`);
        }

        const questions: QuestionData[] = await response.json();

        // Ensure all questions have rating and comment fields
        return questions.map(q => ({
            ...q,
            rating: q.rating ?? null,
            comment: q.comment ?? ""
        }));

    } catch (error) {
        console.error('Error loading questions from JSON:', error);
        throw error;
    }
};

/**
 * Get the number of available questions for a topic/difficulty
 */
export const getQuestionCount = async (topic: string, difficulty: string): Promise<number> => {
    try {
        const questions = await loadQuestionsFromJSON(topic, difficulty);
        return questions.length;
    } catch (error) {
        console.error('Error getting question count:', error);
        return 0;
    }
};
