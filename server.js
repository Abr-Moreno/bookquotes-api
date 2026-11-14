require('dotenv').config();

const express = require('express');

// Imports the database connection module.
//const mongodb = require('./db/connect');

// Import 'configured' routers for different endpoints

// Creates the Express application through the express() function.
const app = express();

// Registers Auth0 authentication middleware globally.
// Making authentication available throughout the application.
//app.use(authMiddleware);

// Middleware to parse JSON bodies in requests:
app.use(express.json());

/* =============
Routes
==============*/
app.get('/', (req, res) => {
  res.send('BookQuotes API is running.');
});

// Use either the port provided by the production environment, or 3000 locally.
const PORT = process.env.PORT || 3000;

// When db is up: If database connection successful, the server starts listening.
// If there's an error connecting to the database, it logs the error.
// Prevents app from accepting requests when database isn't available.
const startServer = async () => {
  try {
    // Use when database is available.
    //await mongodb.initDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

// Starts the server - successful if the database connects.
startServer();