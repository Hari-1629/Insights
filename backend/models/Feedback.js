import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  rawText: String,
  summary: String,
  sentiment: String,
  category: String,
  source: { type: String, default: "User Product" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", feedbackSchema);
