import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { McpResultDto } from "../dtos/mcpResult.dto.js";
import { runLLM } from "../llm/llmClient.js";
import { systemPrompt } from "../llm/systemPrompt.js";
import { llmTools } from "../llm/tools/llmTools.js";
import { executeTool } from "../llm/toolExecutor.js";

export async function runMcp(input) {
  const { conversationId, messageId, sender } = RunMcpDto.parse(input);

  const context = {
    conversationId,
    messageId,
    sender,
    userToken: input.userToken,
  };

  const usedTools = [];
  let messages = [
    {
      role: "user",
      content: "התקבלה הודעה חדשה מהלקוח",
    },
  ];

  const llmMessage = await runLLM({
    systemPrompt,
    messages,
    tools: llmTools,
  });

  if (llmMessage.tool_calls?.length) {
    for (const call of llmMessage.tool_calls) {
      const toolName = call.function.name;
      const args = JSON.parse(call.function.arguments || "{}");

      const toolResult = await executeTool({
        name: toolName,
        args,
        context,
      });
      if (toolName === "get_daily_state") {
        context.dailyState = toolResult;
      }

      usedTools.push(toolName);

      messages.push(llmMessage);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(toolResult),
      });
    }

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
