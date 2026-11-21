const mongodb = require('../db/connect')
const ObjectId = require('mongodb').ObjectId

const getAllBooks = async (req, res, next) => {
	const results = await mongodb.getDb().collection('Books').find()
	results.toArray().then((lists) => {
		res.setHeader('Content-Type', 'application/json')
		res.status(200).json(lists)
	})
}

const getBookById = async (req, res, next) => {
	const bookId = new ObjectId(req.params.id)
	const result = await mongodb.getDb().collection('Books').find({ _id: bookId })
	result.toArray().then((lists) => {
		res.setHeader('Content-Type', 'application/json')
		res.status(200).json(lists[0])
	})
}

const createBook = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The book to create.',
  schema: { $ref: '#/definitions/Book' }
	
} */
	const book = {
		authorId: req.body.authorId,
		title: req.body.title,
		publicationDate: req.body.publicationDate,
		pageCount: req.body.pageCount,
		description: req.body.description,
		language: req.body.language,
		topicId: req.body.topicId,
	}
	const response = await mongodb.getDb().collection('books').insertOne(book)
	if (response.acknowledged) {
		res.status(201).json(response)
	} else {
		res
			.status(500)
			.json(response.error || 'Some error occurred while creating the book.')
	}
}

const updateBook = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The book to update.',
  schema: { $ref: '#/definitions/Book' }
	
} */
	const userId = new ObjectId(req.params.id)
	const book = req.body
	const result = await mongodb
		.getDb()
		.collection('books')
		.updateOne({ _id: userId }, { $set: book })
	if (result.matchedCount === 0) {
		return res.status(404).json({ message: 'Book not found' })
	}
	res.status(200).json({ message: 'Book updated successfully' })
}

const deleteBook = async (req, res) => {
	const userId = new ObjectId(req.params.id)
	const result = await mongodb
		.getDb()
		.collection('books')
		.deleteOne({ _id: userId })
	if (result.deletedCount === 0) {
		return res.status(404).json({ message: 'Book not found' })
	}
	res.status(200).json({ message: 'Book deleted successfully' })
}

module.exports = {
	getAllBooks,
	getBookById,
	createBook,
	updateBook,
	deleteBook,
}
