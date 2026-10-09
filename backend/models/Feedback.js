import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
  },
  rawText: {
    type: String,
    required: false,
  },
  summary: {
    type: String,
  },
  productName: {
    type: String,
    default: "Not Specified",
  },
  sentiment: {
    type: String,
    default: "Neutral",
  },
  category: {
    type: String,
    default: "Other",
  },
  source: {
    type: String,
    default: "User Product",
  },
  embeddingId: {
    type: String,
    required: false,
  },
  actionItem: {
    title: String,
    description: String,
    user_impact: {
      type: String,
      default: "Medium",
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to ensure text and rawText are synchronized
feedbackSchema.pre("save", function (next) {
  if (!this.text && this.rawText) {
    this.text = this.rawText;
  } else if (!this.rawText && this.text) {
    this.rawText = this.text;
  }
  next();
});

export default mongoose.model("Feedback", feedbackSchema);
