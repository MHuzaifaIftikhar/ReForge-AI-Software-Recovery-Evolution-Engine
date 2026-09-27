// Modernized Payment Service Tests verifying PaymentAdapter integration
const assert = require('assert');
const paymentService = require('../services/payment');
const orderRepository = require('../repositories/orderRepository');

async function runPaymentTests() {
    console.log('--- Running Modernized PaymentService Tests ---');

    const testOrderId = 'ord-mod-' + Date.now();
    await orderRepository.createOrder({
        _id: testOrderId,
        customerId: 'cust-501',
        total: 510.00,
        status: 'PENDING'
    });

    // Test 1: Successful payment through PaymentAdapter
    const result = await paymentService.processPayment({
        orderId: testOrderId,
        amount: 510.00,
        customerId: 'cust-501'
    });

    assert.strictEqual(result.status, 'PAID');
    assert.ok(result.transactionId.startsWith('TXN-'));
    console.log('  ✓ processes payment via PaymentAdapter abstraction');

    // Test 2: Verify database record updated
    const updatedOrder = await orderRepository.findById(testOrderId);
    assert.strictEqual(updatedOrder.status, 'PAID');
    assert.strictEqual(updatedOrder.paymentDetails.provider, 'LegacyGateway (Adapted)');
    console.log('  ✓ verifies database record updated with modern provider metadata');

    // Test 3: Duplicate protection
    const duplicate = await paymentService.processPayment({
        orderId: testOrderId,
        amount: 510.00,
        customerId: 'cust-501'
    });
    assert.strictEqual(duplicate.success, true);
    assert.strictEqual(duplicate.message, 'Order is already paid');
    console.log('  ✓ preserves duplicate payment prevention');

    return true;
}

if (require.main === module) {
    runPaymentTests().catch(err => {
        console.error('Payment tests failed:', err);
        process.exit(1);
    });
}

module.exports = runPaymentTests;
