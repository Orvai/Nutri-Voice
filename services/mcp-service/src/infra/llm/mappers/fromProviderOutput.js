function extractResponsesText(content = []) {
  if (!Array.isArray(content)) return "";
  return content
    .map((item) => {
      if (typeof item?.text === "string") return item.text;
      if (typeof item?.output_text === "string") return item.output_text;
      return "";
    })
    .join("")
    .trim();
}

export function fromChatCompletionsOutput(responseData) {
  return {
    message: responseData?.choices?.[0]?.message || { content: "" },
    meta: {
      provider: "chat",
      status: "completed",
      responseId: null,
    },
  };
}

export function fromResponsesOutput(responseData) {
  const outputItems = Array.isArray(responseData?.output) ? responseData.output : [];

  const toolCalls = outputItems
    .filter((item) => item?.type === "function_call")
    .map((item) => ({
      id: item.call_id || item.id,
      function: {
        name: item.name,
        arguments:
          typeof item.arguments === "string"
            ? item.arguments
            : JSON.stringify(item.arguments || {}),
      },
    }));

  const textParts = outputItems
    .filter((item) => item?.type === "message")
    .map((item) => extractResponsesText(item.content))
    .filter(Boolean);

  return {
    message: {
      content: textParts.join("\n").trim(),
      tool_calls: toolCalls,
    },
    meta: {
      provider: "responses",
      status: responseData?.status || "unknown",
      responseId: responseData?.id || null,
    },
  };
}
