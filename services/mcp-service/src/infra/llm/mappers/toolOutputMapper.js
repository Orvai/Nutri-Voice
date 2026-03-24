function toResponsesInputItem(message) {
  const role = message?.role || "user";
  const textType = role === "assistant" ? "output_text" : "input_text";

  if (message?.role === "tool") {
    return {
      type: "function_call_output",
      call_id: message.tool_call_id,
      output: message.content,
    };
  }

  if (message?.role === "system") {
    return {
      role: "system",
      content: [{ type: "input_text", text: String(message.content ?? "") }],
    };
  }

  if (message?.role === "assistant") {
    return {
      role: "assistant",
      content: [{ type: "output_text", text: String(message.content ?? "") }],
    };
  }

  if (Array.isArray(message?.content)) {
    return {
      role,
      content: message.content.map((item) => {
        if (item?.type === "text") {
          return { type: textType, text: item.text || "" };
        }

        if (item?.type === "image_url") {
          return {
            type: "input_image",
            image_url: item.image_url?.url,
          };
        }

        return item;
      }),
    };
  }

  return {
    role,
    content: [{ type: textType, text: String(message?.content ?? "") }],
  };
}

export function mapMessagesForResponses(messages = []) {
  const mapped = [];

  for (const message of messages) {
    if (
      message?.role === "assistant" &&
      Array.isArray(message?.tool_calls) &&
      message.tool_calls.length > 0
    ) {
      const assistantText = String(message?.content ?? "").trim();
      if (assistantText) {
        mapped.push({
          role: "assistant",
          content: [{ type: "output_text", text: assistantText }],
        });
      }

      for (const call of message.tool_calls) {
        const toolName = call?.function?.name;
        const callId = call?.id;
        if (!toolName || !callId) continue;

        const rawArgs = call?.function?.arguments;
        mapped.push({
          type: "function_call",
          call_id: callId,
          name: toolName,
          arguments:
            typeof rawArgs === "string" ? rawArgs : JSON.stringify(rawArgs || {}),
        });
      }
      continue;
    }

    mapped.push(toResponsesInputItem(message));
  }

  return mapped;
}

export function mapToolMessageForProvider(provider, message) {
  if (provider === "responses") {
    return toResponsesInputItem(message);
  }

  return message;
}
