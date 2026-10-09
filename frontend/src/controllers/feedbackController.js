const Feedback = require('../models/Feedback');
const geminiService = require('../services/geminiService');
const pineconeService = require('../services/pineconeService');
const promptTemplates = require('../utils/promptTemplates');

exports.ingestFeedback = async (req, res) => {
    try {
        const { feedbacks } = req.body; // Array of strings
        if (!feedbacks || !Array.isArray(feedbacks)) {
            return res.status(400).json({ error: "Invalid input. Expected 'feedbacks' array." });
        }

        const processedResults = [];
        const failedResults = [];
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Process sequential items
        for (let i = 0; i < feedbacks.length; i++) {
            const item = feedbacks[i];
            const originalText = typeof item === 'object' ? item.text : item;
            const manualProductName = typeof item === 'object' ? item.productName : null;

            try {
                // 0. Split feedback into individual points if it contains multiple sentiments/issues
                console.log(`Splitting feedback item ${i + 1}...`);
                const splitPrompt = promptTemplates.feedbackSplitter.replace('{feedbackText}', originalText);
                const individualPoints = await geminiService.generateJSON(splitPrompt);

                // If it's not an array, wrap it
                const pointsToProcess = Array.isArray(individualPoints) ? individualPoints : [originalText];
                console.log(`Split into ${pointsToProcess.length} points.`);

                for (let j = 0; j < pointsToProcess.length; j++) {
                    const text = pointsToProcess[j];

                    // Add a small initial delay to avoid immediate burst limits, and 15s for subsequent items.
                    const waitTime = (i === 0 && j === 0) ? 2000 : 15000;
                    console.log(`Waiting ${waitTime / 1000}s to respect rate limits... (Item ${i + 1}/${feedbacks.length}, Point ${j + 1}/${pointsToProcess.length})`);
                    await delay(waitTime);

                    // 1. Analyze with Gemini (Combined Analysis: Summary, Sentiment, Category, Action, Product)
                    const analysisPrompt = promptTemplates.fullAnalysis.replace('{feedbackText}', text);
                    const analysis = await geminiService.generateJSON(analysisPrompt);

                    let normalizedSentiment = analysis.sentiment || 'Neutral';
                    normalizedSentiment = normalizedSentiment.charAt(0).toUpperCase() + normalizedSentiment.slice(1).toLowerCase();
                    if (!['Positive', 'Neutral', 'Negative'].includes(normalizedSentiment)) normalizedSentiment = 'Neutral';

                    const validCategories = ['Bug Report', 'Feature Request', 'Praise', 'Other'];
                    let normalizedCategory = analysis.category || 'Other';
                    // Proper title case for categories to match Enum
                    normalizedCategory = normalizedCategory.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                    if (!validCategories.includes(normalizedCategory)) normalizedCategory = 'Other';

                    let finalProductName = 'Not Specified';
                    if (manualProductName && manualProductName !== 'Not Specified' && manualProductName !== 'General') {
                        finalProductName = manualProductName;
                    } else if (analysis.productName && analysis.productName !== 'General' && analysis.productName !== 'Not Specified') {
                        finalProductName = analysis.productName;
                    }

                    // 2. Save to MongoDB
                    const newFeedback = new Feedback({
                        text,
                        summary: analysis.summary,
                        productName: finalProductName,
                        sentiment: normalizedSentiment,
                        category: normalizedCategory,
                        actionItem: analysis.actionItem
                    });
                    await newFeedback.save();

                    // 3. Generate Embedding & Save to Pinecone
                    const embedding = await geminiService.generateEmbedding(text);
                    await pineconeService.upsertVector(newFeedback._id.toString(), embedding, {
                        text: text,
                        category: analysis.category,
                        sentiment: analysis.sentiment,
                        productName: newFeedback.productName
                    });

                    processedResults.push(newFeedback);
                }
            } catch (err) {
                console.error(`Failed to process feedback item at index ${i}:`, err.message);
                failedResults.push({ index: i, text: originalText, error: err.message });
            }
        }

        res.status(201).json({
            message: "Feedback ingestion completed",
            processedCount: processedResults.length,
            failedCount: failedResults.length,
            data: processedResults,
            failures: failedResults
        });
    } catch (error) {
        console.error("Ingest Fatal Error:", error);
        res.status(500).json({ error: "Failed to ingest feedback loop" });
    }
};

exports.searchFeedback = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: "Query is required" });

        // 1. Convert query to embedding
        const queryEmbedding = await geminiService.generateEmbedding(query);

        // 2. Search Pinecone
        const matches = await pineconeService.queryVectors(queryEmbedding, 5);

        // 3. RAG with Gemini
        const context = matches.map(m => `- ${m.metadata.text}`).join('\n');
        const ragPrompt = promptTemplates.ragAnswer
            .replace('{context}', context)
            .replace('{question}', query);

        const answer = await geminiService.generateText(ragPrompt);

        res.json({
            answer,
            sources: matches.map(m => ({
                id: m.id,
                score: m.score,
                text: m.metadata.text,
                sentiment: m.metadata.sentiment,
                category: m.metadata.category,
                productName: m.metadata.productName
            }))
        });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Search failed" });
    }
};

exports.getThemes = async (req, res) => {
    try {
        // Get recent feedback summaries (increased to 50 for better coverage)
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(50);

        if (feedbacks.length === 0) {
            return res.json([]);
        }

        const summaries = feedbacks.map(f => `- ${f.summary}`).join('\n');

        const prompt = promptTemplates.themes.replace('{summaries}', summaries);

        let themes = [];
        try {
            themes = await geminiService.generateJSON(prompt);

            // Ensure result is an array
            if (!Array.isArray(themes)) {
                // Sometimes the model returns { themes: [...] }
                themes = themes.themes || [];
            }
        } catch (err) {
            console.warn("Theme generation failed (likely rate limit). Returning empty themes to prevent UI crash.", err.message);
            // Return empty array so frontend shows "No themes found" instead of error
            return res.json([]);
        }

        res.json(themes);
    } catch (error) {
        console.error("Theme Detection Fatal Error:", error);
        res.status(500).json({ error: "Failed to analyze themes" });
    }
};

exports.generateActionItem = async (req, res) => {
    try {
        const { feedbackText } = req.body;
        const prompt = promptTemplates.actionItem.replace('{feedbackText}', feedbackText);
        const actionItem = await geminiService.generateJSON(prompt);
        res.json(actionItem);
    } catch (error) {
        console.error("Action Item Error:", error);
        res.status(500).json({ error: "Failed to generate action item" });
    }
};

exports.competitiveAnalysis = async (req, res) => {
    try {
        const { ourFeedback, competitorFeedback } = req.body;
        const prompt = promptTemplates.competitiveAnalysis
            .replace('{ourFeedback}', ourFeedback)
            .replace('{competitorFeedback}', competitorFeedback);

        const analysis = await geminiService.generateText(prompt);
        res.json({ analysis });
    } catch (error) {
        console.error("Competitive Analysis Error:", error);
        res.status(500).json({ error: "Analysis failed" });
    }
};

exports.getRecentFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(20);
        res.json(feedbacks);
    } catch (error) {
        console.error("Get Recent Feedback Error:", error);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
};

exports.clearAllFeedback = async (req, res) => {
    try {
        await Feedback.deleteMany({});
        // Note: We are NOT clearing Pinecone here as it's a bit more complex and might not be strictly necessary for the UI cleanup demo.
        // If strictly needed, we would add pineconeService.deleteAll()
        res.json({ message: "All feedback cleared successfully" });
    } catch (error) {
        console.error("Clear Data Error:", error);
        res.status(500).json({ error: "Failed to clear data" });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Delete from MongoDB
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        // 2. Delete from Pinecone
        try {
            await pineconeService.deleteVector(id);
        } catch (pineconeError) {
            console.error("Failed to delete from Pinecone:", pineconeError.message);
            // We continue even if Pinecone deletion fails to ensure MongoDB consistency
        }

        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("Delete Feedback Error:", error);
        res.status(500).json({ error: "Failed to delete feedback" });
    }
};

exports.analyzeProductRequest = async (req, res) => {
    try {
        const { feedbackText } = req.body;
        if (!feedbackText) return res.status(400).json({ error: "Feedback text is required" });

        // Check if prompt template exists
        if (!promptTemplates.productAnalysis) {
            throw new Error("Product Analysis prompt template not found");
        }

        const prompt = promptTemplates.productAnalysis.replace('{feedbackText}', feedbackText);

        const result = await geminiService.generateJSON(prompt);
        res.json(result);
    } catch (error) {
        console.error("Product Analysis Error:", error);
        res.status(500).json({ error: "Product Analysis failed" });
    }
};

exports.bulkProductAnalysis = async (req, res) => {
    try {
        // 1. Fetch recent feedback from MongoDB (sorted by newest first)
        // Increased limit to 100 to capture more products within the context window
        const feedbacks = await Feedback.find({}).sort({ createdAt: -1 }).limit(100);

        if (feedbacks.length === 0) {
            return res.json([]);
        }

        // 2. Combine all feedback text into one large blob
        // We use the 100 most recent items. Flash models handle large context well.
        const combinedText = feedbacks
            .map(f => `Product Context: ${f.productName || 'Not Specified'}\nFeedback: ${f.text}`)
            .join('\n---\n');

        // 3. Analyze with Gemini
        if (!promptTemplates.productAnalysis) {
            throw new Error("Product Analysis prompt template not found");
        }

        const prompt = promptTemplates.productAnalysis.replace('{feedbackText}', combinedText);
        const result = await geminiService.generateJSON(prompt);

        res.json(result);
    } catch (error) {
        console.error("Bulk Product Analysis Error:", error);
        res.status(500).json({ error: "Bulk Analysis failed" });
    }
};

exports.getTrendAnalysis = async (req, res) => {
    try {
        const { productName, days } = req.query;
        const daysCount = parseInt(days) || 7; // Default to 7 days

        // Date Ranges
        const now = new Date();
        const currentStart = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
        const previousStart = new Date(now.getTime() - (daysCount * 2) * 24 * 60 * 60 * 1000);

        // Helper to get stats for a period
        const getStats = async (product, start, end) => {
            const query = {
                createdAt: { $gte: start, $lt: end }
            };
            if (product) query.productName = product;

            // Retrieve feedbacks for the period
            const feedbacks = await Feedback.find(query);

            const total = feedbacks.length;
            if (total === 0) return { negative: 0, positive: 0, count: 0 };

            const negative = feedbacks.filter(f => f.sentiment === 'Negative').length;
            const positive = feedbacks.filter(f => f.sentiment === 'Positive').length;

            return {
                negative,
                positive,
                count: total
            };
        };

        // Determine products to analyze
        let targetProducts = [];
        if (productName) {
            targetProducts = [productName];
        } else {
            // Find top products mentioned in the last 90 days to ensure we capture all relevant items
            const discoveryStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

            const distinctProducts = await Feedback.aggregate([
                { $match: { createdAt: { $gte: discoveryStart } } },
                { $group: { _id: "$productName", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 }
            ]);
            targetProducts = distinctProducts.map(p => p._id).filter(p => p && p.trim() !== '' && p !== 'Not Specified' && p !== 'General' && p !== 'Unknown');

            // If specific known products are missing but exist in DB, they should appear now.
            if (targetProducts.length === 0) targetProducts = ['Not Specified'];
        }

        const results = [];

        for (const product of targetProducts) {
            const currentPeriod = await getStats(product, currentStart, now);
            const previousPeriod = await getStats(product, previousStart, currentStart);

            // Small Sample Handling
            const minThreshold = 5;
            const isLowVolume = previousPeriod.count < minThreshold;

            // Calculate percentage changes
            const calculateChange = (current, previous) => {
                if (previous === 0) return current > 0 ? 100 : 0; // If no previous data, assume 100% increase if current > 0
                return Math.round(((current - previous) / previous) * 100);
            };

            const negativeChange = calculateChange(currentPeriod.negative, previousPeriod.negative);
            const positiveChange = calculateChange(currentPeriod.positive, previousPeriod.positive);

            // Sentiment Score (Positive / Total) - Range 0 to 1
            const calculateScore = (stats) => {
                const total = stats.positive + stats.negative; // Ignore Neutral
                if (total === 0) return 0;
                return stats.positive / total;
            };

            const currentScore = calculateScore(currentPeriod);
            const previousScore = calculateScore(previousPeriod);
            const scoreChange = (currentScore - previousScore).toFixed(2); // e.g. -0.15

            // --- IMPROVED RISK LOGIC ---
            let riskLevel = 'Low';

            // 1. Analyze Trends
            const negIncreasing = negativeChange > 0;
            const posIncreasing = positiveChange > 0;

            if (negIncreasing) {
                if (negativeChange > 25 && negativeChange > positiveChange) {
                    // High negative growth outpacing positive
                    riskLevel = 'High';
                } else if (negativeChange > 10) {
                    // Moderate negative growth
                    riskLevel = 'Medium';
                }

                // Mitigation: If positive grew FASTER or EQUAL, downgrade risk
                if (posIncreasing && positiveChange >= negativeChange) {
                    if (riskLevel === 'High') riskLevel = 'Medium';
                    else if (riskLevel === 'Medium') riskLevel = 'Low';
                }
            }

            // 2. Sentiment Score Check (if score drops significantly, bump risk)
            // A drop of 0.15 (15%) is significant
            if (scoreChange < -0.15) {
                if (riskLevel === 'Low') riskLevel = 'Medium';
                else if (riskLevel === 'Medium') riskLevel = 'High';
            }

            // 3. Small Sample Correction
            // If we have very few previous reviews, specific % changes are noisy.
            if (isLowVolume) {
                // If we went from small volume to slightly larger, cap the panic unless it's a huge spike
                if (currentPeriod.count < 10 && riskLevel === 'High') {
                    riskLevel = 'Medium'; // Cap risk for low volume scenarios to avoid false positives
                }
            }

            // Generate Summary with AI
            let summary = "Trends are stable.";
            try {
                const prompt = promptTemplates.trendAnalysis
                    .replace('{productName}', product)
                    .replace('{currentCount}', currentPeriod.count)
                    .replace('{previousCount}', previousPeriod.count)
                    .replace('{negativeChange}', negativeChange)
                    .replace('{positiveChange}', positiveChange)
                    .replace('{scoreChange}', scoreChange)
                    .replace('{riskLevel}', riskLevel);

                const aiResponse = await geminiService.generateText(prompt);
                summary = aiResponse.trim();
            } catch (err) {
                console.error("AI Summary generation failed:", err.message);
                summary = `Negative feedback changed by ${negativeChange}% and positive by ${positiveChange}%.`;
            }

            results.push({
                product,
                negativeChange,
                positiveChange,
                riskLevel,
                summary,
                period: `${daysCount} Days`,
                stats: {
                    current: currentPeriod,
                    previous: previousPeriod,
                    scoreChange
                }
            });
        }

        res.json(results);

    } catch (error) {
        console.error("Trend Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze trends" });
    }
};

exports.getCommonComplaints = async (req, res) => {
    try {
        console.log("Starting Common Complaints extraction...");
        // Fetch recent feedback (limited to 50 for broad coverage but avoiding token limits)
        const feedbacks = await Feedback.find({ sentiment: 'Negative' }).sort({ createdAt: -1 }).limit(50);

        let targetFeedbacks = feedbacks;
        if (feedbacks.length === 0) {
            console.log("No negative feedback found, checking recent general feedback...");
            const allFeedback = await Feedback.find().sort({ createdAt: -1 }).limit(30);
            if (allFeedback.length === 0) {
                console.log("No feedback data found at all.");
                return res.json([]);
            }
            targetFeedbacks = allFeedback;
        }

        const combinedText = targetFeedbacks.map(f => `- [${f.sentiment}] ${f.text}`).join('\n');
        const prompt = promptTemplates.commonComplaints.replace('{feedbacks}', combinedText);

        console.log(`Sending ${targetFeedbacks.length} items to Gemini for pattern analysis...`);
        const result = await geminiService.generateJSON(prompt);

        console.log("Patterns identified successfully.");
        res.json(result);
    } catch (error) {
        console.error("Common Complaints Error:", error);
        res.status(500).json({
            error: "Failed to extract common complaints",
            details: error.message
        });
    }
};

exports.getFeedbackStats = async (req, res) => {
    try {
        const totalCount = await Feedback.countDocuments();

        const sentimentCounts = await Feedback.aggregate([
            {
                $group: {
                    _id: "$sentiment",
                    count: { $sum: 1 }
                }
            }
        ]);

        const actionItemsCount = await Feedback.countDocuments({ actionItem: { $exists: true, $ne: null } });

        // Convert aggregation array to object
        const sentiments = { Positive: 0, Neutral: 0, Negative: 0 };
        sentimentCounts.forEach(s => {
            if (s._id) {
                const key = s._id.charAt(0).toUpperCase() + s._id.slice(1).toLowerCase();
                sentiments[key] = (sentiments[key] || 0) + s.count;
            } else {
                sentiments.Neutral += s.count;
            }
        });

        res.json({
            totalCount,
            sentiments,
            actionItemsCount
        });
    } catch (error) {
        console.error("Get Feedback Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

