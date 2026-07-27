import Feedback from "../models/Feedback.js";
import { detectEmergingThemes } from "../services/geminiService.js";

export const getEmergingThemes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "50", 10);
    const recent = await Feedback.find().sort({ createdAt: -1 }).limit(limit);

    const texts = recent.map(r => r.rawText);
    if (texts.length === 0) return res.json({ themes: [] });

    const analysis = await detectEmergingThemes(texts);
    // Expecting { themes: [...] }
    res.json(analysis);
  } catch (error) {
    console.error("Themes detection error:", error);
    res.status(500).json({ message: "Failed to detect themes" });
  }
};

export default { getEmergingThemes };
