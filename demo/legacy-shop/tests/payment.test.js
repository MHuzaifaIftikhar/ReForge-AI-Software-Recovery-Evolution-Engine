// Unit tests for PaymentService
const assert = require('assert');
const paymentService = require('../services/payment');
const orderRepository = require('../repositories/orderRepository');

async function runPaymentTests() {
    console.log('--- Running PaymentService Tests ---');

    // Setup an initial order in the database repository
    const testOrderId = 'ord-test-' + Date.now();
    await orderRepository.createOrder({
        _id: testOrderId,
        customerId: 'cust-501',
        total: 250.00,
        status: 'PENDING'
    });

    // Test 1: Successful payment processing
    const paymentResult = await paymentService.processPayment({
        orderId: testOrderId,
        amount: 250.00,
        customerId: 'cust-501'
    });

    // Expected gateway response format is asserted
    assert.strictEqual(paymentResult.status, 'PAID', 'Payment status should be PAID');
    assert.ok(paymentResult.transactionId.startsWith('TXN-'), 'Transaction ID should start with TXN-');
    console.log('  ✓ processes valid payment and records transaction ID');

    // Test 2: Double payment prevention
    const duplicateResult = await paymentService.processPayment({
        orderId: testOrderId,
        amount: 250.00,
        customerId: 'cust-501'
    });
    assert.strictEqual(duplicateResult.success, true);
    assert.strictEqual(duplicateResult.message, 'Order is already paid');
    console.log('  ✓ prevents duplicate payments on already settled orders');

    // Test 3: Rejection on missing order
    try {
        await paymentService.processPayment({
            orderId: 'non-existent-order',
            amount: 100.00,
            customerId: 'cust-501'
        });
        assert.fail('Should have thrown ORDER_NOT_FOUND error');
    } catch (err) {
        assert.ok(err.message.includes('ORDER_NOT_FOUND'));
        console.log('  ✓ correctly rejects payment for unknown order ID');
    }

    return true;
}

if (require.main === module) {
    runPaymentTests().catch(err => {
        console.error('Payment tests failed:', err);
        process.exit(1);
    });
}

module.exports = runPaymentTests;
