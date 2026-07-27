import { Pinecone } from "@pinecone-database/pinecone";
import { retry } from "./retry.js";

let pineconeIndex = null;

function getPineconeIndex() {
  if (!process.env.PINECONE_API_KEY) {
    console.warn("⚠️ PINECONE_API_KEY not found. Pinecone disabled.");
    return null;
  }

  if (!pineconeIndex) {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX || "feedback-index"
    );
  }

  return pineconeIndex;
}

/**
 * Store embedding in Pinecone (if enabled)
 */
export async function storeEmbedding(id, vector, metadata) {
  const index = getPineconeIndex();
  if (!index) return; // Pinecone disabled

  await retry(() => index.upsert([
    {
      id,
      values: vector,
      metadata,
    },
  ]));
}

/**
 * Search embedding in Pinecone (if enabled)
 */
export async function searchEmbedding(vector, topK = 5) {
  const index = getPineconeIndex();
  if (!index) return []; // Pinecone disabled

  const result = await retry(() => index.query({
    vector,
    topK,
    includeMetadata: true,
  }));

  return result.matches;
}
