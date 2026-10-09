require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require('@pinecone-database/pinecone');

async function verify() {
    console.log("🔍 Verifying Environment Variables...");
    if (!process.env.GEMINI_API_KEY) console.error("❌ Missing GEMINI_API_KEY");
    else console.log("✅ GEMINI_API_KEY found");

    if (!process.env.PINECONE_API_KEY) console.error("❌ Missing PINECONE_API_KEY");
    else console.log("✅ PINECONE_API_KEY found");

    if (!process.env.PINECONE_INDEX_NAME) console.error("❌ Missing PINECONE_INDEX_NAME");
    else console.log(`✅ PINECONE_INDEX_NAME found: ${process.env.PINECONE_INDEX_NAME}`);

    console.log("\n🤖 Verifying Gemini...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'Hello' if you can hear me.");
        const response = await result.response;
        console.log("✅ Gemini Response:", response.text().trim());
    } catch (err) {
        console.error("❌ Gemini Error:", err.message);
    }

    console.log("\n🌲 Verifying Pinecone...");
    try {
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const indexName = process.env.PINECONE_INDEX_NAME;

        // List indexes
        const indexes = await pc.listIndexes();
        console.log("✅ Available Indexes:", indexes.indexes.map(i => i.name));

        const indexExists = indexes.indexes.find(i => i.name === indexName);
        if (!indexExists) {
            console.error(`❌ Index '${indexName}' NOT FOUND in your Pinecone project.`);
            console.log("   --> Please create it in Pinecone console (Dimension: 768, Metric: cosine)");
        } else {
            console.log(`✅ Index '${indexName}' exists.`);

            // Upsert dummy vector
            const index = pc.index(indexName);
            // Gemini embedding-004 is 768 dimensions. Create dummy vector.
            const dummyVector = new Array(768).fill(0.1);

            try {
                await index.upsert([{
                    id: "test-probe",
                    values: dummyVector,
                    metadata: { text: "test probe" }
                }]);
                console.log("✅ Successfully upserted test vector.");
            } catch (upsertErr) {
                console.error("❌ Pinecone Upsert Error:", upsertErr.message);
                if (upsertErr.message.includes("dimension")) {
                    console.log("   --> HINT: Check if your Pinecone index dimension matches Gemini (768).");
                }
            }
        }
    } catch (err) {
        console.error("❌ Pinecone Error:", err.message);
    }
}

verify();
