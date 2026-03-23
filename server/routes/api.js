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

module.exports = router;
