/*
- MAIN IDEA:

- Generates the OpenAPI specification for BookQuotes API.

- swagger-autogen examines the routes and generates swagger.json.
- Swagger UI will then use it to display the API documentation.
- npm install --save-dev swagger-autogen --> Installs the swagger-autogen package as a
    development dependency to generate the OpenAPI specification.
=====================================================================
=====================================================================*/

// Imports swagger-autogen module.
const swaggerAutogen = require('swagger-autogen')()

/*
Determines which server the documentation should target:
- Locally: If RENDER_EXTERNAL_URL isn't set - it targets: http://localhost:3000.
- Render: Render will provide RENDER_EXTERNAL_URL - script will use that URL.
*/
const serverUrl = process.env.RENDER_EXTERNAL_URL
	? new URL(process.env.RENDER_EXTERNAL_URL)
	: new URL('http://localhost:3000')

// Describes the API
const doc = {
	info: {
		title: 'BookQuotes API',
		description: `
    BookQuotes is a REST API for exploring books and authors through quotes and the ideas behind them.

    Authentication:
    Public users can retrieve and explore the library's information through the API.
    Authenticated users can add, update, and delete library resources.

    User authentication and account management are handled through Auth0's hosted login using express-openid-connect. The application maintains an authenticated session after succssful login.

    Authors:
    Users can retrive information about authors.
    Authenticated users can create, read, update, and delete authors.

    Books:
    Users can retrive information about books.
    Authenticated users can create, read, update, and delete books.

    Quotes:
    Users can retrive information about quotes.
    Authenticated users can create, read, update, and delete quotes.

    Topics:
    Topics provide information for exploring ideas connected to authors, books, and quotes.
    Topics are read-only for all users and are publicly readable through the topics endpoint.
    `,
	},

	// Use hostname and protocol for current deployed environment.
	host: serverUrl.host,
	schemes: [serverUrl.protocol.replace(':', '')],
	'@definitions': {
		Author: {
			type: 'object',
			required: ['name'],
			properties: {
				name: {
					type: 'string',
					minLength: 1,
					example: 'Miguel de Cervantes Saavedra',
				},
				birthplace: {
					type: 'string',
					'x-nullable': true,
					example: 'Alcalá de Henares, Spain',
				},
				birthDate: {
					type: 'string',
					format: 'date-time',
					'x-nullable': true,
					example: '1547-09-29',
				},
				deathDate: {
					type: 'string',
					format: 'date-time',
					'x-nullable': true,
					example: '1616-04-22',
				},
				topicIds: {
					type: 'array',
					uniqueItems: true,
					items: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
					example: ['507f1f77bcf86cd799439013'],
				},
			},
		},

		Book: {
			type: 'object',
			required: ['authorId', 'title'],
			properties: {
				authorId: {
					type: 'string',
					pattern: '^[a-fA-F0-9]{24}$',
					description: 'ID of the author associated with this book.',
					example: '507f1f77bcf86cd799439011',
				},
				title: {
					type: 'string',
					minLength: 1,
					example: 'Don Quixote',
				},
				publicationDate: {
					type: 'string',
					format: 'date-time',
					'x-nullable': true,
					example: '1605-01-01',
				},
				pageCount: {
					type: 'integer',
					minimum: 0,
					example: 950,
				},
				description: {
					type: 'string',
					'x-nullable': true,
					example: 'A would-be knight sets out with his squire, Sancho Panza.',
				},
				language: {
					type: 'string',
					'x-nullable': true,
					example: 'Spanish',
				},
				topicId: {
					type: 'string',
					pattern: '^[a-fA-F0-9]{24}$',
					'x-nullable': true,
					example: '507f1f77bcf86cd799439013',
				},
			},
		},

		Quote: {
			type: 'object',
			required: ['bookId', 'quote'],
			properties: {
				bookId: {
					type: 'string',
					pattern: '^[a-fA-F0-9]{24}$',
					description: 'ID of the book this quote comes from.',
					example: '507f1f77bcf86cd799439012',
				},
				quote: {
					type: 'string',
					minLength: 1,
					example:
						'Freedom, Sancho, is one of the most precious gifts that heaven has bestowed upon men.',
				},
				context: {
					type: 'string',
					'x-nullable': true,
					example:
						'Don Quixote speaks to Sancho about freedom in Part II, Chapter 58.',
				},
				topicIds: {
					type: 'array',
					uniqueItems: true,
					items: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
					example: ['507f1f77bcf86cd799439013'],
				},
			},
		},

		Topic: {
			type: 'object',
			required: ['_id', 'name', 'definition'],
			properties: {
				_id: {
					type: 'string',
					readOnly: true,
					description: 'MongoDB ID returned with the topic.',
					example: '507f1f77bcf86cd799439013',
				},
				name: {
					type: 'string',
					minLength: 1,
					example: 'Freedom',
				},
				definition: {
					type: 'string',
					minLength: 1,
					example:
						'The ability to make choices and act without undue restraint.',
				},
			},
		},
		Error: {
			type: 'object',
			required: ['error'],
			properties: {
				error: {
					type: 'string',
					example:
						'Invalid topic ID. Use a 24-character hexadecimal MongoDB ID.',
				},
			},
		},
		Message: {
			type: 'object',
			required: ['message'],
			properties: {
				message: {
					type: 'string',
					example: 'Topic not found',
				},
			},
		},
	},
}

// Location where the generated OpenAPI specification is saved.
const outputFile = './swagger.json'

// Start examining the app at server.js.
// The authors, books, quotes, and topics routers are mounted in server.js.
const endpointsFiles = ['./server.js']

// Generates the OpenAPI specification.
swaggerAutogen(outputFile, endpointsFiles, doc)
