import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { McpResultDto } from "../dtos/mcpResult.dto.js";
import { runLLM } from "../llm/llmClient.js";
import { systemPrompt } from "../llm/systemPrompt.js";
import { llmTools } from "../llm/tools/llmTools.js";
import { toolRegistry } from "../llm/tools/registry.js";
import { executeTool } from "../llm/toolExecutor.js";

export async function runMcp(input) {
  const {
    conversationId,
    messageId,
    sender,
    clientId,
    userId,
  } = RunMcpDto.parse(input);

  const context = {
    conversationId,
    messageId,
    sender,
    clientId,
    userId: sender === "coach" ? userId : undefined,
    dailyState: undefined, 
  };

  const usedTools = [];

  const messages = [
    {
      role: "user",
      content: "התקבלה הודעה חדשה מהלקוח",
    },
  ];

  // 1️⃣ First LLM pass
  const llmMessage = await runLLM({
    systemPrompt,
    messages,
    tools: llmTools, // פה נשאר llmTools כי המודל צריך את המערך
  });

  // 2️⃣ If tools were called
  if (llmMessage.tool_calls?.length) {
    messages.push(llmMessage);

    for (const call of llmMessage.tool_calls) {
      const toolName = call.function.name;
      const args = JSON.parse(call.function.arguments || "{}");

      const toolResult = await executeTool({
        toolName,
        args,
        context,
        toolRegistry: toolRegistry, 
      });

      if (toolName === "get_daily_state") {
        context.dailyState = toolResult;
      }

      usedTools.push(toolName);

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(toolResult),
      });
    }

    // 3️⃣ Final LLM pass
    const finalMessage = await runLLM({
      systemPrompt,
      messages,
    });

    return McpResultDto.parse({
      decision: "AUTO_REPLY",
      replyText: finalMessage.content ?? null,
      usedTools,
    });
  }

  return McpResultDto.parse({
    decision: "COACH_REPLY",
    replyText: null,
    usedTools,
  });
}