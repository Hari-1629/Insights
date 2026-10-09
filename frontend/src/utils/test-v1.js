const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log('Client models keys:', Object.keys(client.models));

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }]
        });
        console.log('Response text:', response.text());
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Status:', e.status);
        }
    }
}

test();
