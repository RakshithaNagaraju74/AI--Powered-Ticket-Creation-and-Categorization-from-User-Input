const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    metric: {
        type: String,
        required: true,
        enum: [
            'tickets_created',
            'tickets_resolved',
            'avg_response_time',
            'avg_resolution_time',
            'customer_satisfaction',
            'agent_efficiency',
            'ai_accuracy'
        ],
        index: true
    },
    value: {
        type: Number,
        required: true
    },
    breakdown: {
        category: String,
        priority: String,
        agent: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for efficient querying
analyticsSchema.index({ date: 1, metric: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);