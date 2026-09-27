// Checkout routes - Express controller for customer checkout
const express = require('express');
const router = express.Router();
const orderService = require('../services/orders');
const paymentService = require('../services/payment');
const userService = require('../services/user');

/**
 * POST /api/checkout
 * Direct caller of PaymentService
 */
router.post('/', async (req, res) => {
    try {
        const { customerId, items, paymentMethod } = req.body;

        if (!customerId || !items || !items.length) {
            return res.status(400).json({ error: 'Missing customerId or items' });
        }

        // 1. Fetch customer details
        const customer = await userService.getProfile(customerId);

        // 2. Prepare order with pricing & discounts
        const order = await orderService.createOrder(customerId, items, customer);

        // 3. Directly invoke PaymentService to execute billing transaction
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

/**
 * POST /api/checkout/refund
 * Calls PaymentService refund
 */
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
