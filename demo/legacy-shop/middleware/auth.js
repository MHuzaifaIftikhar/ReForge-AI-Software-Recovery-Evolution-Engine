// Authentication Middleware
// SECURITY FINDING: Hardcoded fallback secret & unverified algorithms in jsonwebtoken v8.5.1
let jwt;
try {
    jwt = require('jsonwebtoken');
} catch (e) {
    // Graceful fallback for zero-install demo runner
    jwt = {
        verify: (token, secret, cb) => cb(null, { sub: 'cust-501', tier: 'GOLD' })
    };
}

// INSECURE DEMO PATTERN: Hardcoded secret key fallback
const JWT_SECRET = process.env.JWT_SECRET || 'legacy_super_secret_key_123';

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED: No token provided' });
    }

    const token = authHeader.replace(/^Bearer\s+/, '');
    
    // Insecure token verification without specifying allowed algorithms
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'INVALID_TOKEN: Token verification failed', details: err.message });
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    authenticate,
    JWT_SECRET
};
