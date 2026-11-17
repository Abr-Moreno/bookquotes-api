/*
- MAIN IDEA:

- Builds/configures an Express router, then exports that configured
  router so server.js can mount and use it under: /topics.
- Router will route requests to the corresponding controller functions:
- Get & Get by ID only:
- public endpoint; allows users to freely explore the library.
-
- No Authentication or data validation needed for public GET requests.
=====================================================================
=====================================================================*/

// Needed to create a router
const express = require('express');

// Access to controllers/topics.js file:
const topicsController = require('../controllers/topics');

// Creates a router object to define topics routes
const router = express.Router();

/*=======================================================================
  ROUTES --> GET: all & GET: by ID
========================================================================*/

// GET all topics
router.get('/', topicsController.getAllTopics);

// GET a single topic by ID
router.get('/:id', topicsController.getTopicById);


// Export topics router to be used in server.js
module.exports = router;