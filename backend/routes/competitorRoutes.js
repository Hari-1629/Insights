import express from "express";
import { analyzeCompetitor } from "../controllers/competitorController.js";

const router = express.Router();

router.post("/analyze", analyzeCompetitor);

export default router;
