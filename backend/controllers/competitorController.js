import { analyzeCompetitorFeedback } from "../services/geminiService.js";

/**
 * POST /api/competitor/analyze
 * Body: { reviews: "review1\nreview2\nreview3" }
 */
export const analyzeCompetitor = async (req, res) => {
  try {
    const { reviews } = req.body;

    if (!reviews || reviews.trim() === "") {
      return res.status(400).json({ message: "Competitor reviews are required" });
    }

    const analysis = await analyzeCompetitorFeedback(reviews);

    res.json({
      competitor_snapshot: analysis,
    });
  } catch (error) {
    console.error("Competitor analysis error:", error);
    res.status(500).json({ message: "Failed to analyze competitor feedback" });
  }
};
