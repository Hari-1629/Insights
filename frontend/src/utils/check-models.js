const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There is no direct listModels on genAI instance in some versions, 
        // but let's try a simple generation with a known safe model 'gemini-pro'
        // Actually, newer SDKs might not expose listModels easily without full OAuth?
        // Let's just try to hit 'gemini-1.5-flash' and 'gemini-pro' and see which one errors.

        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

        for (const m of models) {
            console.log(`Testing model: ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ ${m} WORKS!`);
            } catch (error) {
                console.log(`❌ ${m} Failed: ${error.message}`);
            }
        }

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
