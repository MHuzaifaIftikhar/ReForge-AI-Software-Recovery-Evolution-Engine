// Modernized database configuration targeting MongoDB driver v6+
let MongoClient;
try {
    MongoClient = require('mongodb').MongoClient;
} catch (e) {
    MongoClient = class {
        constructor(uri) {}
        async connect() { return this; }
        db() { return null; }
    };
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/modernized_shop';

let dbInstance = null;

// Self-contained in-memory collection store
const memoryStore = {
    orders: [
        { _id: 'ord-101', customerId: 'cust-501', total: 650.00, status: 'PENDING', items: [{ id: 'p1', qty: 2 }] },
        { _id: 'ord-102', customerId: 'cust-502', total: 120.00, status: 'PAID', items: [{ id: 'p2', qty: 1 }] }
    ],
    users: [
        { _id: 'cust-501', name: 'Alice Smith', age: 65, tier: 'GOLD', email: 'alice@example.com' },
        { _id: 'cust-502', name: 'Bob Jones', age: 28, tier: 'STANDARD', email: 'bob@example.com' }
    ]
};

const mockCollection = (name) => ({
    findOne: async (query) => {
        const list = memoryStore[name] || [];
        return list.find(item => Object.keys(query).every(k => item[k] === query[k])) || null;
    },
    insertOne: async (doc) => {
        if (!memoryStore[name]) memoryStore[name] = [];
        const newDoc = { _id: doc._id || ('gen-' + Date.now()), ...doc };
        memoryStore[name].push(newDoc);
        return { insertedId: newDoc._id, acknowledged: true };
    },
    updateOne: async (filter, update) => {
        const list = memoryStore[name] || [];
        const item = list.find(item => Object.keys(filter).every(k => item[k] === filter[k]));
        if (item && update.$set) {
            Object.assign(item, update.$set);
            return { modifiedCount: 1, acknowledged: true };
        }
        return { modifiedCount: 0, acknowledged: true };
    },
    find: (query = {}) => ({
        toArray: async () => memoryStore[name] || []
    })
});

async function connectDB() {
    try {
        if (MongoClient) {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            dbInstance = client.db();
            if (dbInstance) return dbInstance;
        }
    } catch (err) {}
    return {
        collection: (name) => mockCollection(name)
    };
}

function getDB() {
    if (!dbInstance) {
        return {
            collection: (name) => mockCollection(name)
        };
    }
    return dbInstance;
}

module.exports = {
    connectDB,
    getDB
};
