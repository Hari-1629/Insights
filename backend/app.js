import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import feedbackRoutes from "./routes/feedbackRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import competitorRoutes from "./routes/competitorRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import actionItemRoutes from "./routes/actionItemRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB (if configured)
if (process.env.MONGO_URI) {
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Initial Connect Error:", err.message));
} else {
  console.warn("⚠️  MONGO_URI not configured. Database operations will fail.");
}

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Gen-AI Backend Server is running" });
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Gen-AI API is running" });
});

app.use("/api/feedback", feedbackRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/competitor", competitorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/action-items", actionItemRoutes);

// Fallback 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint Not Found", path: req.originalUrl });
});

export default app;
