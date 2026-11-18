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
const swaggerAutogen = require('swagger-autogen')();

/*
Determines which server the documentation should target:
- Locally: If RENDER_EXTERNAL_URL isn't set - it targets: http://localhost:3000.
- Render: Render will provide RENDER_EXTERNAL_URL - script will use that URL.
*/
const serverUrl = process.env.RENDER_EXTERNAL_URL
  ? new URL(process.env.RENDER_EXTERNAL_URL)
  : new URL('http://localhost:3000');

// Describes the API
const doc = {
  info: {
    title: 'BookQuotes API',
    decription: `
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
    `
  },

  // Use hostname and protocol for current deployed environment.
  host: serverUrl.host,
  schemes: [serverUrl.protocol.replace(':', '')]
};

// Location where the generated OpenAPI specification is saved.
const outputFile = './swagger.json';

// Start examining the app at server.js.
// The authors, books, quotes, and topics routers are mounted in server.js.
const endpointsFiles = ['./server.js'];

// Generates the OpenAPI specification.
swaggerAutogen(outputFile, endpointsFiles, doc);