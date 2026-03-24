import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";
import { runViaLlmRouter } from "./llmClientRouter.js";

export async function runLLM({
  systemPrompt,
  messages,
  tools = [],
  previousResponseId = null,
}) {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  try {
    return await runViaLlmRouter({
      systemPrompt,
      messages,
      tools,
      previousResponseId,
    });
  } catch (err) {
    logger.error("LLM call failed", {
      error: err.response?.data || err.message,
    });
    throw err;
  }
}
