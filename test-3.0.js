import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyDmDWp3QbOmmqkQLHqu9z8vzdSysuvt34k";

console.log("🔍 Testing if Gemini 3.0 exists in the API...\n");

async function test3Point0() {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Test 1: Try gemini-3.0-pro
    console.log("📝 Test 1: Trying 'gemini-3.0-pro'...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.0-pro",
            contents: "Say 'Hello from 3.0'",
        });
        console.log("✅ gemini-3.0-pro EXISTS and WORKS!");
        console.log("Response:", response.text);
    } catch (error) {
        console.log("❌ gemini-3.0-pro DOES NOT EXIST");
        console.log("Error:", error.message);
        console.log("Status:", error.status);
    }

    console.log("\n");

    // Test 2: Try gemini-3.0-flash
    console.log("📝 Test 2: Trying 'gemini-3.0-flash'...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.0-flash",
            contents: "Say 'Hello from 3.0 Flash'",
        });
        console.log("✅ gemini-3.0-flash EXISTS and WORKS!");
        console.log("Response:", response.text);
    } catch (error) {
        console.log("❌ gemini-3.0-flash DOES NOT EXIST");
        console.log("Error:", error.message);
    }

    console.log("\n✅ Test completed!");
}

test3Point0().catch(err => {
    console.error("Fatal error:", err);
});
