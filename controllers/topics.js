const mongodb = require('../db/connect')
const ObjectId = require('mongodb').ObjectId

const getAllTopics = async (req, res, next) => {
	/*
	#swagger.responses[200] = {
		description: 'All topics.',
		schema: [{ $ref: '#/definitions/Topic' }]
	}
	#swagger.responses[500] = {
		description: 'Unexpected database or server error.',
		schema: { $ref: '#/definitions/Error' }
	}
	*/
	try {
		const topics = await mongodb.getDb().collection('Topics').find().toArray()

		return res.status(200).json(topics)
	} catch (error) {
		console.error('Error fetching topics:', error)

		return res.status(500).json({
			error: 'An unexpected error occurred while fetching topics.',
		})
	}
}

const getTopicById = async (req, res) => {
	/*
	#swagger.parameters['id'] = {
		in: 'path',
		required: true,
		type: 'string',
		description: 'A 24-character hexadecimal MongoDB topic ID.'
	}
	#swagger.responses[200] = {
		description: 'The requested topic.',
		schema: { $ref: '#/definitions/Topic' }
	}
	#swagger.responses[400] = {
		description: 'Invalid topic ID.',
		schema: { $ref: '#/definitions/Error' }
	}
	#swagger.responses[404] = {
		description: 'Topic not found.',
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
			error: 'Invalid topic ID. Use a 24-character hexadecimal MongoDB ID.',
		})
	}

	try {
		const topic = await mongodb
			.getDb()
			.collection('Topics')
			.findOne({ _id: new ObjectId(id) })

		if (!topic) {
			return res.status(404).json({ message: 'Topic not found' })
		}

		return res.status(200).json(topic)
	} catch (error) {
		console.error('Error fetching topic:', error)

		return res.status(500).json({
			error: 'An unexpected error occurred while fetching the topic.',
		})
	}
}

const createTopic = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The topic to create.',
  schema: { $ref: '#/definitions/Topic' }
	
} */
	const topic = {
		name: req.body.name,
		definition: req.body.definition,
	}
	const response = await mongodb.getDb().collection('Topics').insertOne(topic)
	if (response.acknowledged) {
		res.status(201).json(response)
	} else {
		res
			.status(500)
			.json(response.error || 'Some error occurred while creating the topic.')
	}
}

const updateTopic = async (req, res) => {
	/* #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: 'The topic to update.',
  schema: { $ref: '#/definitions/Topic' }
	
} */
	const userId = new ObjectId(req.params.id)
	const topic = req.body
	const result = await mongodb
		.getDb()
		.collection('Topics')
		.updateOne({ _id: userId }, { $set: topic })
	if (result.matchedCount === 0) {
		return res.status(404).json({ message: 'Topic not found' })
	}
	res.status(200).json({ message: 'Topic updated successfully' })
}

const deleteTopic = async (req, res) => {
	const userId = new ObjectId(req.params.id)
	const result = await mongodb
		.getDb()
		.collection('Topics')
		.deleteOne({ _id: userId })
	if (result.deletedCount === 0) {
		return res.status(404).json({ message: 'Topic not found' })
	}
	res.status(200).json({ message: 'Topic deleted successfully' })
}

module.exports = {
	getAllTopics,
	getTopicById,
	createTopic,
	updateTopic,
	deleteTopic,
}
