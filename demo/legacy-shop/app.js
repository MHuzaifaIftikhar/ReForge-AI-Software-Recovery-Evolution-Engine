// Main Express Application Entrypoint - legacy-shop
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');

const checkoutRoutes = require('./routes/checkout');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Legacy middleware pattern
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mount modular routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        app: 'legacy-shop',
        version: '1.0.0',
        nodeVersion: process.version
    });
});

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`legacy-shop server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to initialize database connection:', err);
    });
}

module.exports = app;
