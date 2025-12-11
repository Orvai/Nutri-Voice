import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Nutri-App Gateway API",
    version: "1.0.0",
    description: "Public API of the Gateway aggregating all microservices",
  },
  servers: [
    {
      url: "http://localhost:4000/api", 
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/routes/*.js",
    "./src/routes/**/*.js",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
