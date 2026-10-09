const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    productName: {
        type: String,
        default: 'Not Specified'
    },
    sentiment: {
        type: String,
        enum: ['Positive', 'Neutral', 'Negative'],
        default: 'Neutral'
    },
    category: {
        type: String,
        enum: ['Bug Report', 'Feature Request', 'Praise', 'Other'],
        default: 'Other'
    },
    embeddingId: {
        type: String, // ID in Pinecone
        required: false
    },
    actionItem: {
        title: String,
        description: String,
        user_impact: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
