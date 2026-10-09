import ActionItem from "../models/ActionItem.js";
import Feedback from "../models/Feedback.js";
import { generateJSON, generateText, generateEmbedding } from "../services/geminiService.js";
import { upsertVector } from "../services/pineconeService.js";
import promptTemplates from "../utils/promptTemplates.js";

// Create a new action item
export const createActionItem = async (req, res) => {
  try {
    const { title, description, customerFeedback, implementedFeature, userImpact, feedbackId, productName } = req.body;

    if (!title || !description || !customerFeedback || !implementedFeature) {
      return res.status(400).json({
        error: "Missing required fields: title, description, customerFeedback, implementedFeature",
      });
    }

    const newActionItem = new ActionItem({
      title,
      description,
      customerFeedback,
      implementedFeature,
      userImpact: userImpact || "Medium",
      productName: productName || "Not Specified",
      feedbackId: feedbackId || null,
    });

    await newActionItem.save();
    res.status(201).json(newActionItem);
  } catch (error) {
    console.error("Create Action Item Error:", error);
    res.status(500).json({ error: "Failed to create action item" });
  }
};

// Get all action items
export const getAllActionItems = async (req, res) => {
  try {
    let actionItems = [];
    if (process.env.MONGO_URI) {
      actionItems = await ActionItem.find()
        .sort({ createdAt: -1 })
        .populate("feedbackId", "text sentiment category");
    }
    res.json(actionItems);
  } catch (error) {
    console.error("Get Action Items Error:", error);
    res.status(500).json({ error: "Failed to fetch action items" });
  }
};

// Update action item status or team name
export const updateActionItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teamName } = req.body;

    const updateData = {};
    if (status) {
      if (!["Pending", "In Progress", "Completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      updateData.status = status;
    }

    if (teamName !== undefined) {
      updateData.teamName = teamName;
    }

    const updatedItem = await ActionItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: "Action item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Update Action Item Error:", error);
    res.status(500).json({ error: "Failed to update action item" });
  }
};

// Delete action item
export const deleteActionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await ActionItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Action item not found" });
    }
    res.json({ message: "Action item deleted successfully" });
  } catch (error) {
    console.error("Delete Action Item Error:", error);
    res.status(500).json({ error: "Failed to delete action item" });
  }
};

// Create action item directly from feedback submission form
export const createFromSubmission = async (req, res) => {
  try {
    const { feedbackType, description, implementedFeature, productName: manualProductName } = req.body;

    if (!feedbackType || !description || !implementedFeature) {
      return res.status(400).json({
        error: "Missing required fields: feedbackType, description, implementedFeature",
      });
    }

    const prompt = `
Analyze the following customer feedback submission and generate a structured action item.

Feedback Type: ${feedbackType}
Description: "${description}"

Task:
1. Extract a concise, professional "Title" for the action item.
2. Extract/Infer the "Product Name" or feature mentioned directly from the text. If none, output "Not Specified".
3. Determine "Sentiment" (Positive, Neutral, Negative).
4. Refine the "Description" to be technical and actionable.
5. Determine "User Impact" (High/Medium/Low).

Respond ONLY with this JSON structure:
{
  "title": "Concise Technical Title",
  "productName": "Extracted Product Name",
  "sentiment": "Positive/Neutral/Negative",
  "description": "Refined actionable description...",
  "user_impact": "High/Medium/Low"
}`;

    let aiResponse = {
      title: `${feedbackType}: ${description.substring(0, 40)}`,
      productName: manualProductName || "Not Specified",
      sentiment: "Neutral",
      description: description,
      user_impact: "Medium",
    };

    try {
      const generated = await generateJSON(prompt);
      if (generated && generated.title) {
        aiResponse = generated;
      }
    } catch (aiErr) {
      console.warn("AI generation failed for submission:", aiErr.message);
    }

    let productName = manualProductName?.trim() || aiResponse.productName || "Not Specified";
    let sentiment = aiResponse.sentiment || "Neutral";
    sentiment = sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();

    // 1. Create Feedback Entry
    const newFeedback = new Feedback({
      text: description,
      rawText: description,
      summary: aiResponse.title,
      productName,
      sentiment,
      category: feedbackType,
    });
    await newFeedback.save();

    // 2. Generate Embedding & Save to Pinecone
    try {
      const embedding = await generateEmbedding(description);
      await upsertVector(newFeedback._id.toString(), embedding, {
        text: description,
        category: feedbackType,
        sentiment: sentiment,
        productName: productName,
      });
    } catch (pineconeErr) {
      console.warn("Pinecone upsert warning:", pineconeErr.message);
    }

    // 3. Create Action Item
    const newActionItem = new ActionItem({
      title: aiResponse.title,
      description: aiResponse.description,
      customerFeedback: description,
      implementedFeature,
      userImpact: aiResponse.user_impact || "Medium",
      productName,
      status: "Pending",
      feedbackId: newFeedback._id,
    });
    await newActionItem.save();

    newFeedback.actionItem = {
      title: newActionItem.title,
      description: newActionItem.description,
      user_impact: newActionItem.userImpact,
      status: newActionItem.status,
    };
    await newFeedback.save();

    res.status(201).json(newActionItem);
  } catch (error) {
    console.error("Create From Submission Error:", error);
    res.status(500).json({ error: "Failed to create action item from submission" });
  }
};

// Generate AI implementation plan
export const generateImplementationPlan = async (req, res) => {
  try {
    const { feedbackType, description } = req.body;
    if (!feedbackType || !description || !description.trim()) {
      return res.status(400).json({
        error: "Missing required fields: feedbackType and description",
      });
    }

    const prompt = promptTemplates.implementationPlan
      .replace("{feedbackType}", feedbackType)
      .replace("{description}", description);

    const implementationPlan = await generateText(prompt);
    res.json({ implementationPlan: implementationPlan || "Plan generated successfully." });
  } catch (error) {
    console.error("Generate Implementation Plan Error:", error);
    res.status(500).json({
      error: "Failed to generate implementation plan",
      details: error.message,
    });
  }
};
