import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyDmDWp3QbOmmqkQLHqu9z8vzdSysuvt34k";

console.log("🔍 Testing Gemini API Key...\n");

async function testAPI() {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Test 1: Simple generation with gemini-2.5-flash (more available)
    console.log("📝 Test 1: Testing gemini-2.5-flash...");
    try {
        const response1 = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Say 'Hello, API is working!' in exactly those words.",
        });
        console.log("✅ gemini-2.5-flash WORKS!");
        console.log("Response:", response1.text);
        console.log("");
    } catch (error) {
        console.log("❌ gemini-2.5-flash FAILED!");
        console.log("Error:", error.message);
        console.log("Status:", error.status);
        console.log("Full error:", JSON.stringify(error, null, 2));
        console.log("");
    }

    // Test 2: Try gemini-2.5-pro
    console.log("📝 Test 2: Testing gemini-2.5-pro...");
    try {
        const response2 = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: "Say 'Hello, Pro model is working!' in exactly those words.",
        });
        console.log("✅ gemini-2.5-pro WORKS!");
        console.log("Response:", response2.text);
        console.log("");
    } catch (error) {
        console.log("❌ gemini-2.5-pro FAILED!");
        console.log("Error:", error.message);
        console.log("Status:", error.status);
        console.log("Full error:", JSON.stringify(error, null, 2));
        console.log("");
    }

    // Test 3: Try with structured output (your actual use case)
    console.log("📝 Test 3: Testing gemini-2.5-pro with structured output...");
    try {
        const response3 = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: "Generate a simple question with answer A, B, or C",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        answer: { type: "string" }
                    }
                }
            }
        });
        console.log("✅ Structured output WORKS!");
        console.log("Response:", response3.text);
        console.log("");
    } catch (error) {
        console.log("❌ Structured output FAILED!");
        console.log("Error:", error.message);
        console.log("Status:", error.status);
        console.log("Full error:", JSON.stringify(error, null, 2));
        console.log("");
    }

    // Test 4: Check rate limits
    console.log("📝 Test 4: Testing rate limits (rapid requests)...");
    try {
        const promises = Array.from({ length: 5 }, (_, i) =>
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Request ${i + 1}`,
            })
        );
        const results = await Promise.all(promises);
        console.log("✅ Rapid requests WORK! All 5 requests succeeded.");
        console.log("");
    } catch (error) {
        console.log("❌ Rate limit hit or error!");
        console.log("Error:", error.message);
        console.log("Status:", error.status);
        console.log("");
    }

    console.log("✅ All tests completed!");
}

testAPI().catch(err => {
    console.error("Fatal error:", err);
});
