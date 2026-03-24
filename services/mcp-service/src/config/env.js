import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default("4020"),
  GATEWAY_BASE_URL: z.string().url(),
  INTERNAL_TOKEN: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_API_MODE: z.enum(["chat", "responses", "auto"]).default("responses"),
  OPENAI_RESPONSES_STORE: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === "") return undefined;
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value.toLowerCase() === "true";
      return Boolean(value);
    }, z.boolean())
    .default(true),
  OPENAI_RESPONSES_CANARY_PERCENT: z.coerce.number().int().min(0).max(100).default(0),
  REDIS_URL: z.string().url().optional(),
  REDIS_TIMEOUT_MS: z.coerce.number().int().positive().default(2000),
  CONVERSATION_STATE_BACKEND: z.enum(["redis", "memory"]).default("redis"),
  CONVERSATION_STATE_KEY_PREFIX: z.string().default("mcp:conversation-state"),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  GATEWAY_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  MCP_MAX_TOOL_STEPS: z.coerce.number().int().positive().default(4),
  CONVERSATION_STATE_TTL_MIN: z.coerce.number().int().positive().default(180),
  CONVERSATION_STATE_MAX_ENTRIES: z.coerce.number().int().positive().default(5000),
});

const parsed = EnvSchema.parse(process.env);

if (parsed.CONVERSATION_STATE_BACKEND === "redis" && !parsed.REDIS_URL) {
  throw new Error("REDIS_URL is required when CONVERSATION_STATE_BACKEND=redis");
}

export const env = parsed;
