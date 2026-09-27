// Modernized test suite runner
const runPricingTests = require('./pricing.test');
const runPaymentTests = require('./payment.test');

async function main() {
    console.log('========================================');
    console.log('  modernized-shop Test Suite Runner');
    console.log('========================================');
    let passed = 0;
    let failed = 0;
    const startTime = Date.now();

    try {
        await runPricingTests();
        passed += 5;
    } catch (err) {
        console.error('FAIL: Modernized pricing tests:', err.message);
        failed += 1;
    }

    try {
        await runPaymentTests();
        passed += 3;
    } catch (err) {
        console.error('FAIL: Modernized payment tests:', err.message);
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
