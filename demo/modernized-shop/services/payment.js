// Modernized Payment Service - Decoupled and using PaymentAdapter
const EventEmitter = require('events');
const orderRepository = require('../repositories/orderRepository');
const paymentAdapter = require('../integrations/paymentAdapter');

class PaymentService extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * Process customer checkout payment via modern Adapter pattern
     */
    async processPayment(paymentPayload) {
        const { orderId, amount, customerId } = paymentPayload;

        if (!orderId || !amount) {
            throw new Error('PAYMENT_ERROR: Missing required orderId or amount');
        }

        const order = await orderRepository.findById(orderId);
        if (!order) {
            throw new Error(`ORDER_NOT_FOUND: Order ${orderId} does not exist`);
        }

        if (order.status === 'PAID') {
            return { success: true, message: 'Order is already paid', orderId };
        }

        // Delegated to resilient PaymentAdapter (encapsulating retries cleanly)
        const chargeResult = await paymentAdapter.executeCharge({
            amount,
            customerId,
            orderId
        });

        // Write payment confirmation to database
        await orderRepository.updatePaymentStatus(orderId, 'PAID', {
            transactionId: chargeResult.transactionId,
            paidAt: chargeResult.settledAt,
            provider: chargeResult.provider
        });

        this.emit('payment:completed', {
            orderId,
            transactionId: chargeResult.transactionId,
            amount
        });

        return {
            success: true,
            transactionId: chargeResult.transactionId,
            orderId,
            status: 'PAID'
        };
    }

    /**
     * Process refund via PaymentAdapter
     */
    async processRefund(orderId, amount) {
        const order = await orderRepository.findById(orderId);
        if (!order || order.status !== 'PAID') {
            throw new Error('REFUND_ERROR: Order is not eligible for refund');
        }

        const transactionId = order.paymentDetails ? order.paymentDetails.transactionId : null;
        const refundResult = await paymentAdapter.executeRefund(transactionId, amount);

        await orderRepository.updatePaymentStatus(orderId, 'REFUNDED', refundResult);
        return refundResult;
    }
}

module.exports = new PaymentService();
