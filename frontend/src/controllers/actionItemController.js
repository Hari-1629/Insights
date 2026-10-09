const ActionItem = require('../models/ActionItem');
const Feedback = require('../models/Feedback');
const pineconeService = require('../services/pineconeService');

// Create a new action item
exports.createActionItem = async (req, res) => {
    try {
        const { title, description, customerFeedback, implementedFeature, userImpact, feedbackId } = req.body;

        // Validate required fields
        if (!title || !description || !customerFeedback || !implementedFeature) {
            return res.status(400).json({
                error: "Missing required fields: title, description, customerFeedback, implementedFeature"
            });
        }

        const newActionItem = new ActionItem({
            title,
            description,
            customerFeedback,
            implementedFeature,
            userImpact: userImpact || 'Medium',
            feedbackId: feedbackId || null
        });

        await newActionItem.save();
        res.status(201).json(newActionItem);
    } catch (error) {
        console.error("Create Action Item Error:", error);
        res.status(500).json({ error: "Failed to create action item" });
    }
};

// Get all action items
exports.getAllActionItems = async (req, res) => {
    // ... (rest of the file remains unchanged until createFromSubmission)
    try {
        const actionItems = await ActionItem.find()
            .sort({ createdAt: -1 })
            .populate('feedbackId', 'text sentiment category');

        res.json(actionItems);
    } catch (error) {
        console.error("Get Action Items Error:", error);
        res.status(500).json({ error: "Failed to fetch action items" });
    }
};

// Update action item status or team name
exports.updateActionItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, teamName } = req.body;

        const updateData = {};
        
        if (status) {
            if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
                return res.status(400).json({ error: "Invalid status value" });
            }
            updateData.status = status;
        }

        if (teamName !== undefined) {
            updateData.teamName = teamName;
        }

        const updatedItem = await ActionItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

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
exports.deleteActionItem = async (req, res) => {
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
exports.createFromSubmission = async (req, res) => {
    try {
        const { feedbackType, description, implementedFeature, productName: manualProductName } = req.body;

        // Validate required fields
        if (!feedbackType || !description || !implementedFeature) {
            return res.status(400).json({
                error: "Missing required fields: feedbackType, description, implementedFeature"
            });
        }

        // Use Gemini to generate structured action item
        const geminiService = require('../services/geminiService');

        // Dynamic prompt to extract fields including SENTIMENT
        const prompt = `
        Analyze the following customer feedback submission and generate a structured action item.
        
        Feedback Type: ${feedbackType}
        Description: "${description}"

        Task:
        1. Extract a concise, professional "Title" for the action item.
        2. Extract/Infer the "Product Name" or feature mentioned directly from the text (e.g., "Headphones X100", "Mobile App"). If no specific product or feature is mentioned, use "Not Specified". DO NOT use "General".
        3. Determine the "Sentiment" of the feedback (Positive, Neutral, Negative).
        4. Refine the "Description" to be technical and actionable.
        5. Determins "User Impact" (High/Medium/Low).

        Respond ONLY with this JSON structure:
        {
          "title": "Concise Technical Title",
          "productName": "Extracted Product Name",
          "sentiment": "Positive/Neutral/Negative",
          "description": "Refined actionable description...",
          "user_impact": "High/Medium/Low"
        }`;

        const aiResponse = await geminiService.generateJSON(prompt);
        
        let productName = 'Not Specified';
        if (manualProductName && manualProductName.trim() !== '') {
            productName = manualProductName;
        } else if (aiResponse.productName && aiResponse.productName !== 'General') {
            productName = aiResponse.productName;
        }
        let sentiment = aiResponse.sentiment || 'Neutral';
        sentiment = sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
        if (!['Positive', 'Neutral', 'Negative'].includes(sentiment)) sentiment = 'Neutral';

        // 1. Create Feedback Entry (for Dashboard Metrics & Graphs)
        const newFeedback = new Feedback({
            text: description,
            summary: aiResponse.title, // Use title as summary
            productName: productName,
            sentiment: sentiment,
            category: feedbackType,
            actionItem: null // We will link it backwards or just leave separate
        });

        await newFeedback.save();

        // 2. Generate Embedding & Save to Pinecone (Background process, don't block response too long if possible, but here we await)
        try {
            const embedding = await geminiService.generateEmbedding(description);
            await pineconeService.upsertVector(newFeedback._id.toString(), embedding, {
                text: description,
                category: feedbackType,
                sentiment: sentiment,
                productName: productName
            });
        } catch (pineconeErr) {
            console.error("Pinecone upsert failed for submission:", pineconeErr.message);
            // Continue execution, don't fail the user request
        }

        // 3. Create Action Item
        const newActionItem = new ActionItem({
            title: aiResponse.title,
            description: aiResponse.description,
            customerFeedback: description,
            implementedFeature: implementedFeature,
            userImpact: aiResponse.user_impact,
            productName: productName,
            status: 'Pending',
            feedbackId: newFeedback._id // Link to the feedback we just created
        });

        // 4. Update Feedback to link to Action Item (Optional, but good for "Actionable Items" metric)
        newFeedback.actionItem = {
            title: newActionItem.title,
            status: newActionItem.status
        };
        await newFeedback.save();

        await newActionItem.save();
        res.status(201).json(newActionItem);
    } catch (error) {
        console.error("Create From Submission Error:", error);
        res.status(500).json({ error: "Failed to create action item from submission" });
    }
};

// Generate AI implementation plan
exports.generateImplementationPlan = async (req, res) => {
    console.log('✅ generateImplementationPlan controller called!');
    try {
        const { feedbackType, description } = req.body;
        console.log('Received:', { feedbackType, description: description?.substring(0, 50) });

        if (!feedbackType || !description || !description.trim()) {
            return res.status(400).json({
                error: "Missing required fields: feedbackType and description"
            });
        }

        const geminiService = require('../services/geminiService');
        const promptTemplates = require('../utils/promptTemplates');

        const prompt = promptTemplates.implementationPlan
            .replace('{feedbackType}', feedbackType)
            .replace('{description}', description);

        console.log('Generating implementation plan for:', feedbackType);
        const implementationPlan = await geminiService.generateText(prompt);

        if (!implementationPlan || !implementationPlan.trim()) {
            console.error('Empty implementation plan received');
            return res.status(500).json({
                error: "Generated implementation plan is empty. Please try again."
            });
        }

        res.json({ implementationPlan });
    } catch (error) {
        console.error("Generate Implementation Plan Error:", error);
        console.error("Error details:", error.message, error.stack);
        res.status(500).json({
            error: "Failed to generate implementation plan",
            details: error.message
        });
    }
};