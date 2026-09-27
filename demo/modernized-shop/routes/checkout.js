// Modernized Checkout Routes
const express = require('express');
const router = express.Router();
const orderService = require('../services/orders');
const paymentService = require('../services/payment');
const userService = require('../services/user');

router.post('/', async (req, res) => {
    try {
        const { customerId, items, paymentMethod } = req.body;

        if (!customerId || !items || !items.length) {
            return res.status(400).json({ error: 'Missing customerId or items' });
        }

        const customer = await userService.getProfile(customerId);
        const order = await orderService.createOrder(customerId, items, customer);

        const paymentResult = await paymentService.processPayment({
            orderId: order.orderId,
            amount: order.total,
            customerId: customerId,
            paymentMethod
        });

        return res.status(200).json({
            success: true,
            orderId: order.orderId,
            total: order.total,
            discount: order.discount,
            appliedRule: order.appliedRule,
            transactionId: paymentResult.transactionId,
            status: 'COMPLETED'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post('/refund', async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const result = await paymentService.processRefund(orderId, amount);
        return res.json({ success: true, result });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
