// Legacy database configuration
// WARNING: Uses deprecated MongoClient options from mongodb driver v3.6.3
let MongoClient;
try {
    MongoClient = require('mongodb').MongoClient;
} catch (e) {
    // Mock MongoClient for zero-install demo runner
    MongoClient = class {
        constructor(uri, opts) {}
        async connect() { return this; }
        db() { return null; }
    };
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/legacy_shop';

// Deprecated connection options in Node 12 / mongodb 3.x
const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

let dbInstance = null;

// In-memory mock store for self-contained demonstration execution
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
        return { insertedId: newDoc._id, ops: [newDoc] };
    },
    updateOne: async (filter, update) => {
        const list = memoryStore[name] || [];
        const item = list.find(item => Object.keys(filter).every(k => item[k] === filter[k]));
        if (item && update.$set) {
            Object.assign(item, update.$set);
            return { modifiedCount: 1 };
        }
        return { modifiedCount: 0 };
    },
    find: (query = {}) => ({
        toArray: async () => memoryStore[name] || []
    })
});

async function connectDB() {
    try {
        if (MongoClient) {
            const client = new MongoClient(MONGO_URI, clientOptions);
            await client.connect();
            dbInstance = client.db();
            if (dbInstance) return dbInstance;
        }
    } catch (err) {
        // Fallback to self-contained mock DB for seamless offline demo
    }
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
