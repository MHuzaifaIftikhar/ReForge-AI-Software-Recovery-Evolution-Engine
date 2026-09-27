// Modernized Pricing Tests with Behavioral Contract Verification
const assert = require('assert');
const pricingService = require('../services/pricing');

function runPricingTests() {
    console.log('--- Running Modernized PricingService Tests & Contracts ---');

    // Regression Test 1: Subtotal
    const items = [{ price: 120, quantity: 2 }, { price: 60, quantity: 1 }];
    assert.strictEqual(pricingService.calculateSubtotal(items), 300);
    console.log('  ✓ verifies subtotal computation');

    // Regression Test 2: Standard pricing
    const std = pricingService.calculateDiscount({ age: 25, tier: 'STANDARD' }, { total: 200, items: [] });
    assert.strictEqual(std.discountRate, 0.0);
    console.log('  ✓ verifies baseline standard pricing');

    // Behavioral Contract #01: Senior Citizen Discount
    // GIVEN customer.age >= 60 AND order.total > 500
    // EXPECT discount = 15%
    const seniorResult = pricingService.calculateDiscount({ age: 65, tier: 'STANDARD' }, { total: 600, items: [] });
    assert.strictEqual(seniorResult.discountRate, 0.15, 'Contract #01 Failure: Expected 15% discount');
    assert.strictEqual(seniorResult.discountAmount, 90.00);
    assert.strictEqual(seniorResult.finalTotal, 510.00);
    console.log('  ✓ [CONTRACT #01 PASSED] Senior Customer Discount (15% for age>=60 & total>500)');

    // Behavioral Contract #02: Bulk Order Volume Discount
    // GIVEN order.items.length >= 10
    // EXPECT discount = 10%
    const bulkItems = Array.from({ length: 12 }, (_, i) => ({ price: 10, quantity: 1 }));
    const bulkResult = pricingService.calculateDiscount({ age: 30 }, { total: 120, items: bulkItems });
    assert.strictEqual(bulkResult.discountRate, 0.10, 'Contract #02 Failure: Expected 10% discount');
    console.log('  ✓ [CONTRACT #02 PASSED] Bulk Order Volume Discount (10% for items>=10)');

    // Behavioral Contract #03: VIP Loyalty Tier
    const vipResult = pricingService.calculateDiscount({ tier: 'VIP' }, { total: 300, items: [] });
    assert.strictEqual(vipResult.discountRate, 0.05, 'Contract #03 Failure: Expected 5% discount');
    console.log('  ✓ [CONTRACT #03 PASSED] VIP Loyalty Tier Discount');

    return true;
}

if (require.main === module) {
    runPricingTests();
}

module.exports = runPricingTests;
