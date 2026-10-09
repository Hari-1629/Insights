import express from "express";
import {
  getFeedbackList,
  getRecentFeedback,
  createSingleFeedback,
  ingestFeedback,
  searchFeedback,
  getThemes,
  getFeedbackStats,
  getTrendAnalysis,
  getCommonComplaints,
  generateActionItem,
  competitiveAnalysis,
  deleteFeedback,
  clearAllFeedback,
  analyzeProductRequest,
  bulkProductAnalysis,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/common-complaints", getCommonComplaints);
router.get("/trends", getTrendAnalysis);
router.get("/stats", getFeedbackStats);
router.get("/themes", getThemes);
router.get("/analyze-all", bulkProductAnalysis);
router.post("/analyze-product", analyzeProductRequest);
router.post("/ingest", ingestFeedback);
router.post("/search", searchFeedback);
router.post("/action-item", generateActionItem);
router.post("/competitive-analysis", competitiveAnalysis);
router.delete("/clear", clearAllFeedback);
router.get("/", getRecentFeedback);
router.post("/", createSingleFeedback);
router.delete("/:id", deleteFeedback);

export default router;
