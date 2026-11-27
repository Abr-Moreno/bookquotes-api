/*
- MAIN IDEA:

- Builds/configures an Express router, then exports that configured
  router so server.js can mount and use it under: /quotes.
- Router will route requests to the corresponding controller functions:
  Get, Get by ID, Post, Put, Delete.
-
-
- Express will run authentication and validation first, then call controller -
  only if those checks succeed.
- If authentication fails, the request is denied.
- If validation fails, sends 400 response and the controller never runs.
=====================================================================
=====================================================================*/

// Needed to create a router
const express = require('express');

// Access to controllers/quotes.js file:
const quotesController = require('../controllers/quotes');

// MongoDB ObjectId validation for URL id parameter
const validateId = require('../middleware/validateId');
// Joi validation for incoming Quote request bodies
const validateQuote = require('../middleware/validateQuote');

// Creates a router object to define quotes routes
const router = express.Router();

/*=======================================================================
  ROUTES --> GET: all, GET: by ID, POST, PUT, DELETE
========================================================================*/

// GET all quotes
router.get('/', quotesController.getAllQuotes);

// GET a single quote by ID
router.get('/:id', validateId, quotesController.getQuoteById);

// POST a new quote
router.post('/', validateQuote, quotesController.createQuote);

// PUT (update) an existing quote (by ID)
router.put('/:id', validateId, validateQuote, quotesController.updateQuote);

// DELETE a quote (by ID)
router.delete('/:id', validateId, quotesController.deleteQuote);


// Export quotes router to be used in server.js
module.exports = router;