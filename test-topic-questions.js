import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = "AIzaSyDmDWp3QbOmmqkQLHqu9z8vzdSysuvt34k";

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

const topics = [
    { name: 'Odd One Out', expectedKeywords: ['odd', 'one', 'out', 'belong', 'different'] },
    { name: 'Series and Sequences', expectedKeywords: ['next', 'sequence', 'continue', 'completes', 'following', 'pattern'] },
    { name: 'Analogies', expectedKeywords: ['is to', 'as', 'transformation', 'apply'] },
    { name: 'Reflections (Mirror Images)', expectedKeywords: ['mirror', 'reflection', 'reflected'] },
    { name: 'Rotations', expectedKeywords: ['rotate', 'rotated', 'degree', 'clockwise', 'anticlockwise'] },
    { name: 'Codes and Grids', expectedKeywords: ['code', 'grid', 'position', 'matches'] },
    { name: '3D Shape Relationships', expectedKeywords: ['3d', 'net', 'cube', 'fold', 'unfold', '3-d'] },
    { name: 'Spatial Reasoning', expectedKeywords: ['movement', 'move', 'transform', 'flip', 'swap', 'track', 'end up'] }
];

console.log("🧪 Testing Question Generation for All Topics...\n");
console.log("=".repeat(60) + "\n");

async function generateQuestion(topic, difficulty) {
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
        return parsedData;
    } catch (error) {
        throw new Error(`Failed to generate question: ${error.message}`);
    }
}

function checkQuestionType(question, expectedKeywords) {
    const questionLower = question.toLowerCase();
    const foundKeywords = expectedKeywords.filter(keyword => questionLower.includes(keyword));
    return {
        matches: foundKeywords.length > 0,
        foundKeywords: foundKeywords,
        question: question
    };
}

async function testAllTopics() {
    const results = [];

    for (const topic of topics) {
        console.log(`📝 Testing: ${topic.name}`);
        console.log("-".repeat(60));

        try {
            const questionData = await generateQuestion(topic.name, "Medium");
            const check = checkQuestionType(questionData.question, topic.expectedKeywords);

            if (check.matches) {
                console.log(`✅ PASS - Question type matches topic`);
                console.log(`   Question: "${check.question}"`);
                console.log(`   Found keywords: ${check.foundKeywords.join(', ')}`);
            } else {
                console.log(`❌ FAIL - Question type does NOT match topic`);
                console.log(`   Question: "${check.question}"`);
                console.log(`   Expected keywords: ${topic.expectedKeywords.join(', ')}`);
                console.log(`   Found keywords: NONE`);
            }

            results.push({
                topic: topic.name,
                success: check.matches,
                question: check.question,
                foundKeywords: check.foundKeywords
            });

        } catch (error) {
            console.log(`❌ ERROR - Failed to generate question`);
            console.log(`   Error: ${error.message}`);
            results.push({
                topic: topic.name,
                success: false,
                error: error.message
            });
        }

        console.log("\n");

        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("=".repeat(60));
    console.log("\n📊 Test Summary:\n");

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`✅ Passed: ${passed}/${topics.length}`);
    console.log(`❌ Failed: ${failed}/${topics.length}`);

    if (failed > 0) {
        console.log("\n❌ Failed Topics:");
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.topic}`);
            if (r.question) {
                console.log(`     Question: "${r.question}"`);
            }
            if (r.error) {
                console.log(`     Error: ${r.error}`);
            }
        });
    }

    console.log("\n" + "=".repeat(60));

    if (passed === topics.length) {
        console.log("\n🎉 All tests passed! Each topic generates the correct question type.");
    } else {
        console.log("\n⚠️  Some topics failed. Review the results above.");
    }
}

testAllTopics().catch(err => {
    console.error("Fatal error:", err);
});
