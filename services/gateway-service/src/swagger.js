import swaggerJSDoc from "swagger-jsdoc";
import { zodSchemas } from "./docs/zod-schemas.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Nutri-App Gateway API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:4000/api" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: Object.fromEntries(
        Object.entries(zodSchemas).map(([name, schema]) => {
          const realSchema =
            schema?.definitions?.[name] ||   
            schema?.schema ||                
            schema;                          
      
          return [name, realSchema];
        })
      ),
        },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/routes/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
