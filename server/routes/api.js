const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// GET /api/portfolio
// Returns the entire portfolio data document
router.get('/portfolio', async (req, res) => {
    try {
        const data = await Portfolio.findOne();
        if (!data) {
            return res.status(404).json({ message: 'Portfolio data not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const Message = require('../models/Message');

// POST /api/contact
// Submit a contact message
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/visit
// Increment unique visitor count
router.post('/visit', async (req, res) => {
    try {
        await Portfolio.updateOne({}, { $inc: { visitors: 1 } });
        res.status(200).json({ message: 'Visit recorded' });
    } catch (error) {
        console.error('Error recording visit:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
