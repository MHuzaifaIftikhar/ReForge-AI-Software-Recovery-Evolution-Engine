// Modernized Express Entrypoint - Node 22 Architecture
const express = require('express');
const { connectDB } = require('./config/database');

const checkoutRoutes = require('./routes/checkout');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Modern express built-in body parsing (no obsolete body-parser dependency)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Structured logging
app.use((req, res, next) => {
    console.log(`[Modernized ${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mount routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        app: 'modernized-shop',
        version: '2.0.0',
        architecture: 'Adapter Pattern',
        runtime: process.version
    });
});

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`modernized-shop server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to initialize database connection:', err);
    });
}

module.exports = app;
