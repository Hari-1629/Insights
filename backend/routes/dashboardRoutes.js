import express from "express";
import { getEmergingThemes, getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getDashboardStats);
router.get("/themes", getEmergingThemes);

export default router;
