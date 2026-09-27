// Payment Service - Orchestrates checkout transactions and billing
// Tightly coupled to LegacyGateway integration and MongoDB orderRepository

const EventEmitter = require('events');
const orderRepository = require('../repositories/orderRepository');

// =============================================================================
// Direct coupling to legacy external gateway (no adapter pattern)
// =============================================================================
const LegacyGateway = require('../integrations/legacyGateway');

class PaymentService extends EventEmitter {
    constructor() {
        super();
        this.maxRetryAttempts = 3;
    }

    /**
     * Process customer checkout payment
     * @param {Object} paymentPayload - { orderId, amount, customerId, paymentMethod }
     * @returns {Promise<Object>}
     */
    async processPayment(paymentPayload) {
        const { orderId, amount, customerId } = paymentPayload;

        if (!orderId || !amount) {
            throw new Error('PAYMENT_ERROR: Missing required orderId or amount');
        }

        // Fetch order to verify state
        const order = await orderRepository.findById(orderId);
        if (!order) {
            throw new Error(`ORDER_NOT_FOUND: Order ${orderId} does not exist`);
        }

        if (order.status === 'PAID') {
            return { success: true, message: 'Order is already paid', orderId };
        }

        let gatewayResponse = null;
        try {
            // Direct invocation of external legacy gateway
            gatewayResponse = await LegacyGateway.charge({
                amount,
                customerId,
                orderId
            });
        } catch (err) {
            // Delegate to undocumented retry policy
            gatewayResponse = await this.executeRetryPolicy(paymentPayload, err);
        }

        if (!gatewayResponse || gatewayResponse.status !== 'SUCCESS') {
            await orderRepository.updatePaymentStatus(orderId, 'FAILED', {
                reason: gatewayResponse ? gatewayResponse.providerCode : 'GATEWAY_ERROR'
            });
            throw new Error('PAYMENT_FAILED: Provider declined transaction');
        }

        // Write payment confirmation to database
        await orderRepository.updatePaymentStatus(orderId, 'PAID', {
            transactionId: gatewayResponse.transactionId,
            paidAt: new Date(),
            gateway: 'LegacyGateway'
        });

        this.emit('payment:completed', {
            orderId,
            transactionId: gatewayResponse.transactionId,
            amount
        });

        return {
            success: true,
            transactionId: gatewayResponse.transactionId,
            orderId,
            status: 'PAID'
        };
    }

    /**
     * Undocumented Legacy Payment Retry Mechanism
     * Automatically attempts up to 3 retries on network or timeout exceptions
     * Evidence: services/payment.js:91-103
     */
    async executeRetryPolicy(paymentPayload, initialError) {
        console.warn(`[PaymentService] Gateway error encountered. Initiating retry policy...`);
        for (let attempt = 1; attempt <= this.maxRetryAttempts; attempt++) {
            try {
                const retryResponse = await LegacyGateway.charge({
                    amount: paymentPayload.amount,
                    customerId: paymentPayload.customerId,
                    orderId: paymentPayload.orderId
                });
                if (retryResponse && retryResponse.status === 'SUCCESS') {
                    return retryResponse;
                }
            } catch (retryErr) {
                if (attempt === this.maxRetryAttempts) {
                    throw new Error(`PAYMENT_RETRY_EXHAUSTED: Failed after ${attempt} attempts: ${retryErr.message}`);
                }
            }
        }
        throw initialError;
    }

    /**
     * Process refund for a cancelled or returned order
     */
    async processRefund(orderId, amount) {
        const order = await orderRepository.findById(orderId);
        if (!order || order.status !== 'PAID') {
            throw new Error('REFUND_ERROR: Order is not eligible for refund');
        }

        const transactionId = order.paymentDetails ? order.paymentDetails.transactionId : null;
        const refundResult = await LegacyGateway.refund(transactionId, amount);

        await orderRepository.updatePaymentStatus(orderId, 'REFUNDED', refundResult);
        return refundResult;
    }
}

module.exports = new PaymentService();
