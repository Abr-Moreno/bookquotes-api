/*
- MAIN IDEA:

- Builds/configures an Express router, then exports that configured
  router so server.js can mount and use it under: /authors.
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

// Access to controllers/authors.js file:
const authorsController = require('../controllers/authors');

// Creates a router object to define authors routes
const router = express.Router();

/*=======================================================================
  ROUTES --> GET: all, GET: by ID, POST, PUT, DELETE
========================================================================*/

// GET all authors
router.get('/', authorsController.getAllAuthors);

// GET a single author by ID
router.get('/:id', authorsController.getAuthorById);

// POST a new author
router.post('/', authorsController.createAuthor);

// PUT (update) an existing author (by ID)
router.put('/:id', authorsController.updateAuthor);

// DELETE an author (by ID)
router.delete('/:id', authorsController.deleteAuthor);


// Export authors router to be used in server.js
module.exports = router;