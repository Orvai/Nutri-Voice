import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default("4020"),
  GATEWAY_BASE_URL: z.string().url(),
  INTERNAL_TOKEN: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  GATEWAY_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  MCP_MAX_TOOL_STEPS: z.coerce.number().int().positive().default(4),
  CONVERSATION_STATE_TTL_MIN: z.coerce.number().int().positive().default(180),
  CONVERSATION_STATE_MAX_ENTRIES: z.coerce.number().int().positive().default(5000),
});

export const env = EnvSchema.parse(process.env);
