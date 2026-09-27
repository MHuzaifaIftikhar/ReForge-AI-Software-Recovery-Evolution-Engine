// User routes
const express = require('express');
const router = express.Router();
const userService = require('../services/user');
const { authenticate } = require('../middleware/auth');

router.get('/profile/:id', authenticate, async (req, res) => {
    try {
        const user = await userService.getProfile(req.params.id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
