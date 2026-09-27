// Modernized Order Repository
const { getDB } = require('../config/database');

class OrderRepository {
    constructor() {
        this.collectionName = 'orders';
    }

    getCollection() {
        const db = getDB();
        return db.collection(this.collectionName);
    }

    async findById(orderId) {
        const collection = this.getCollection();
        return await collection.findOne({ _id: orderId });
    }

    async createOrder(orderData) {
        const collection = this.getCollection();
        const result = await collection.insertOne({
            ...orderData,
            createdAt: new Date()
        });
        return result.insertedId;
    }

    async updatePaymentStatus(orderId, paymentStatus, transactionDetails) {
        const collection = this.getCollection();
        const updateResult = await collection.updateOne(
            { _id: orderId },
            {
                $set: {
                    status: paymentStatus,
                    paymentDetails: transactionDetails,
                    updatedAt: new Date()
                }
            }
        );
        return updateResult.modifiedCount > 0;
    }

    async getOrdersByCustomer(customerId) {
        const collection = this.getCollection();
        return await collection.find({ customerId }).toArray();
    }
}

module.exports = new OrderRepository();
