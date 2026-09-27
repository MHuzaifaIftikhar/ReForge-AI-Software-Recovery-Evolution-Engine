// Standalone test suite runner for legacy-shop
// Executes cleanly in standard Node environments without external test dependencies

const runPricingTests = require('./pricing.test');
const runPaymentTests = require('./payment.test');

async function main() {
    console.log('========================================');
    console.log('  legacy-shop Test Suite Runner');
    console.log('========================================');
    let passed = 0;
    let failed = 0;
    const startTime = Date.now();

    try {
        await runPricingTests();
        passed += 4;
    } catch (err) {
        console.error('FAIL: Pricing tests:', err.message);
        failed += 1;
    }

    try {
        await runPaymentTests();
        passed += 3;
    } catch (err) {
        console.error('FAIL: Payment tests:', err.message);
        failed += 1;
    }

    const duration = Date.now() - startTime;
    console.log('========================================');
    console.log(`Summary: ${passed} passed, ${failed} failed (${duration}ms)`);
    console.log('========================================');

    if (failed > 0) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
});
