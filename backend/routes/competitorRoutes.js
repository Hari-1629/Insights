import express from "express";
import { analyzeCompetitor, getCompetitorOverview } from "../controllers/competitorController.js";

const router = express.Router();

router.get("/", getCompetitorOverview);
router.post("/analyze", analyzeCompetitor);

export default router;
