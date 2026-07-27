import express from "express";
import { ingestFeedback, createActionItem, ingestFeedbackStream } from "../controllers/feedbackController.js";

const router = express.Router();
router.post("/ingest", ingestFeedback);
router.post("/action-item", createActionItem);
router.post("/ingest-stream", ingestFeedbackStream);
export default router;
