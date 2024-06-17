const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const Bookmark = require('../models/Bookmark');

// POST bookmark
router.post('/', async (req, res) => {
    const { title, url, category } = req.body;
    try {
        const newBookmark = new Bookmark({ title, url, category });
        await newBookmark.save();
        res.json(newBookmark);
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET bookmarks
router.get('/', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find();
        res.json(bookmarks);
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST classify bookmark
router.post('/classify', async (req, res) => {
    const { title, url } = req.body;

    // Spawn a new process to run the Python script
    const python = spawn('python', ['classify.py']);

    // Send data to Python script
    python.stdin.write(JSON.stringify({ title, url }));
    python.stdin.end();

    let dataString = '';
    let errorString = '';

    // Receive data from Python script
    python.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    // Receive error from Python script
    python.stderr.on('data', (data) => {
        errorString += data.toString();
    });
    
    python.on('close', (code) => {
        if (code !== 0) {
            console.error('Python script error:', errorString);
            res.status(500).json({ error: 'Error classifying URL', details: errorString });
        } else {
            try {
                const result = JSON.parse(dataString);
                res.json(result);
            } catch (err) {
                console.error('Error parsing JSON from Python script:', err);
                res.status(500).json({ error: 'Error classifying URL' });
            }
        }
    });
});

module.exports = router;
