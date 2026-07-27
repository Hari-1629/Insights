import express from "express";
import { getEmergingThemes } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/themes", getEmergingThemes);

export default router;
