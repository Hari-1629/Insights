import express from "express";
import {
  getFeedbackList,
  createSingleFeedback,
  ingestFeedback,
  createActionItem,
  ingestFeedbackStream,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/", getFeedbackList);
router.post("/", createSingleFeedback);
router.post("/ingest", ingestFeedback);
router.post("/action-item", createActionItem);
router.post("/ingest-stream", ingestFeedbackStream);

export default router;
