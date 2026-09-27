// Orders routes
const express = require('express');
const router = express.Router();
const orderService = require('../services/orders');

router.get('/:id', async (req, res) => {
    try {
        const order = await orderService.getOrder(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
