const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const feedbackController = require('../controllers/feedbackController');
const Feedback = require('../models/Feedback');

const logFile = 'ingest-log.txt';
// Clear previous log
fs.writeFileSync(logFile, "Starting Detailed Test...\n");

function logToFile(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

// Override console logging
const originalLog = console.log;
const originalError = console.error;

console.log = function (...args) {
    const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    logToFile("[LOG] " + msg);
    originalLog.apply(console, args);
};

console.error = function (...args) {
    const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    logToFile("[ERROR] " + msg);
    originalError.apply(console, args);
};

// Mock Req/Res
const req = {
    body: {
        feedbacks: [
            "The login page is too slow on mobile.",
            "Great service, I loved the quick response!"
        ]
    }
};

const res = {
    status: (code) => ({
        json: (data) => {
            console.log(`Response Status: ${code}`);
            console.log("DATA: ", data);
        }
    }),
    json: (data) => {
        console.log("Response JSON: ", data);
    }
};

async function testIngest() {
    console.log("🚀 Starting Ingestion Test...");
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/insightful');
        console.log("Connected to MongoDB");

        await feedbackController.ingestFeedback(req, res);

        console.log("Ingestion Test Completed.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Test Failed (Outer Catch):", error);
        process.exit(1);
    }
}

testIngest();
