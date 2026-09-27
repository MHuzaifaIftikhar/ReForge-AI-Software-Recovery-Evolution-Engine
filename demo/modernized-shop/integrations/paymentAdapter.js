// Modernized Payment Adapter Pattern
// Resolves direct coupling between PaymentService and LegacyGateway
// Encapsulates the 3x retry policy per Human Approval Gate decision

const legacyGateway = require('./legacyGateway');

class PaymentAdapter {
    constructor(options = {}) {
        this.maxRetries = options.maxRetries !== undefined ? options.maxRetries : 3;
        this.timeoutMs = options.timeoutMs || 5000;
    }

    /**
     * Standardized payment execution with encapsulated retry resilience
     * @param {Object} paymentInfo - { amount, customerId, orderId }
     * @returns {Promise<Object>} - Standardized charge result
     */
    async executeCharge(paymentInfo) {
        let lastError = null;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                // Call through isolated gateway boundary
                const rawResponse = await legacyGateway.charge({
                    amount: paymentInfo.amount,
                    customerId: paymentInfo.customerId,
                    orderId: paymentInfo.orderId
                });

                if (rawResponse && rawResponse.status === 'SUCCESS') {
                    return {
                        success: true,
                        transactionId: rawResponse.transactionId,
                        provider: 'LegacyGateway (Adapted)',
                        attemptNumber: attempt,
                        settledAt: new Date()
                    };
                }
            } catch (err) {
                lastError = err;
                console.warn(`[PaymentAdapter] Retry attempt ${attempt}/${this.maxRetries} failed: ${err.message}`);
                if (attempt < this.maxRetries) {
                    // Backoff delay
                    await new Promise(r => setTimeout(r, 20 * attempt));
                }
            }
        }

        throw new Error(`PAYMENT_ADAPTER_ERROR: Payment processing failed after ${this.maxRetries} attempts: ${lastError ? lastError.message : 'Unknown'}`);
    }

    /**
     * Standardized refund execution
     */
    async executeRefund(transactionId, amount) {
        const rawRefund = await legacyGateway.refund(transactionId, amount);
        return {
            success: true,
            transactionId: rawRefund.transactionId,
            refundAmount: rawRefund.refundAmount,
            status: 'REFUNDED'
        };
    }
}

module.exports = new PaymentAdapter();
