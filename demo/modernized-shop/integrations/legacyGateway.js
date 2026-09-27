// Isolated Legacy Gateway for backward-compatible provider calls
class LegacyGateway {
    constructor() {
        this.gatewayUrl = process.env.GATEWAY_URL || 'https://legacy-pay.internal.corp/api/v1/charge';
        this.apiKey = process.env.GATEWAY_KEY || 'LEGACY_SECRET_KEY_PROD_123';
    }

    async charge(chargeData) {
        if (chargeData.amount <= 0) {
            throw new Error('INVALID_AMOUNT: Charge amount must be greater than zero');
        }
        return {
            status: 'SUCCESS',
            transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
            providerCode: 'AUTH_LEGACY_00',
            timestamp: new Date().toISOString()
        };
    }

    async refund(transactionId, amount) {
        return {
            status: 'REFUNDED',
            transactionId,
            refundAmount: amount
        };
    }
}

module.exports = new LegacyGateway();
