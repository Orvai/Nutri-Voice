import axios from "axios";
import { env } from "../../../config/env.js";
import { toProviderInput } from "../mappers/toProviderInput.js";
import { fromResponsesOutput } from "../mappers/fromProviderOutput.js";

const openaiClient = axios.create({
  baseURL: "https://api.openai.com/v1",
  timeout: env.LLM_TIMEOUT_MS,
  headers: {
    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function runResponses(input) {
  const payload = {
    ...toProviderInput("responses", input),
    store: env.OPENAI_RESPONSES_STORE,
  };

  try {
    const response = await openaiClient.post("/responses", payload);
    return fromResponsesOutput(response.data);
  } catch (error) {
    const hasFunctionCallOutput = Array.isArray(payload.input)
      ? payload.input.some((item) => item?.type === "function_call_output")
      : false;
    const canRetryWithoutChain =
      Boolean(payload.previous_response_id) &&
      [400, 404].includes(error?.response?.status || 0) &&
      !hasFunctionCallOutput;

    if (!canRetryWithoutChain) {
      throw error;
    }

    const retryPayload = { ...payload };
    delete retryPayload.previous_response_id;
    const retryResponse = await openaiClient.post("/responses", retryPayload);
    const normalized = fromResponsesOutput(retryResponse.data);
    return {
      ...normalized,
      meta: {
        ...(normalized.meta || {}),
        chainFallback: true,
      },
    };
  }
}
