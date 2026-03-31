const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
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
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        
        // Convert to Base64 String
        const base64String = req.file.buffer.toString('base64');
        const photoUrl = `data:${req.file.mimetype};base64,${base64String}`;
        
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

// Upload Resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        
        // Convert to Base64 String
        const base64String = req.file.buffer.toString('base64');
        const resumeUrl = `data:${req.file.mimetype};base64,${base64String}`;
        
        let portfolio = await Portfolio.findOne();
        if (portfolio) {
            portfolio.profile.resumeUrl = resumeUrl;
            await portfolio.save();
        }
        res.json({ resumeUrl });
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

// Upload Certificate
router.post('/certificate', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
        
        const base64String = req.file.buffer.toString('base64');
        const imageUrl = `data:${req.file.mimetype};base64,${base64String}`;
        
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        if (!portfolio.certificates) portfolio.certificates = [];
        
        portfolio.certificates.push({
            title: req.body.title,
            description: req.body.description,
            imageUrl: imageUrl
        });
        
        await portfolio.save();
        res.json(portfolio.certificates);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Certificate
router.put('/certificate/:id', auth, upload.single('image'), async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) return res.status(404).json({ message: 'Not found' });
        
        const certIndex = portfolio.certificates.findIndex(c => c._id.toString() === req.params.id);
        if (certIndex === -1) return res.status(404).json({ message: 'Certificate not found' });
        
        if (req.body.title) portfolio.certificates[certIndex].title = req.body.title;
        if (req.body.description) portfolio.certificates[certIndex].description = req.body.description;
        
        if (req.file) {
            const base64String = req.file.buffer.toString('base64');
            portfolio.certificates[certIndex].imageUrl = `data:${req.file.mimetype};base64,${base64String}`;
        }
        
        await portfolio.save();
        res.json(portfolio.certificates);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete Certificate
router.delete('/certificate/:id', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (portfolio) {
            portfolio.certificates = portfolio.certificates.filter(c => c._id.toString() !== req.params.id);
            await portfolio.save();
            res.json(portfolio.certificates);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
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

const Message = require('../models/Message');

// Get all messages
router.get('/messages', auth, async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete a message
router.delete('/messages/:id', auth, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
