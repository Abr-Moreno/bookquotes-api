const mongodb = require('../db/connect')
const ObjectId = require('mongodb').ObjectId

const getAllAuthors = async (req, res, next) => {
	const results = await mongodb.getDb().collection('Authors').find()
	results.toArray().then((lists) => {
		res.setHeader('Content-Type', 'application/json')
		res.status(200).json(lists)
	})
}

const getAuthorById = async (req, res, next) => {
	const authorId = new ObjectId(req.params.id)
	const result = await mongodb
		.getDb()
		.collection('Authors')
		.find({ _id: authorId })
	result.toArray().then((lists) => {
		res.setHeader('Content-Type', 'application/json')
		res.status(200).json(lists[0])
	})
}

const createAuthor = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The author to create.',
  schema: { $ref: '#/definitions/Author' }
	
} */
	const author = {
		name: req.body.name,
		birthplace: req.body.birthplace,
		birthDate: req.body.birthDate,
		deathDate: req.body.deathDate,
		topicIds: req.body.topicIds,
	}
	const response = await mongodb.getDb().collection('authors').insertOne(author)
	if (response.acknowledged) {
		res.status(201).json(response)
	} else {
		res
			.status(500)
			.json(response.error || 'Some error occurred while creating the author.')
	}
}

const updateAuthor = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The author to update.',
  schema: { $ref: '#/definitions/Author' }
	
} */
	const userId = new ObjectId(req.params.id)
	const author = req.body
	const result = await mongodb
		.getDb()
		.collection('authors')
		.updateOne({ _id: userId }, { $set: author })
	if (result.matchedCount === 0) {
		return res.status(404).json({ message: 'Author not found' })
	}
	res.status(200).json({ message: 'Author updated successfully' })
}

const deleteAuthor = async (req, res) => {
	const userId = new ObjectId(req.params.id)
	const result = await mongodb
		.getDb()
		.collection('authors')
		.deleteOne({ _id: userId })
	if (result.deletedCount === 0) {
		return res.status(404).json({ message: 'Author not found' })
	}
	res.status(200).json({ message: 'Author deleted successfully' })
}

module.exports = {
	getAllAuthors,
	getAuthorById,
	createAuthor,
	updateAuthor,
	deleteAuthor,
}
