export const userSchemas = {
    UserPublic: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        role: { type: "string", enum: ["coach", "client"] },
        firstName: { type: "string" },
        lastName: { type: "string" },
        imageUrl: { type: "string", nullable: true },
      },
    },
  
    UserProfileResponse: {
      type: "object",
      properties: {
        user: { $ref: "#/components/schemas/UserPublic" },
      },
    },
  };
  