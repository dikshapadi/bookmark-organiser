const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
