import { GoogleGenerativeAI } from "@google/generative-ai";
import { retry } from "./retry.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanAndParseJSON(text) {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

/* =========================
   1. Analyze Feedback
========================= */
export async function analyzeFeedback(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Analyze this feedback and return ONLY valid JSON:
{
  "summary": "",
  "sentiment": "Positive | Negative | Neutral",
  "category": "Bug Report | Feature Request | Praise | Other"
}

Feedback:
"${text}"
`;

  const result = await retry(() => model.generateContent(prompt));
  return cleanAndParseJSON(result.response.text());
}

/* =========================
   2. Text Embedding
========================= */
export async function embedText(text) {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004"
  });

  const embedding = await retry(() => model.embedContent(text));
  return embedding.embedding.values;
}

/* =========================
   3. Competitor Analysis
========================= */
export async function analyzeCompetitorFeedback(reviewsText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
You are an analyst.
Given the competitor reviews below, return ONLY valid JSON:

{
  "strengths": [],
  "weaknesses": []
}

Reviews:
${reviewsText}
`;

  const result = await retry(() => model.generateContent(prompt));
  return cleanAndParseJSON(result.response.text());
}

/* =========================
   4. Emerging Themes
========================= */
export async function detectEmergingThemes(recentFeedbacks) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Identify the TOP 3 emerging themes from the feedback below.
Return ONLY valid JSON:

{
  "themes": [
    { "theme": "", "score": 0.0, "summary": "" }
  ]
}

Feedback:
${recentFeedbacks.join("\n")}
`;

  const result = await retry(() => model.generateContent(prompt));
  return cleanAndParseJSON(result.response.text());
}

/* =========================
   5. Action Item Generator
========================= */
export async function generateActionItemFromFeedback(feedbackText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Convert this feedback into an engineering ticket.
Return ONLY valid JSON:

{
  "title": "",
  "description": "",
  "user_impact": ""
}

Feedback:
"${feedbackText}"
`;

  const result = await retry(() => model.generateContent(prompt));
  return cleanAndParseJSON(result.response.text());
}
