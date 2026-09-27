// Modernized Pricing Service with verified institutional business rules
class PricingService {
    calculateSubtotal(items) {
        if (!items || !items.length) return 0;
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    /**
     * Calculate applicable discounts based on verified institutional business rules
     */
    calculateDiscount(customer, order) {
        let discount = 0.0;
        let appliedRule = 'STANDARD_PRICE';

        // Verified Rule: Bulk Order Discount
        if (order.items && order.items.length >= 10) {
            discount = 0.10;
            appliedRule = 'BULK_ORDER_DISCOUNT';
        }

        // Verified Rule: VIP Loyalty Discount
        if (customer && customer.tier === 'VIP' && order.total > 200) {
            if (discount < 0.05) {
                discount = 0.05;
                appliedRule = 'VIP_LOYALTY_DISCOUNT';
            }
        }

        // Verified Institutional Rule: Senior Customer Discount (Preserved from legacy recovery)
        if (customer.age >= 60 && order.total > 500) {
            discount = 0.15;
            appliedRule = 'SENIOR_CUSTOMER_DISCOUNT';
        }

        const discountAmount = Number((order.total * discount).toFixed(2));
        const finalTotal = Number((order.total - discountAmount).toFixed(2));

        return {
            originalTotal: order.total,
            discountRate: discount,
            discountAmount,
            finalTotal,
            appliedRule
        };
    }

    applyTax(subtotal, region = 'US-CA') {
        const taxRates = {
            'US-CA': 0.0825,
            'US-NY': 0.08875,
            'DEFAULT': 0.05
        };
        const rate = taxRates[region] || taxRates['DEFAULT'];
        const taxAmount = Number((subtotal * rate).toFixed(2));
        return {
            taxRate: rate,
            taxAmount,
            totalWithTax: Number((subtotal + taxAmount).toFixed(2))
        };
    }
}

module.exports = new PricingService();
