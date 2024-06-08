const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// POST bookmark
router.post('/', async (req, res) => {
    const { title, url, category } = req.body;
    try {
        const newBookmark = new Bookmark({ title, url, category });
        await newBookmark.save();
        res.json(newBookmark);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET bookmark
router.get('/', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find();
        res.json(bookmarks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
