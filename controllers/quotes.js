const mongodb = require('../db/connect')
const ObjectId = require('mongodb').ObjectId

const getAllQuotes = async (req, res) => {
	/*
	#swagger.responses[200] = {
		description: 'All quotes.',
		schema: [{ $ref: '#/definitions/Quote' }]
	}
	#swagger.responses[500] = {
		description: 'Unexpected database or server error.',
		schema: { $ref: '#/definitions/Error' }
	}
	*/
	try {
		const quotes = await mongodb.getDb().collection('Quotes').find().toArray()

		return res.status(200).json(quotes)
	} catch (error) {
		console.error('Error fetching quotes:', error)

		return res.status(500).json({
			error: 'An unexpected error occurred while fetching quotes.',
		})
	}
}

const getQuoteById = async (req, res) => {
	/*
	#swagger.parameters['id'] = {
		in: 'path',
		required: true,
		type: 'string',
		description: 'A 24-character hexadecimal MongoDB quote ID.'
	}
	#swagger.responses[200] = {
		description: 'The requested quote.',
		schema: { $ref: '#/definitions/Quote' }
	}
	#swagger.responses[400] = {
		description: 'Invalid quote ID.',
		schema: { $ref: '#/definitions/Error' }
	}
	#swagger.responses[404] = {
		description: 'Quote not found.',
		schema: { $ref: '#/definitions/Message' }
	}
	#swagger.responses[500] = {
		description: 'Unexpected database or server error.',
		schema: { $ref: '#/definitions/Error' }
	}
	*/
	const { id } = req.params

	if (!ObjectId.isValid(id)) {
		return res.status(400).json({
			error: 'Invalid quote ID. Use a 24-character hexadecimal MongoDB ID.',
		})
	}

	try {
		const quote = await mongodb
			.getDb()
			.collection('Quotes')
			.findOne({ _id: new ObjectId(id) })

		if (!quote) {
			return res.status(404).json({ message: 'Quote not found' })
		}

		return res.status(200).json(quote)
	} catch (error) {
		console.error('Error fetching quote:', error)

		return res.status(500).json({
			error: 'An unexpected error occurred while fetching the quote.',
		})
	}
}

const createQuote = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The quote to create.',
  schema: { $ref: '#/definitions/Quote' }
	
} */
	const quote = {
		bookId: req.body.bookId,
		quote: req.body.quote,
		context: req.body.context,
		topicIds: req.body.topicIds,
	}
	try {
		const response = await mongodb.getDb().collection('Quotes').insertOne(quote)

		if (!response.acknowledged) {
			return res.status(500).json({
				error: 'Unable to create the quote.',
			})
		}

		return res.status(201).json(response)
	} catch (error) {
		console.error('Error creating quote:', error)

		return res.status(500).json({
			error: 'An unexpected error occurred while creating the quote.',
		})
	}
}

const updateQuote = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The quote to update.',
  schema: { $ref: '#/definitions/Quote' }
	
} */
	const validationError = validateQuote(req.body)
	if (validationError) {
		return res.status(400).json({ error: validationError })
	}
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json({
			error: 'Invalid quote ID. Use a 24-character hexadecimal MongoDB ID.',
		})
	}
	const userId = new ObjectId(req.params.id)
	const quote = {
		bookId: req.body.bookId,
		quote: req.body.quote,
		context: req.body.context,
		topicIds: req.body.topicIds,
	}
	try {
		const result = await mongodb
			.getDb()
			.collection('Quotes')
			.updateOne({ _id: userId }, { $set: quote })

		if (result.matchedCount === 0) {
			return res.status(404).json({ message: 'Quote not found' })
		}

		return res.status(200).json({
			message: 'Quote updated successfully',
		})
	} catch (error) {
		console.error('Error updating quote:', error)

		return res.status(500).json({
			error: 'An unexpected error occurred while updating the quote.',
		})
	}
}

const deleteQuote = async (req, res) => {
	const userId = new ObjectId(req.params.id)
	const result = await mongodb
		.getDb()
		.collection('Quotes')
		.deleteOne({ _id: userId })
	if (result.deletedCount === 0) {
		return res.status(404).json({ message: 'Quote not found' })
	}
	res.status(200).json({ message: 'Quote deleted successfully' })
}

module.exports = {
	getAllQuotes,
	getQuoteById,
	createQuote,
	updateQuote,
	deleteQuote,
}
