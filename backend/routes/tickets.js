const express = require('express');
const router = express.Router();
const axios = require('axios');
const Ticket = require('../models/Ticket');

// POST: Create a ticket with AI prediction
router.post('/generate', async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        // 1. Call your existing FastAPI BERT service
        const aiResponse = await axios.post('http://127.0.0.1:8000/classify', {
            title, description
        });

        // 2. Map AI results to MongoDB
        const newTicket = new Ticket({
            userId,
            title: aiResponse.data.title,
            description,
            category: aiResponse.data.category,
            priority: aiResponse.data.priority,
            entities: aiResponse.data.entities,
            status: 'unattended'
        });

        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (err) {
        res.status(500).json({ error: "AI Engine or Database Error" });
    }
});

module.exports = router;