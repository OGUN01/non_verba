import { GoogleGenAI, Type } from "@google/genai";
import type { QuestionData } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: "The question prompt for the user. The wording should match the topic type (e.g., 'Which comes next?' for sequences, 'Which is the odd one out?' for odd one out questions)."
        },
        options: {
            type: Type.ARRAY,
            description: "An array of 5 potential answers.",
            items: {
                type: Type.OBJECT,
                properties: {
                    label: {
                        type: Type.STRING,
                        description: "The label for the option (e.g., 'A', 'B', 'C', 'D', 'E')."
                    },
                    svg: {
                        type: Type.STRING,
                        description: "A valid, self-contained SVG string with a 100x100 viewBox. Use basic shapes and black/white colors."
                    }
                },
                required: ["label", "svg"]
            }
        },
        answer: {
            type: Type.STRING,
            description: "The label of the correct option (e.g., 'C')."
        },
        explanation: {
            type: Type.STRING,
            description: "A concise but complete explanation of the logic behind the correct answer."
        }
    },
    required: ["question", "options", "answer", "explanation"]
};


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateNVRQuestion = async (topic: string, difficulty: string, maxRetries = 3): Promise<QuestionData> => {
    const prompt = `
        You are an expert in creating non-verbal reasoning questions for the 11 Plus exams.
        Your task is to generate a new and unique question based on the following criteria:
        - Topic: "${topic}"
        - Difficulty: "${difficulty}"

        **CRITICAL INSTRUCTIONS TO FOLLOW:**
        1.  **Adjust Complexity & Avoid Ambiguity:** The complexity of the logic and diagrams must match the difficulty.
            *   **Easy:** Use a single, obvious rule (e.g., number of sides, type of shape).
            *   **Medium:** Use a more subtle single rule or a combination of two simple rules (e.g., rotation and a shape change).
            *   **Hard:** Use a combination of two or more rules, or a complex logical relationship (e.g., the number of inner elements is the number of vertices of the outer shape minus one).
            *   **Crucially, complexity must come from clear, multi-step logic, NOT from adding random, unexplained, or ambiguous visual elements that make the question unfair.** Every part of the diagrams in the rule-following options must be consistent and logical.
        2.  **Visually Distinct Options:** All 5 options (A, B, C, D, E) MUST have visually distinct SVG diagrams. Do not generate identical SVGs for different options. This is the most important rule to prevent repetition.
        3.  **Topic-Specific Question Logic - FOLLOW EXACTLY FOR THE SELECTED TOPIC:**
            *   **"Odd One Out":** Create a set where four of the options share a clear, common rule, and only ONE option breaks that rule. Question format: "Which of the following is the odd one out?" or "Which figure does not belong?"
            *   **"Series and Sequences":** Create a sequence of 4 shapes that follow a clear pattern (e.g., progressive rotation, increasing elements, alternating features). The 5th option should be the CORRECT continuation or missing element. The other 4 options should be incorrect continuations. Question format: "What comes next in the sequence?" or "Which shape completes the sequence?" Make sure the first 4 options (A, B, C, D) form a clear sequence, and option E (and other distractors) are potential next elements.
            *   **"Analogies":** Show a transformation from shape A to shape B (e.g., rotation, adding elements, changing color/fill). Then show shape C. The correct answer applies the SAME transformation to C. Question format: "A is to B as C is to ?" or "Apply the same transformation from A→B to shape C."
            *   **"Reflections (Mirror Images)":** Show one shape and ask which is its correct mirror image (horizontal or vertical reflection). Four options should be incorrect reflections/rotations, one should be the correct mirror image. Question format: "Which is the mirror image of the shape?" or "Which shape is the reflection?"
            *   **"Rotations":** Show one shape and ask which option shows it rotated by a specific degree (90°, 180°, 270°). Question format: "Which figure shows the shape rotated 90° clockwise?" or "Identify the rotated figure."
            *   **"Codes and Grids":** Create a grid or coding system where shapes map to symbols/positions. Ask which shape corresponds to a given code. Question format: "Which shape matches code XYZ?" or "Using the grid, which shape is at position...?"
            *   **"3D Shape Relationships":** Show a net or unfolded shape, and ask which 3D shape it creates, or vice versa. Question format: "Which cube can be made from this net?" or "Which net folds into this 3D shape?"
            *   **"Spatial Reasoning":** Show shapes moving, flipping, swapping, or transforming through steps. Ask for the final result. Question format: "After these transformations, what is the result?" or "Track the movement - where does the shape end up?"
        4.  **Comprehensive Explanation:** The explanation must be crystal clear and account for all the elements and rules in the diagrams. If a question is 'Hard' because it combines two rules, the explanation must break down both rules and how they apply.

        The final JSON output must include:
        1. A clear question prompt for the user (e.g., "Which of the following is the odd one out?").
        2. A set of 5 options, labeled A, B, C, D, E.
        3. For each option, provide a valid, self-contained SVG diagram. The SVGs must be visually clear, simple, and enclosed in a 'viewBox="0 0 100 100"'. Use basic shapes like <rect>, <circle>, <line>, <path>, <polygon>. Use stroke="white" for outlines and fill="white" or fill="none" for shapes to ensure visibility on a dark background. Make the stroke-width at least 2 for clarity.
        4. The label of the correct answer (one of A, B, C, D, E).
        5. A concise but complete explanation of the logic behind the correct answer.

        Generate the response according to the provided JSON schema.
    `;

    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: questionSchema,
                    temperature: 0.9,
                },
            });
        
            const jsonText = response.text.trim();
            const parsedData = JSON.parse(jsonText);

            // Basic validation
            if (!parsedData.question || !parsedData.options || parsedData.options.length !== 5) {
                throw new Error("Invalid data structure received from API.");
            }

            // Initialize rating and comment fields
            parsedData.rating = null;
            parsedData.comment = "";

            return parsedData as QuestionData;

        } catch (error: any) {
            lastError = error;

            // Check if it's a 503 or 429 error (retryable)
            const isRetryable = error.status === 503 || error.status === 429;

            if (isRetryable && attempt < maxRetries - 1) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
                console.log(`Attempt ${attempt + 1} failed with status ${error.status}. Retrying in ${waitTime}ms...`);
                await sleep(waitTime);
                continue;
            }

            // If not retryable or last attempt, break the loop
            if (!isRetryable || attempt === maxRetries - 1) {
                break;
            }
        }
    }

    // All retries failed
    console.error("Error generating question with Gemini after retries:", lastError);

    // Provide more detailed error messages
    let errorMessage = "Failed to communicate with the AI model.";
    if (lastError.message) {
        errorMessage += ` Details: ${lastError.message}`;
    }
    if (lastError.status) {
        errorMessage += ` (Status: ${lastError.status})`;
    }

    throw new Error(errorMessage);
};