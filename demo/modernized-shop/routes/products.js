// Modernized Products routes
const express = require('express');
const router = express.Router();

const CATALOG = [
    { id: 'prod-001', name: 'Vintage Leather Jacket', price: 250.00, inventory: 15 },
    { id: 'prod-002', name: 'Mechanical Keyboard', price: 140.00, inventory: 40 },
    { id: 'prod-003', name: 'Noise-Canceling Headphones', price: 320.00, inventory: 25 }
];

router.get('/', (req, res) => {
    res.json({ success: true, count: CATALOG.length, products: CATALOG });
});

router.get('/:id', (req, res) => {
    const product = CATALOG.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, product });
});

module.exports = router;
