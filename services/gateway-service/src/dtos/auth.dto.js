import { z } from "zod";

/* ------------------------------
   Login Request DTO
------------------------------ */
export const LoginRequestDto = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

/* ------------------------------
   Public User DTO
------------------------------ */
export const UserPublicDto = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(["coach", "client"]),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string().nullable().optional(),
});

/* ------------------------------
   Login Response DTO
------------------------------ */
export const LoginResponseDto = z.object({
  accessToken: z.string(),
  user: UserPublicDto,
});
