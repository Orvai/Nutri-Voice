const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas'); // adjust path if necessary

const swaggerDefinition = {
    openapi: '3.0.0',
    info: { title: 'IDM Service API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
        schemas: {
            ...dtoSchemas, // spread the Zod-derived schemas here
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: [
        './src/controllers/*.js',
        './src/docs/jsdoc-schemas.js', // include the file with your schema definitions
    ]
};

module.exports = swaggerJSDoc(options);