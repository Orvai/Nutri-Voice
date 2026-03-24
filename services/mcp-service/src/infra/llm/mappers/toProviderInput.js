import { mapMessagesForResponses } from "./toolOutputMapper.js";

function mapToolsForResponses(tools = []) {
  return tools.map((tool) => {
    if (tool?.type === "function" && tool?.function) {
      return {
        type: "function",
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
      };
    }
    return tool;
  });
}

export function toProviderInput(
  provider,
  { systemPrompt, messages = [], tools = [], previousResponseId = null }
) {
  if (provider === "responses") {
    const payload = {
      model: "gpt-4.1-mini",
      instructions: systemPrompt,
      input: mapMessagesForResponses(messages),
      tools: mapToolsForResponses(tools),
    };

    if (previousResponseId) {
      payload.previous_response_id = previousResponseId;
    }

    return payload;
  }

  return {
    model: "gpt-4.1-mini",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    tools,
    temperature: 0.2,
  };
}
