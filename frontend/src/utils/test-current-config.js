const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testCurrentModels() {
    console.log("🚀 Testing currently configured models...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Test Text Generation (Gemini Pro)
    try {
        console.log("\nTesting 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Return this JSON: {\"status\": \"ok\"}");
        const response = await result.response;
        console.log("✅ Text Generation Success:", response.text());
    } catch (error) {
        console.error("❌ 'gemini-pro' Failed:", error.message);
    }

    // Test Embedding (Embedding 001)
    try {
        console.log("\nTesting 'embedding-001'...");
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent("Hello world");
        console.log("✅ Embedding Success. Values length:", result.embedding.values.length);
    } catch (error) {
        console.error("❌ 'embedding-001' Failed:", error.message);
    }
}

testCurrentModels();
