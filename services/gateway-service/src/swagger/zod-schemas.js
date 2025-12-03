// gateway/src/swagger/zod-schemas.js
import { UserProfileDto } from "../dtos/user.dto.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const zodSchemas = {
  UserProfile: zodToJsonSchema(UserProfileDto, "UserProfile"),
};
