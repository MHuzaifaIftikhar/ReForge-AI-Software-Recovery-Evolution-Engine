// Unit tests for PricingService
const assert = require('assert');
const pricingService = require('../services/pricing');

function runPricingTests() {
    console.log('--- Running PricingService Tests ---');
    
    // Test 1: Subtotal calculation
    const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
    ];
    const subtotal = pricingService.calculateSubtotal(items);
    assert.strictEqual(subtotal, 250, 'Subtotal should be 250');
    console.log('  ✓ calculates item subtotal correctly');

    // Test 2: Standard pricing with no discount
    const standardCustomer = { age: 30, tier: 'STANDARD' };
    const standardOrder = { total: 300, items: [{ price: 150, quantity: 2 }] };
    const standardResult = pricingService.calculateDiscount(standardCustomer, standardOrder);
    assert.strictEqual(standardResult.discountRate, 0.0, 'Standard customer discount rate should be 0');
    assert.strictEqual(standardResult.finalTotal, 300, 'Final total should match order total');
    console.log('  ✓ applies zero discount to standard customer under threshold');

    // Test 3: Senior Customer Discount (Undocumented rule)
    const seniorCustomer = { age: 65, tier: 'STANDARD' };
    const largeOrder = { total: 600, items: [{ price: 200, quantity: 3 }] };
    const seniorResult = pricingService.calculateDiscount(seniorCustomer, largeOrder);
    assert.strictEqual(seniorResult.discountRate, 0.15, 'Senior customer discount rate should be 15%');
    assert.strictEqual(seniorResult.discountAmount, 90, 'Discount amount should be $90');
    assert.strictEqual(seniorResult.finalTotal, 510, 'Final total should be $510');
    console.log('  ✓ applies 15% senior discount for customer >= 60 and total > 500');

    // Test 4: Tax calculation
    const taxResult = pricingService.applyTax(500, 'US-CA');
    assert.strictEqual(taxResult.taxAmount, 41.25, 'California tax on $500 should be 41.25');
    console.log('  ✓ calculates regional sales tax correctly');

    return true;
}

if (require.main === module) {
    runPricingTests();
}

module.exports = runPricingTests;
