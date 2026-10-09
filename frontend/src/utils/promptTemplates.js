const promptTemplates = {
  summary: `Analyze the following customer feedback and provide a concise summary (max 2 sentences).
Feedback: "{feedbackText}"
Summary:`,

  fullAnalysis: `Analyze the following customer feedback (which may be in ANY language like English, Telugu, Hindi, Spanish, etc.) and provide a structured response STRICTLY in English.
1. Summary: A very concise one-sentence summary of the core issue or praise, translated to English.
2. Sentiment: Classify as ONLY one of: Positive, Negative, or Neutral.
3. Category: Categorize as Bug Report, Feature Request, Praise, or Other.
4. Product: Extract the VERY SPECIFIC product name or feature discussed directly from the feedback text. If multiple products are mentioned, list them. If no specific product or feature is mentioned in the feedback, output 'Not Specified'. DO NOT use 'General'.
5. Action Item: Create a concrete next step for the team in English (title, description, and user_impact as High/Medium/Low).

IMPORTANT: Even if the feedback is in another language, understand the meaning correctly and respond in English.

Feedback: "{feedbackText}"

Respond STRICTLY in this JSON format:
{
  "summary": "...",
  "sentiment": "...",
  "category": "...",
  "productName": "...",
  "actionItem": {
    "title": "...",
    "description": "...",
    "user_impact": "..."
  }
}`,

  sentimentCategoryAndAction: `Analyze the following customer feedback. 
1. Determine the sentiment (Positive, Neutral, or Negative).
2. Categorize it into one of these: Bug Report, Feature Request, Praise, Other.
3. Generate a concrete action item for the development team.

Feedback: "{feedbackText}"

Respond STRICTLY in this JSON format:
{
  "sentiment": "...",
  "category": "...",
  "actionItem": {
    "title": "Short actionable title",
    "description": "Detailed description of the issue or request and recommended action",
    "user_impact": "High/Medium/Low"
  }
}`,

  ragAnswer: `You are an AI assistant for a product team. Use the following context (retrieved customer feedback) to answer the user's question.
If the answer is not in the context, say "I don't have enough information from the feedback to answer that."

Context:
{context}

Question: {question}

Answer (concise bullet points):`,

  themes: `Analyze the following list of customer feedback summaries and identify the top 3 emerging themes or trends.
Feedback Summaries:
{summaries}

Respond STRICTLY in this JSON format:
[
  {
    "theme": "Title of theme",
    "description": "Brief description",
    "sentiment": "Overall sentiment (Positive/Neutral/Negative)"
  },
  ...
]`,

  actionItem: `Convert the following feedback into a structured action item for the development team.
Feedback: "{feedbackText}"

Respond STRICTLY in this JSON format:
{
  "title": "Short actionable title",
  "description": "Detailed description of the issue or request",
  "user_impact": "High/Medium/Low based on severity/tone"
}`,

  competitiveAnalysis: `Compare our product feedback with the following competitor feedback. The feedback may be in ANY language (e.g., Telugu, English, etc.).
1. Correctly understand the meaning regardless of the language.
2. Provide a comparison including Strengths, Weaknesses, and Key Insights STRICTLY in English.

Our Feedback Summary: "{ourFeedback}"
Competitor Feedback: "{competitorFeedback}"`,

  directActionItemCreation: `You are processing a user-submitted feedback form. The feedback may be in ANY language (e.g., Telugu, English, Hindi). Create a structured action item from the following, correctly understanding the meaning regardless of the language:

Feedback Type: {feedbackType}
Description: "{description}"

RULES:
1. MANDATORY: Translate all extracted content into English.
2. Title must be concise and actionable (max 10 words) in English.
3. Description must be rewritten in clear, professional English suitable for engineers.
4. Infer user_impact (High/Medium/Low) from the original text.
5. Output ONLY valid JSON, no extra text, explanations, or markdown.

Respond STRICTLY in this JSON format:
{
  "title": "Concise actionable title",
  "description": "Clear professional description for engineers",
  "user_impact": "High/Medium/Low"
}`,

  implementationPlan: `You are an AI assistant helping to create an implementation plan for a {feedbackType}.

Feedback Description: "{description}"

Generate a detailed AI-powered implementation plan that includes:
1. Technical approach and architecture considerations
2. Key features or fixes to implement
3. AI/ML components that could be used (if applicable)
4. Step-by-step implementation strategy
5. Potential challenges and solutions

Provide a comprehensive, professional implementation plan that engineers can use as a guide. Format it in clear paragraphs with logical flow.

Implementation Plan:`,

  feedbackSplitter: `Split the following customer feedback (which may be in ANY language, e.g., English, Telugu, Hindi, etc.) into a list of distinct, independent points in English. 
1. Correctly understand the meaning of the feedback regardless of the language.
2. If the feedback contains multiple separate issues, requests, or praises, split them into individual items.
3. MANDATORY: Translate all points into English.
4. If the feedback is already a single point, return it as a single-item list in English.

Example Input: "The UI is great but the app is slow. I also want a dark mode."
Example Output: ["The UI is great", "the app is slow", "I also want a dark mode"]

Example (Multilingual): "యాప్ చాలా బాగుంది but login is slow."
Example Output: ["The app is very good", "login is slow"]

Feedback: "{feedbackText}"

Respond STRICTLY in this JSON format:
[
  "Point 1",
  "Point 2",
  ...
]`,
  productAnalysis: `Analyze the feedback (which may be in multiple languages like English, Telugu, Spanish, etc.) and perform the following for EACH product mentioned:

1. Correctly understand the meaning of the feedback regardless of the language.
2. The input will contain "Product Context: [Product Name]" followed by "Feedback: ...".
   - If "Product Context" is "Not Specified", "General" OR a broad category (like "Headphones", "Smartphone"), BUT the feedback text explicitly mentions a specific model (e.g. "AirPods Pro"), USE THE SPECIFIC MODEL from the text.
   - Otherwise, use the "Product Context".
3. IMPORTANT: DO NOT generalize products. If a specific model, brand, or sub-type is mentioned (e.g., "AirPods Pro"), treat it as a COMPLETELY SEPARATE product from a general category. Do not mix their feedback.
4. For EACH unique product identified, extract ONLY positive statements related to it.
5. For EACH unique product identified, extract ONLY negative statements related to it.
6. For EACH unique product identified, calculate:
   - Positive sentiment percentage (ratio of positive points to total points for that product).
   - Negative sentiment percentage (ratio of negative points to total points for that product).
7. MANDATORY: Translate all identified products and extracted statements into English for consistent reporting.

Feedback:
"{feedbackText}"

Return the result strictly in JSON format as an array of objects:
[
  {
    "product": "Product Name",
    "positiveFeedback": ["point 1", "point 2"],
    "negativeFeedback": ["point 1", "point 2"],
    "positivePercentage": 80,
    "negativePercentage": 20
  }
]`,

  commonComplaints: `Analyze the following customer feedbacks and extract recurring "Common Complaints" grouped by specific Product or Feature.

STRICT RULES:
1. Identify the SPECIFIC PRODUCT mentioned in the feedback (e.g., Headphones, Smartphone, Camera, Login System). If multiple products are mentioned, separate them.
2. IMPORTANT: DO NOT generalize products. If a specific model, brand, or sub-type is mentioned (e.g., "AirPods Pro"), treat it as a COMPLETELY DISTINCT product from a general category (e.g., "headphones"). They must have separate entries.
3. Group all complaints that refer to the SAME specific product together.
4. For each group, provide a clear, concise title for the complaint.
5. Provide a technical "Suggested Countermeasure".
6. Estimate "Impact" (High/Medium/Low) based on frequency and severity.

Feedbacks:
{feedbacks}

Respond ONLY with this JSON structure:
[
  {
    "product": "Specific Product Name (e.g., Headphones)",
    "complaint": "Clear description of the recurring issue",
    "suggestedFix": "Precise technical countermeasure",
    "impact": "High/Medium/Low",
    "count": "Total occurrences found in the provided text"
  }
]`,

  trendAnalysis: `Analyze the following feedback trend data for a specific product and provide a short, single-sentence summary explaining the trend.

Product: {productName}
Volume: {currentCount} reviews (Previous: {previousCount})
Negative Feedback Change: {negativeChange}%
Positive Feedback Change: {positiveChange}%
Sentiment Score Change: {scoreChange} (Positive ratio change)
Risk Level: {riskLevel}

Context:
- High Risk: Negative reviews rising faster than positive ones, or significant drop in sentiment score.
- Medium Risk: Mixed signals or moderate negative increase.
- Low Risk: Negative reviews decreasing or stable sentiment.
- If volume is low (<5), data is volatile.

Write a concise, professional one-sentence summary interpreting these changes, mentioning the key driver (e.g. "Spike in negatives", "Stable growth", "Insufficient data").`
};

module.exports = promptTemplates;
