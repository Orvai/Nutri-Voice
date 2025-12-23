// src/llm/llmClient.js
import axios from "axios";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const openaiClient = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function runLLM({
  systemPrompt,
  messages,
  tools = [],
}) {
  try {
    const response = await openaiClient.post("/chat/completions", {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      tools,
      temperature: 0.2,
    });

    return response.data.choices[0].message;
  } catch (err) {
    logger.error("LLM call failed", {
      error: err.response?.data || err.message,
    });
    throw err;
  }
}
