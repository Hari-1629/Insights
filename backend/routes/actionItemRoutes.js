import express from "express";
import {
  createActionItem,
  getAllActionItems,
  updateActionItemStatus,
  deleteActionItem,
  createFromSubmission,
  generateImplementationPlan,
} from "../controllers/actionItemController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Action items router is working!" });
});

router.post("/generate-implementation-plan", generateImplementationPlan);
router.post("/from-submission", createFromSubmission);
router.post("/", createActionItem);
router.get("/", getAllActionItems);
router.patch("/:id", updateActionItemStatus);
router.delete("/:id", deleteActionItem);

export default router;
