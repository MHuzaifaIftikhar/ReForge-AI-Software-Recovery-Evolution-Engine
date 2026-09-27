// Modernized User Service
const { getDB } = require('../config/database');

class UserService {
    async findById(userId) {
        const db = getDB();
        const user = await db.collection('users').findOne({ _id: userId });
        return user;
    }

    async getProfile(userId) {
        const user = await this.findById(userId);
        if (!user) {
            return {
                _id: userId,
                age: 30,
                tier: 'STANDARD',
                name: 'Guest Customer'
            };
        }
        return user;
    }
}

module.exports = new UserService();
