import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { McpResultDto } from "../dtos/mcpResult.dto.js";
import { runLLM } from "../llm/llmClient.js";
import { systemPrompt } from "../llm/systemPrompt.js";
import { llmTools } from "../llm/tools/llmTools.js";
import { toolRegistry } from "../llm/tools/registry.js";
import { executeTool } from "../llm/toolExecutor.js";

export async function runMcp(input) {
  // 1. Validation
  const {
    conversationId,
    messageId,
    sender,
    clientId,
    userId,
    userText,
    history 
  } = RunMcpDto.parse(input);

  // 2. Build Context

  const context = {
    conversationId,
    messageId,
    sender,
    clientId, 
    userId: sender === "coach" ? userId : clientId, 
    dailyState: undefined, 
  };

  const usedTools = [];

  const messages = [
    ...history, 
    {
      role: "user",
      content: userText, 
    },
  ];

  try {
    // First LLM pass
    const llmMessage = await runLLM({
      systemPrompt,
      messages,
      tools: llmTools, 
    });

    // Check for Tool Calls
    if (llmMessage.tool_calls?.length) {
      messages.push(llmMessage);

      for (const call of llmMessage.tool_calls) {
        const toolName = call.function.name;
        
        let args;
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch (e) {
          console.error(`Failed to parse args for tool ${toolName}`, e);
          args = {};
        }

        console.log(`[MCP] Executing tool: ${toolName} for client: ${clientId}`);


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

      // Final LLM pass (After tools)
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

    // No tools called - handle regular chat
    const content = llmMessage.content || "";

    if (content.includes("COACH_REPLY")) {
      return McpResultDto.parse({
        decision: "COACH_REPLY",
        replyText: null,
        usedTools,
      });
    }

    if (content.trim().length > 0) {
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText: content,
        usedTools,
      });
    }

    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });

  } catch (error) {
    console.error("[MCP] Critical Error:", error);
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }
}