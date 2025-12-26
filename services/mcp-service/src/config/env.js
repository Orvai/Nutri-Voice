import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default("4020"),
  GATEWAY_BASE_URL: z.string().url(),
  INTERNAL_TOKEN: z.string(),
  OPENAI_API_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
