// Modernized Order Service
const orderRepository = require('../repositories/orderRepository');
const pricingService = require('./pricing');

class OrderService {
    async createOrder(customerId, items, customerProfile) {
        if (!items || items.length === 0) {
            throw new Error('VALIDATION_ERROR: Order must contain at least one item');
        }

        const subtotal = pricingService.calculateSubtotal(items);
        const discountCalc = pricingService.calculateDiscount(customerProfile, { total: subtotal, items });
        const taxCalc = pricingService.applyTax(discountCalc.finalTotal);

        const orderRecord = {
            customerId,
            items,
            subtotal,
            discount: discountCalc.discountAmount,
            appliedRule: discountCalc.appliedRule,
            tax: taxCalc.taxAmount,
            total: taxCalc.totalWithTax,
            status: 'PENDING',
            createdAt: new Date()
        };

        const orderId = await orderRepository.createOrder(orderRecord);
        return {
            orderId,
            ...orderRecord
        };
    }

    async getOrder(orderId) {
        return await orderRepository.findById(orderId);
    }
}

module.exports = new OrderService();
