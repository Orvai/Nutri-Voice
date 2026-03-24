import axios from "axios";
import { env } from "../../../config/env.js";
import { toProviderInput } from "../mappers/toProviderInput.js";
import { fromChatCompletionsOutput } from "../mappers/fromProviderOutput.js";

const openaiClient = axios.create({
  baseURL: "https://api.openai.com/v1",
  timeout: env.LLM_TIMEOUT_MS,
  headers: {
    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function runChatCompletions(input) {
  const payload = toProviderInput("chat", input);
  const response = await openaiClient.post("/chat/completions", payload);
  return fromChatCompletionsOutput(response.data);
}
