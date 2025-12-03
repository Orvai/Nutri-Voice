// gateway/src/swagger/swagger.js
import swaggerUi from "swagger-ui-express";
import { zodSchemas } from "./zod-schemas.js";
import { authSchemas } from "./components/auth.schemas.js";
import { userSchemas } from "./components/user.schemas.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Nutri-App Gateway API",
    version: "1.0.0",
    description: "Public API for Coach & Client Dashboard",
  },
  servers: [
    {
      url: "http://localhost:4000/api",
      description: "Local Gateway",
    },
  ],
  components: {
    schemas: {
      ...authSchemas,
      ...userSchemas,
      ...zodSchemas,
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export function registerSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
