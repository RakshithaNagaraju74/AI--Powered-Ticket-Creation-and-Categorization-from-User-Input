const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
        index: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open',
        index: true
    },
    assignedTo: {
        type: String,
        index: true
    },
    assignedAt: {
        type: Date
    },
    firstResponseAt: {
        type: Date
    },
    resolved_at: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    category_confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    priority_confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    entities: {
        devices: [String],
        usernames: [String],
        error_codes: [String],
        ip_addresses: [String],
        urls: [String]
    },
    feedbackSubmitted: {
        type: Boolean,
        default: false
    },
    feedbackRating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedbackComment: String,
    feedbackDate: Date,
    resolution: String,
    tags: [String],
    relatedTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    aiSummary: String,
    slaBreached: {
        type: Boolean,
        default: false
    },
    escalationLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
    }
});

// Indexes for performance
ticketSchema.index({ status: 1, priority: -1 });
ticketSchema.index({ category: 1, status: 1 });
ticketSchema.index({ created_at: -1 });

// Middleware to update timestamps

module.exports = mongoose.model('Ticket', ticketSchema);