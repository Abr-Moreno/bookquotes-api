/*
MAIN IDEA:
==========

- Express middleware that uses Joi to validate incoming Quote request bodies.
- Checks required fields, data types, and formatting.
- Allows optional fields to be omitted or set to null where permitted.
- Rejects fields that are not part of the Quote schema.
*/

// Imports Joi validation library
const Joi = require('joi');

// Defines the expected shape and rules for a Quote
const quoteSchema = Joi.object({
  // Required: must be a valid MongoDB ObjectId represented as a string
  bookId: Joi.string().hex().length(24).required(),

  // Required: must be a nonempty string
  quote: Joi.string().trim().min(1).required(),

  // Optional: must be a string or null
  context: Joi.string().trim().allow('', null),

  // Optional: must be an array of valid MongoDB ObjectId strings
  topicIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .unique(),
}).unknown(false);

// Validates the request body before it reaches the controller
const validateQuote = (req, res, next) => {
  const { error, value } = quoteSchema.validate(req.body, {
    abortEarly: false,
  });

  // If validation fails, stop the request
  if (error) {
    return res.status(400).json({
      error: 'Invalid quote data.',
      details: error.details.map((detail) => detail.message),
    });
  }

  // Replace the request body with the validated data
  req.body = value;

  // Continue to the controller
  next();
};

module.exports = validateQuote;