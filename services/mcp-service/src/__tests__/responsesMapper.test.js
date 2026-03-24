import { describe, expect, it } from "vitest";
import { mapMessagesForResponses } from "../infra/llm/mappers/toolOutputMapper.js";

describe("responses mapper", () => {
  it("maps assistant text history to output_text", () => {
    const mapped = mapMessagesForResponses([
      {
        role: "assistant",
        content: "שלום, איך אפשר לעזור?",
      },
    ]);

    expect(mapped).toEqual([
      {
        role: "assistant",
        content: [{ type: "output_text", text: "שלום, איך אפשר לעזור?" }],
      },
    ]);
  });

  it("maps user text history to input_text", () => {
    const mapped = mapMessagesForResponses([
      {
        role: "user",
        content: "מה קורה?",
      },
    ]);

    expect(mapped).toEqual([
      {
        role: "user",
        content: [{ type: "input_text", text: "מה קורה?" }],
      },
    ]);
  });

  it("maps assistant tool calls to function_call items", () => {
    const mapped = mapMessagesForResponses([
      {
        role: "assistant",
        content: "",
        tool_calls: [
          {
            id: "call_123",
            function: {
              name: "get_daily_state",
              arguments: "{\"clientId\":\"c1\"}",
            },
          },
        ],
      },
      {
        role: "tool",
        tool_call_id: "call_123",
        content: "{\"ok\":true}",
      },
    ]);

    expect(mapped).toEqual([
      {
        type: "function_call",
        call_id: "call_123",
        name: "get_daily_state",
        arguments: "{\"clientId\":\"c1\"}",
      },
      {
        type: "function_call_output",
        call_id: "call_123",
        output: "{\"ok\":true}",
      },
    ]);
  });
});
