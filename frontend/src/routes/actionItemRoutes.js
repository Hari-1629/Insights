const express = require('express');
const router = express.Router();
const actionItemController = require('../controllers/actionItemController');

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Action items router is working!' });
});

// Generate AI implementation plan (must be before /:id routes)
router.post('/generate-implementation-plan', (req, res, next) => {
    console.log('✅ Route /generate-implementation-plan hit!');
    console.log('Request body:', req.body);
    next();
}, actionItemController.generateImplementationPlan);

// Create action item from feedback submission form
router.post('/from-submission', actionItemController.createFromSubmission);

// Create new action item
router.post('/', actionItemController.createActionItem);

// Get all action items
router.get('/', actionItemController.getAllActionItems);

// Update action item status
router.patch('/:id', actionItemController.updateActionItemStatus);

// Delete action item
router.delete('/:id', actionItemController.deleteActionItem);

module.exports = router;
