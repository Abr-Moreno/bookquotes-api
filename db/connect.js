
const { MongoClient } = require('mongodb');

let client;
let database;

const initDb = async () => {
    if (database) return database;

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing.');
    }

    client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    database = client.db('Book_DB');

    await database.command({ ping: 1 });

    console.log('Connected to MongoDB: Book_DB');

    return database;
};

const getDb = () => {
    if (!database) {
        throw new Error('Database not initialized.');
    }

    return database;
};

module.exports = { initDb, getDb };
