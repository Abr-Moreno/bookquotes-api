require('dotenv').config();
const { MongoClient } = require('mongodb');

const express = require('express');

// Imports the database connection module.
const mongodb = require('./db/connect');

/* ====================================================
  Import 'configured' routers for different endpoints
==================================================== */
const authorsRoutes = require('./routes/authors');
const booksRoutes = require('./routes/books');
const quotesRoutes = require('./routes/quotes');
const topicsRoutes = require('./routes/topics');
// Swagger documentation router
const swaggerRoute = require('./routes/swagger');

// Creates the Express application through the express() function.
const app = express();

// Registers Auth0 authentication middleware globally.
// Making authentication available throughout the application.
//app.use(authMiddleware);

// Middleware to parse JSON bodies in requests:
app.use(express.json());

/* ====================================================
                      ROUTES
==================================================== */
// Home Page route: displays simple message at the root URL.
app.get('/', (req, res) => {
  res.send('BookQuotes API is running.');
});
// Main routes; uses route mounting.
app.use('/authors', authorsRoutes);
app.use('/books', booksRoutes);
app.use('/quotes', quotesRoutes);
app.use('/topics', topicsRoutes);
// Swagger documentation route @ /api-docs
app.use('/api-docs', swaggerRoute);


// Use either the port provided by the production environment, or 3000 locally.
const PORT = process.env.PORT || 3000;

// When db is up: If database connection successful, the server starts listening.
// If there's an error connecting to the database, it logs the error.
// Prevents app from accepting requests when database isn't available.
const startServer = async () => {
  try {
    // Use when database is available.
    await mongodb.initDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

// Starts the server - successful if the database connects.
startServer();