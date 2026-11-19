
require('dotenv').config();

const { initDb, getDb } = require('./connect');

// Common validation rules
const objectId = { bsonType: 'objectId' };
const optionalString = { bsonType: ['string', 'null'] };
const optionalDate = { bsonType: ['date', 'null'] };

const topicIds = {
    bsonType: 'array',
    uniqueItems: true,
    items: objectId
};

// Schema definitions for Book_DB
const schemas = {
    Authors: {
        bsonType: 'object',
        required: ['name'],
        properties: {
            _id: objectId,
            name: { bsonType: 'string', minLength: 1 },
            birthplace: optionalString,
            birthDate: optionalDate,
            deathDate: optionalDate,
            topicIds
        }
    },

    Books: {
        bsonType: 'object',
        required: ['authorId', 'title'],
        properties: {
            _id: objectId,
            authorId: objectId,
            title: { bsonType: 'string', minLength: 1 },
            publicationDate: optionalDate,
            pageCount: {
                bsonType: ['int', 'long'],
                minimum: 0
            },
            description: optionalString,
            language: optionalString,
            topicId: {
                bsonType: ['objectId', 'null']
            }
        }
    },

    Quotes: {
        bsonType: 'object',
        required: ['bookId', 'quote'],
        properties: {
            _id: objectId,
            bookId: objectId,
            quote: { bsonType: 'string', minLength: 1 },
            context: optionalString,
            topicIds
        }
    },

    Topics: {
        bsonType: 'object',
        required: ['name', 'definition'],
        properties: {
            _id: objectId,
            name: { bsonType: 'string', minLength: 1 },
            definition: { bsonType: 'string', minLength: 1 }
        }
    }
};

// Update validation for existing collections
async function setupDatabase() {
    await initDb();

    const db = getDb();

    for (const [collection, schema] of Object.entries(schemas)) {
        await db.command({
            collMod: collection,
            validator: {
                $jsonSchema: schema
            },
            validationLevel: 'strict',
            validationAction: 'error'
        });

        console.log(`Validation configured: ${collection}`);
    }

    console.log('All database schemas configured.');
}

setupDatabase()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Database setup failed:', error);
        process.exit(1);
    });
