require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to retry operations with exponential backoff on 429 errors
 */
const retryOperation = async (operation, maxRetries = 5, baseDelay = 5000) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            // Retry on rate limits (429) OR transient network failures ("fetch failed", "ECONNRESET", etc.)
            const isRetryable = error.status === 429 ||
                (error.error && error.error.code === 429) ||
                (error.message && (
                    error.message.includes('429') ||
                    error.message.toLowerCase().includes('fetch failed') ||
                    error.message.includes('ECONNRESET') ||
                    error.message.includes('ETIMEDOUT')
                ));

            if (isRetryable) {
                const delayTime = baseDelay * Math.pow(2, i);
                console.warn(`Transient error or Rate limit hit (${error.message}). Retrying in ${delayTime}ms... (${maxRetries - i - 1} retries left)`);
                await delay(delayTime);
            } else {
                throw error;
            }
        }
    }
    throw lastError;
};

/**
 * Generate plain text
 */
exports.generateText = async (prompt) => {
    try {
        const result = await retryOperation(() => genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        }));

        // Log the response structure for debugging
        console.log('Gemini API Response type:', typeof result);
        console.log('Gemini API Response keys:', result ? Object.keys(result) : 'null');

        // Handle different response structures
        let text = '';
        if (result && result.text) {
            text = result.text;
        } else if (result && result.response && result.response.text) {
            text = result.response.text;
        } else if (result && result.candidates && result.candidates[0]) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                text = candidate.content.parts[0].text || '';
            }
        } else if (typeof result === 'string') {
            text = result;
        } else {
            // Log the full response for debugging
            console.error('Unexpected response structure. Full response:', JSON.stringify(result, null, 2));
            throw new Error(`Unexpected response structure from Gemini API. Response type: ${typeof result}`);
        }

        if (!text || !text.trim()) {
            console.error('Empty text extracted from response');
            throw new Error('Empty response from Gemini API');
        }

        return text.trim();
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        console.error("Error details:", error.message);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        if (error.response) {
            console.error("API Response:", error.response);
        }
        // Provide more helpful error message
        if (error.message && error.message.includes('API key')) {
            throw new Error('Invalid or missing Gemini API key. Please check your environment variables.');
        }
        throw error;
    }
};

/**
 * Generate embeddings
 */
exports.generateEmbedding = async (text) => {
    try {
        const result = await retryOperation(() => genAI.models.embedContent({
            model: "gemini-embedding-001",
            contents: [{ parts: [{ text }] }]
        }));

        return result.embeddings[0].values;
    } catch (error) {
        console.error("Gemini Embedding Error:", error);
        throw error;
    }
};

/**
 * Generate strict JSON output
 */
exports.generateJSON = async (prompt) => {
    let rawText = "";
    try {
        const result = await retryOperation(() => genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                parts: [{
                    text: prompt + `
           
IMPORTANT: Output ONLY valid JSON.
- Escape all double quotes within strings.
- Do not include markdown code blocks.
- Do not include any text before or after the JSON.
` }]
            }],
            config: {
                responseMimeType: "application/json"
            }
        }));

        // Robust text extraction (same as generateText)
        if (result && result.text) {
            rawText = result.text;
        } else if (result && result.response && result.response.text) {
            rawText = result.response.text;
        } else if (result && result.candidates && result.candidates[0]) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                rawText = candidate.content.parts[0].text || '';
            }
        } else if (typeof result === 'string') {
            rawText = result;
        } else {
            console.error('Unexpected JSON response structure:', JSON.stringify(result, null, 2));
            throw new Error(`Unexpected JSON response structure from Gemini API`);
        }

        rawText = rawText.trim();

        // 1. Try to find the JSON object/array wrapper
        const firstOpenBrace = rawText.indexOf('{');
        const firstOpenBracket = rawText.indexOf('[');
        let startIndex = -1;
        let endIndex = -1;

        // Determine if it's an array or object starting first
        if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
            startIndex = firstOpenBrace;
            endIndex = rawText.lastIndexOf('}');
        } else if (firstOpenBracket !== -1) {
            startIndex = firstOpenBracket;
            endIndex = rawText.lastIndexOf(']');
        }

        let jsonText = rawText;
        if (startIndex !== -1 && endIndex !== -1) {
            jsonText = rawText.substring(startIndex, endIndex + 1);
        } else {
            // Fallback: cleaning markdown if no clear brackets found (unlikely for valid JSON)
            jsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini JSON Generation Error:", error);
        if (error instanceof SyntaxError) {
            console.error("Failed to parse JSON. Raw text was:", rawText);
        }
        throw error;
    }
};
