const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const fs = require('fs');

const logFile = 'model-error.log';
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

async function check() {
    fs.writeFileSync(logFile, "Starting Check...\n");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("Test");
        const response = await result.response;
        log("Success: " + response.text());
    } catch (e) {
        log("Error Name: " + e.name);
        log("Error Message: " + e.message);
        if (e.response) {
            log("Error Response: " + JSON.stringify(e.response));
        }
    }
}

check();
