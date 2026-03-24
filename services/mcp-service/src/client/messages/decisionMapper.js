import { McpResultDto } from "../../dtos/mcpResult.dto.js";

export function toMcpDecision(content, usedTools) {
  const text = (content || "").trim();

  if (!text) {
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  if (text.includes("COACH_REPLY")) {
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  return McpResultDto.parse({
    decision: "AUTO_REPLY",
    replyText: text,
    usedTools,
  });
}
