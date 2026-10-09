const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    customerFeedback: {
        type: String,
        required: true
    },
    implementedFeature: {
        type: String,
        required: true
    },
    userImpact: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    productName: {
        type: String,
        default: 'Not Specified'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    teamName: {
        type: String,
        default: ''
    },
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActionItem', actionItemSchema);
