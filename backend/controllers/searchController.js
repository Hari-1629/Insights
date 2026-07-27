import Feedback from "../models/Feedback.js";
import { embedText } from "../services/geminiService.js";
import { searchEmbedding } from "../services/pineconeService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "query parameter is required" });
    }

    const queryEmbedding = await embedText(query);
    const matches = await searchEmbedding(queryEmbedding);

    const feedbacks = await Feedback.find({
      _id: { $in: matches.map(m => m.id) }
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Based ONLY on the following feedback:
${feedbacks.map(f => f.rawText).join("\n")}

Question: ${query}
Answer in bullet points.
`;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({ message: "Semantic search failed", error: error.message });
  }
};
