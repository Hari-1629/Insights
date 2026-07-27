import Feedback from "../models/Feedback.js";
import { analyzeFeedback, embedText, generateActionItemFromFeedback } from "../services/geminiService.js";
import { storeEmbedding } from "../services/pineconeService.js";

export const getFeedbackList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "50", 10);
    let items = [];

    if (process.env.MONGO_URI) {
      try {
        const docs = await Feedback.find().sort({ createdAt: -1 }).limit(limit);
        items = docs.map(d => ({
          _id: d._id.toString(),
          text: d.rawText || d.summary || "",
          source: d.source || "User Feedback",
          sentiment: (d.sentiment || "neutral").toLowerCase(),
          theme: d.category || "General",
          createdAt: d.createdAt,
        }));
      } catch (dbErr) {
        console.warn("MongoDB fetch warning, using fallback list:", dbErr.message);
      }
    }

    if (items.length === 0) {
      items = [
        {
          _id: "fb-1",
          text: "The new search capabilities saved our team at least 4 hours of triage this week.",
          source: "App Store",
          sentiment: "positive",
          theme: "Search & Discovery",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: "fb-2",
          text: "Exporting data to CSV occasionally drops non-ASCII characters.",
          source: "Support ticket",
          sentiment: "negative",
          theme: "Export & Reporting",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          _id: "fb-3",
          text: "Would love a darker navy blue theme for night use.",
          source: "Twitter/X",
          sentiment: "neutral",
          theme: "UI & Aesthetics",
          createdAt: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          _id: "fb-4",
          text: "Mobile sync is fast and seamless across iOS and Android.",
          source: "Survey",
          sentiment: "positive",
          theme: "Mobile",
          createdAt: new Date(Date.now() - 28800000).toISOString(),
        },
        {
          _id: "fb-5",
          text: "Dashboard page load latency spiked during yesterday's traffic peak.",
          source: "Sales call",
          sentiment: "negative",
          theme: "Performance",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }

    res.json({ items });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

export const createSingleFeedback = async (req, res) => {
  try {
    const { text, source } = req.body || {};
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "text is required" });
    }

    let analysis = { sentiment: "neutral", category: "General", summary: text };
    try {
      analysis = await analyzeFeedback(text);
    } catch (err) {
      console.warn("AI analysis warning:", err.message);
    }

    let savedItem = {
      _id: Date.now().toString(),
      text,
      source: source || "User Product",
      sentiment: (analysis.sentiment || "neutral").toLowerCase(),
      theme: analysis.category || "General",
      createdAt: new Date().toISOString(),
    };

    if (process.env.MONGO_URI) {
      try {
        const created = await Feedback.create({
          rawText: text,
          summary: analysis.summary,
          sentiment: analysis.sentiment,
          category: analysis.category,
          source: source || "User Product",
        });
        savedItem = {
          _id: created._id.toString(),
          text: created.rawText,
          source: created.source,
          sentiment: (created.sentiment || "neutral").toLowerCase(),
          theme: created.category || "General",
          createdAt: created.createdAt,
        };

        try {
          const embedding = await embedText(text);
          await storeEmbedding(created._id.toString(), embedding, {
            sentiment: created.sentiment,
            category: created.category,
          });
        } catch (embErr) {
          console.warn("Embedding / Pinecone warning:", embErr.message);
        }
      } catch (dbErr) {
        console.warn("DB save warning:", dbErr.message);
      }
    }

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({ message: "Failed to create feedback", error: error.message });
  }
};

export const ingestFeedback = async (req, res) => {
  try {
    const { feedbackText } = req.body || {};
    if (!feedbackText || feedbackText.trim() === "") {
      return res.status(400).json({ message: "feedbackText is required" });
    }

    const reviews = feedbackText.split("\n").map(r => r.trim()).filter(Boolean);

    for (let review of reviews) {
      const analysis = await analyzeFeedback(review);
      let savedId = Date.now().toString();
      if (process.env.MONGO_URI) {
        const saved = await Feedback.create({ rawText: review, ...analysis });
        savedId = saved._id.toString();
      }

      try {
        const embedding = await embedText(review);
        await storeEmbedding(savedId, embedding, {
          sentiment: analysis.sentiment,
          category: analysis.category,
        });
      } catch (embErr) {
        console.warn("Embedding / Pinecone warning:", embErr.message);
      }
    }

    res.json({ message: "Feedback analyzed successfully" });
  } catch (error) {
    console.error("Ingest feedback error:", error);
    res.status(500).json({ message: "Failed to ingest feedback", error: error.message });
  }
};

export const createActionItem = async (req, res) => {
  try {
    const { id, text } = req.body;

    let feedbackText = text;
    if (id && process.env.MONGO_URI) {
      const fb = await Feedback.findById(id);
      if (fb) feedbackText = fb.rawText;
    }

    if (!feedbackText) return res.status(400).json({ message: "text or id required" });

    const ticket = await generateActionItemFromFeedback(feedbackText);
    res.json({ ticket });
  } catch (error) {
    console.error("Action item generation error:", error);
    res.status(500).json({ message: "Failed to generate action item" });
  }
};

export const ingestFeedbackStream = async (req, res) => {
  req.setTimeout(0);

  try {
    const { feedbackText } = req.body || {};
    if (!feedbackText || feedbackText.trim() === "") {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "feedbackText is required" }));
      return;
    }

    const reviews = feedbackText.split("\n").map(r => r.trim()).filter(Boolean);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    const send = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      send({ status: 'processing', index: i, rawText: review });

      try {
        const analysis = await analyzeFeedback(review);
        let savedId = Date.now().toString();
        if (process.env.MONGO_URI) {
          const saved = await Feedback.create({ rawText: review, ...analysis });
          savedId = saved._id.toString();
        }

        try {
          const embedding = await embedText(review);
          await storeEmbedding(savedId, embedding, {
            sentiment: analysis.sentiment,
            category: analysis.category,
          });
        } catch (embErr) {
          console.warn("Embedding warning:", embErr.message);
        }

        send({ status: 'done', index: i, id: savedId, analysis });
      } catch (itemErr) {
        console.error(`Error processing review ${i}:`, itemErr);
        send({ status: 'item-error', index: i, message: itemErr.message || String(itemErr) });
      }
    }

    send({ status: 'complete', count: reviews.length });
    res.end();
  } catch (err) {
    console.error('Stream ingest error:', err);
    res.write(`data: ${JSON.stringify({ status: 'error', message: err.message || String(err) })}\n\n`);
    res.end();
  }
};
