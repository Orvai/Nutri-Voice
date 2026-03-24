import { env } from "../../config/env.js";
import { runChatCompletions } from "./adapters/chatCompletions.adapter.js";
import { runResponses } from "./adapters/responses.adapter.js";

function pickProvider() {
  if (env.OPENAI_API_MODE === "chat") return "chat";
  if (env.OPENAI_API_MODE === "responses") return "responses";

  const bucket = Math.floor(Math.random() * 100);
  return bucket < env.OPENAI_RESPONSES_CANARY_PERCENT ? "responses" : "chat";
}

export async function runViaLlmRouter(input) {
  const provider = pickProvider();
  if (provider === "responses") {
    return runResponses(input);
  }
  return runChatCompletions(input);
}
