// Legacy payment gateway integration
// WARNING: Uses obsolete 'request' package deprecated in 2020
let request;
try {
    request = require('request');
} catch (e) {
    // Graceful fallback for demo test environment without npm install
    request = function(opts, cb) {
        cb(null, { statusCode: 200 }, { status: 'SUCCESS' });
    };
}

class LegacyGateway {
    constructor() {
        this.gatewayUrl = process.env.GATEWAY_URL || 'https://legacy-pay.internal.corp/api/v1/charge';
        this.apiKey = process.env.GATEWAY_KEY || 'LEGACY_SECRET_KEY_PROD_123';
    }

    /**
     * Charges a customer card via the legacy provider endpoint
     * @param {Object} chargeData - { amount, customerId, orderId }
     * @returns {Promise<Object>}
     */
    charge(chargeData) {
        return new Promise((resolve, reject) => {
            // Simulated network latency
            setTimeout(() => {
                if (chargeData.amount <= 0) {
                    return reject(new Error('INVALID_AMOUNT: Charge amount must be greater than zero'));
                }
                
                // Return legacy proprietary payload format expected by payment.js
                resolve({
                    status: 'SUCCESS',
                    transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
                    providerCode: 'AUTH_LEGACY_00',
                    timestamp: new Date().toISOString()
                });
            }, 10);
        });
    }

    /**
     * Refunds an existing transaction
     */
    refund(transactionId, amount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 'REFUNDED',
                    transactionId,
                    refundAmount: amount
                });
            }, 10);
        });
    }
}

module.exports = new LegacyGateway();
