const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pc.index(process.env.PINECONE_INDEX_NAME);

exports.upsertVector = async (id, vector, metadata = {}) => {
    try {
        await index.upsert([
            {
                id: id,
                values: vector,
                metadata: metadata
            }
        ]);
    } catch (error) {
        console.error("Pinecone Upsert Error:", error);
        throw error;
    }
};

exports.queryVectors = async (vector, topK = 5) => {
    try {
        const queryResponse = await index.query({
            vector: vector,
            topK: topK,
            includeMetadata: true
        });
        return queryResponse.matches;
    } catch (error) {
        console.error("Pinecone Query Error:", error);
        throw error;
    }
};

exports.deleteVector = async (id) => {
    try {
        await index.deleteOne(id);
    } catch (error) {
        console.error("Pinecone Delete Error:", error);
        throw error;
    }
};
