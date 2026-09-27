// Pricing Service - Handles order discount calculations and taxes
// NOTE: Contains undocumented business logic inherited from legacy billing system

class PricingService {
    /**
     * Calculate order item subtotal
     * @param {Array} items 
     * @returns {number}
     */
    calculateSubtotal(items) {
        if (!items || !items.length) return 0;
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    /**
     * Calculate applicable discounts for an order
     * @param {Object} customer - { age, tier, memberSince }
     * @param {Object} order - { total, items }
     * @returns {Object} - { discountRate, discountAmount, finalTotal }
     */
    calculateDiscount(customer, order) {
        let discount = 0.0;
        let appliedRule = 'STANDARD_PRICE';

        // Check customer volume threshold
        if (order.items && order.items.length >= 10) {
            discount = 0.10;
            appliedRule = 'BULK_ORDER_DISCOUNT';
        }

        // Tier based loyalty adjustment
        if (customer && customer.tier === 'VIP' && order.total > 200) {
            if (discount < 0.05) {
                discount = 0.05;
                appliedRule = 'VIP_LOYALTY_DISCOUNT';
            }
        }

        // =====================================================================
        // Undocumented Senior Customer Pricing Rule
        // =====================================================================
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

    /**
     * Apply regional sales tax
     */
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
