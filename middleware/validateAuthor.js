/*
MAIN IDEA:
==========

- Express middleware function that uses Joi to validate incoming Author
  request bodies before they reach the controller.
- Ensures the data has the correct types and required fields.
- Allows optional fields to be omitted or set to null.
- Rejects fields that are not part of the Author schema.
- Joi.date() accepts valid date values and converts date strings
- into JavaScript Date objects. Examples:
    "2024-05-15"
    "2024-05-15T10:30:00Z"
    "2024-05-15T10:30:00"
    null
*/

// Imports Joi validation library
const Joi = require('joi')

// Defines the expected shape and rules for an Author
const authorSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),

  birthplace: Joi.string().trim().allow(null),

  birthDate: Joi.date().allow(null),

  deathDate: Joi.date().allow(null),

  topicIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .unique(),
}).unknown(false)

// Validates the request body before it reaches the controller
const validateAuthor = (req, res, next) => {
  const { error, value } = authorSchema.validate(req.body, {
    abortEarly: false,
  })

  // If validation fails, stop the request
  if (error) {
    return res.status(400).json({
      error: 'Invalid author data.',
      details: error.details.map((detail) => detail.message),
    })
  }

  // Replace the request body with the validated/cleaned data
  req.body = value

  // Continue to the controller
  next()
}

module.exports = validateAuthor;