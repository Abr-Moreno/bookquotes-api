/*
- MAIN IDEA:

- Builds/configures an Express router, then exports that configured
  router so server.js can mount and use it under: /books.
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

// Access to controllers/books.js file:
const booksController = require('../controllers/books');

// Creates a router object to define books routes
const router = express.Router();

/*=======================================================================
  ROUTES --> GET: all, GET: by ID, POST, PUT, DELETE
========================================================================*/

// GET all books
router.get('/', booksController.getAllBooks);

// GET a single book by ID
router.get('/:id', booksController.getBookById);

// POST a new book
router.post('/', booksController.createBook);

// PUT (update) an existing book (by ID)
router.put('/:id', booksController.updateBook);

// DELETE a book (by ID)
router.delete('/:id', booksController.deleteBook);


// Export books router to be used in server.js
module.exports = router;