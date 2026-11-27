/*
MAIN IDEA:
==========

- Express middleware that uses Joi to validate incoming Book request bodies.
- Checks required fields, data types, and formatting.
- Allows optional fields to be omitted or set to null where permitted.
- Rejects fields that are not part of the Book schema.
*/

// Imports Joi validation library
const Joi = require('joi');

// Defines the expected shape and rules for a Book
const bookSchema = Joi.object({
  // Required: must be a valid MongoDB ObjectId represented as a string
  authorId: Joi.string().hex().length(24).required(),

  // Required: must be a nonempty string
  title: Joi.string().trim().min(1).required(),

  // Optional: must be a date or null
  publicationDate: Joi.date().allow(null),

  // Optional: must be a whole number greater than or equal to 1
  pageCount: Joi.number().integer().min(1),

  // Optional: must be a string or null
  description: Joi.string().trim().allow('', null),

  // Optional: must be a string or null
  language: Joi.string().trim().allow('', null),

  topicIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .unique(),
}).unknown(false);

// Validates the request body before it reaches the controller
const validateBook = (req, res, next) => {
  const { error, value } = bookSchema.validate(req.body, {
    abortEarly: false,
  });

  // If validation fails, stop the request
  if (error) {
    return res.status(400).json({
      error: 'Invalid book data.',
      details: error.details.map((detail) => detail.message),
    });
  }

  // Replace the request body with the validated data
  req.body = value;

  // Continue to the controller
  next();
};

module.exports = validateBook;
