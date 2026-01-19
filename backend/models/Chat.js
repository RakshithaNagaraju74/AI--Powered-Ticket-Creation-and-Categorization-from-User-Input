const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        index: true
    },
    sender: {
        type: String,
        required: true
    },
    senderEmail: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    attachments: [{
        filename: String,
        url: String,
        type: String,
        size: Number
    }],
    isSystem: {
        type: Boolean,
        default: false
    },
    readBy: [{
        userEmail: String,
        readAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('Chat', chatSchema);