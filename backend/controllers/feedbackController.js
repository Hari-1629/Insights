import Feedback from "../models/Feedback.js";
import { analyzeFeedback, embedText } from "../services/geminiService.js";
import { storeEmbedding } from "../services/pineconeService.js";
import { generateActionItemFromFeedback } from "../services/geminiService.js";

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
    if (id) {
      const fb = await Feedback.findById(id);
      if (!fb) return res.status(404).json({ message: "Feedback not found" });
      feedbackText = fb.rawText;
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
  // Expect body: { feedbackText: string }
  req.setTimeout(0); // disable timeout for long-running stream

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

    // helper to send an SSE message
    const send = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      send({ status: 'processing', index: i, rawText: review });

      try {
        const analysis = await analyzeFeedback(review);
        const saved = await Feedback.create({ rawText: review, ...analysis });

        const embedding = await embedText(review);
        await storeEmbedding(saved._id.toString(), embedding, {
          sentiment: analysis.sentiment,
          category: analysis.category,
        });

        send({ status: 'done', index: i, id: saved._id.toString(), analysis });
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
