
import asyncHandler from 'express-async-handler';
import DoseLog from '../models/doseLogModel.js';
import Medicine from '../models/medicineModel.js';

// @desc    Get missed dose insights
// @route   GET /api/ai/insights
// @access  Private
const getInsights = asyncHandler(async (req, res) => {
    // Logic: Find most missed medicine
    const logs = await DoseLog.find({ user: req.user._id, status: 'Missed' }).populate('medicine');

    const frequencyMap = {};
    logs.forEach(log => {
        const name = log.medicine ? log.medicine.name : 'Unknown';
        frequencyMap[name] = (frequencyMap[name] || 0) + 1;
    });

    // Find max
    let mostMissed = null;
    let maxCount = 0;
    for (const [name, count] of Object.entries(frequencyMap)) {
        if (count > maxCount) {
            maxCount = count;
            mostMissed = name;
        }
    }

    const insights = [];
    if (mostMissed) {
        let advice = "Consider changing the schedule or setting a stronger reminder.";

        // Mock Knowledge Base
        const lowerName = mostMissed.toLowerCase();
        if (lowerName.includes('metformin') || lowerName.includes('insulin')) {
            advice = "Missing diabetes medication can lead to blood sugar spikes. Please check your levels.";
        } else if (lowerName.includes('lisinopril') || lowerName.includes('amlodipine')) {
            advice = "Consistent blood pressure management is key to heart health. Try linking it to breakfast.";
        } else if (lowerName.includes('atorvastatin')) {
            advice = "Statins work best when taken consistently. Missing doses can impact your cholesterol management.";
        } else if (lowerName.includes('antibiotic') || lowerName.includes('amoxicillin')) {
            advice = "Antibiotics must be completed fully. Missing doses can lead to resistance.";
        }

        insights.push({
            type: 'Pattern',
            message: `You frequently miss ${mostMissed}. ${advice}`,
            severity: 'High'
        });
    } else {
        insights.push({
            type: 'Positive',
            message: 'Great job! You have very few missed doses recently. Keep up the streak!',
            severity: 'Low'
        });
    }

    res.json(insights);
});

// @desc    Simple chatbot query
// @route   POST /api/ai/chat
// @access  Private
const chatQuery = asyncHandler(async (req, res) => {
    const { query } = req.body; // e.g., "What medicines do I take today?"
    const lowerQuery = query.toLowerCase();

    let response = "I'm not sure how to answer that yet.";

    if (lowerQuery.includes('today')) {
        const medicines = await Medicine.find({ user: req.user._id }); // In real app, filter by day
        const names = medicines.map(m => m.name).join(', ');
        response = `You have the following medicines scheduled: ${names || 'None'}.`;
    } else if (lowerQuery.includes('missed')) {
        const missed = await DoseLog.find({ user: req.user._id, status: 'Missed' }).populate('medicine');
        const count = missed.length;
        response = `You have missed ${count} doses recently.`;
    }

    res.json({ response });
});

export { getInsights, chatQuery };
