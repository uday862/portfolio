const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
});

// Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        let portfolio = await Portfolio.findOne();
        
        const adminUsername = (portfolio && portfolio.admin && portfolio.admin.username) ? portfolio.admin.username : (process.env.ADMIN_USERNAME || 'admin');
        const adminPassword = (portfolio && portfolio.admin && portfolio.admin.password) ? portfolio.admin.password : (process.env.ADMIN_PASSWORD || 'admin123');

        if (username === adminUsername && password === adminPassword) {
            const payload = { user: { role: 'admin' } };
            jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '10h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } else {
            res.status(400).json({ message: 'Invalid Credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Admin Credentials
router.put('/credentials', auth, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        
        portfolio.admin = { username, password };
        await portfolio.save();
        res.json({ message: 'Credentials updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Upload Photo
router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        
        let portfolio = await Portfolio.findOne();
        if (portfolio) {
            portfolio.profile.photoUrl = photoUrl;
            await portfolio.save();
        }
        res.json({ photoUrl });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Profile text data
router.put('/profile', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) return res.status(404).json({ message: 'Not found' });
        
        for (let key in req.body) {
            portfolio.profile[key] = req.body[key];
        }
        await portfolio.save();
        res.json(portfolio.profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update bulk array data (projects, skills, education, achievements)
router.put('/:section', auth, async (req, res) => {
    const { section } = req.params;
    const validSections = ['projects', 'skills', 'education', 'achievements'];
    
    if (!validSections.includes(section)) {
        return res.status(400).json({ message: 'Invalid section' });
    }

    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) return res.status(404).json({ message: 'Not found' });
        
        portfolio[section] = req.body;
        await portfolio.save();
        res.json(portfolio[section]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
