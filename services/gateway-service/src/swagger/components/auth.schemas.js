export const authSchemas = {
    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "coach@test.com"
        },
        password: {
          type: "string",
          example: "123456"
        }
      }
    },
  
    UserPublic: {
      type: "object",
      properties: {
        id: { type: "string", example: "34187088-cbb4" },
        email: { type: "string", example: "coach@test.com" },
        role: { type: "string", enum: ["coach", "client"], example: "coach" },
        firstName: { type: "string", example: "Orgad" },
        lastName: { type: "string", example: "Vaitzman" },
        imageUrl: {
          type: "string",
          nullable: true,
          example: "https://cdn.example.com/avatar1.png"
        }
      }
    },
  
    LoginResponse: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        user: { $ref: "#/components/schemas/UserPublic" }
      }
    }
  };
  