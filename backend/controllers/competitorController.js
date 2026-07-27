import { analyzeCompetitorFeedback } from "../services/geminiService.js";

export const getCompetitorOverview = async (req, res) => {
  try {
    const items = [
      {
        name: "Acme Analytics",
        mentions: 340,
        sentimentScore: 0.72,
        strengths: ["Fast report generation", "Robust API integrations"],
        weaknesses: ["Complex pricing structure", "Slow support response"],
      },
      {
        name: "PulseData",
        mentions: 215,
        sentimentScore: 0.48,
        strengths: ["Clean visual charts", "Mobile notifications"],
        weaknesses: ["Frequent UI crashes", "Lack of historical data depth"],
      },
      {
        name: "InsightSync",
        mentions: 180,
        sentimentScore: 0.65,
        strengths: ["Great team collaboration tools", "Custom alert triggers"],
        weaknesses: ["High seat license costs", "Steep learning curve"],
      },
    ];

    res.json({ items });
  } catch (error) {
    console.error("Get competitor overview error:", error);
    res.status(500).json({ message: "Failed to fetch competitor overview" });
  }
};

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
