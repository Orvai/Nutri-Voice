// gateway/src/dtos/user.dto.js
import { z } from "zod";

export const UserProfileDto = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(["coach", "client"]),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(), // מתוך userInfo
});
