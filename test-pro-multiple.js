import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyDmDWp3QbOmmqkQLHqu9z8vzdSysuvt34k";

console.log("🔍 Testing gemini-2.5-pro multiple times...\n");

async function testProMultipleTimes() {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    for (let i = 1; i <= 10; i++) {
        console.log(`Attempt ${i}/10 with gemini-2.5-pro...`);
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: "Say 'Test " + i + " successful'",
            });
            console.log(`✅ SUCCESS: ${response.text}`);
        } catch (error) {
            console.log(`❌ FAILED: Status ${error.status} - ${error.message}`);
        }

        // Wait 2 seconds between attempts
        if (i < 10) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log("\n✅ Test completed!");
}

testProMultipleTimes().catch(err => {
    console.error("Fatal error:", err);
});
