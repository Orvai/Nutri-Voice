import { McpResultDto } from "../../dtos/mcpResult.dto.js";
import { runLLM } from "../../llm/llmClient.js";
import { executeTool } from "../../llm/toolExecutor.js";
import { logger } from "../../utils/logger.js";
import { env } from "../../config/env.js";
import { llmTools } from "../llm/tools/llmTools.js";
import { toolRegistry } from "../llm/tools/registry.js";
import { toMcpDecision } from "../messages/decisionMapper.js";
import { buildToolResultMessage } from "../messages/messageBuilders.js";
import {
  patchConversationState,
  updateConversationStateByTool,
  updateStateAfterFinalText,
} from "../state/conversationState.service.js";
import { syncDailyStateContext } from "../state/dayType.service.js";
import { rememberResponsesMeta } from "../state/responsesSession.service.js";
import {
  mergeWorkoutReportDraftArgs,
  validateWorkoutReportPayload,
} from "../policies/workout.policy.js";

export async function runMcpToolLoop({ context, messages, usedTools, clientId, conversationId }) {
  const toolErrors = [];
  let llmInputMessages = [...messages];
  let previousResponseId = context.previousResponseId || null;

  for (let step = 0; step < env.MCP_MAX_TOOL_STEPS; step += 1) {
    const llmResult = await runLLM({
      systemPrompt: context.systemPrompt,
      messages: llmInputMessages,
      tools: llmTools,
      previousResponseId,
    });
    const llmMessage = llmResult?.message || llmResult;
    const llmMeta = llmResult?.meta || { provider: "chat", status: "completed" };
    await rememberResponsesMeta({ conversationId, llmMeta });

    if (llmMeta?.provider === "responses" && llmMeta?.responseId) {
      previousResponseId = llmMeta.responseId;
      context.previousResponseId = llmMeta.responseId;
    }

    if (!llmMessage.tool_calls?.length) {
      const decision = toMcpDecision(llmMessage.content, usedTools);
      if (decision.replyText) {
        await updateStateAfterFinalText({
          conversationId,
          text: decision.replyText,
          hasDayType: !!context.dailyState?.dayType,
        });
      }
      return decision;
    }

    messages.push(llmMessage);
    const nextTurnMessages = [];

    for (const call of llmMessage.tool_calls) {
      const toolName = call.function.name;
      let args = {};
      let toolResult;

      try {
        args = JSON.parse(call.function.arguments || "{}");
      } catch (e) {
        logger.error("Failed to parse tool args", {
          toolName,
          error: e.message,
        });
        toolResult = { error: `Invalid JSON arguments for tool ${toolName}` };
      }

      if (!toolResult && toolName === "report_workout") {
        args = mergeWorkoutReportDraftArgs(args, context.conversationState);
        const validation = validateWorkoutReportPayload(args);
        if (!validation.ok) {
          context.conversationState = await patchConversationState(conversationId, {
            awaiting_missing_fields: {
              actionType: "report_workout",
              missingFields: validation.missingFields,
              draftPayload: args,
            },
          });

          toolResult = {
            error: validation.message,
            recoverable: true,
            missingFields: validation.missingFields,
            expectedExercises:
              context.conversationState?.last_workout_context?.expectedExercises || [],
          };
        }
      }

      if (!toolResult) {
        logger.info("Executing MCP tool", {
          toolName,
          clientId,
          step: step + 1,
        });

        toolResult = await executeTool({
          toolName,
          args,
          context,
          toolRegistry,
        });
      }

      syncDailyStateContext({ toolName, toolResult, args, context });
      context.conversationState = await updateConversationStateByTool({
        conversationId,
        toolName,
        args,
        toolResult,
      });

      if (toolName === "should_coach_reply" && toolResult?.decision === "COACH_REPLY") {
        usedTools.push(toolName);
        return McpResultDto.parse({
          decision: "COACH_REPLY",
          replyText: null,
          usedTools,
        });
      }

      if (toolResult?.error && !toolResult?.recoverable) {
        toolErrors.push({
          toolName,
          error: toolResult.error,
        });
      }

      usedTools.push(toolName);
      const toolMessage = buildToolResultMessage(call.id, toolResult);
      messages.push(toolMessage);
      nextTurnMessages.push(toolMessage);
    }

    if (toolErrors.length > 0) {
      logger.warn("MCP tool execution failed; returning safe auto reply", {
        clientId,
        toolErrors,
      });
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText:
          "יש כרגע תקלה זמנית בעיבוד הנתונים שלי. אפשר לנסות שוב עוד רגע ואענה לך מיד.",
        usedTools,
      });
    }

    const shouldUseResponseChain = Boolean(previousResponseId);
    llmInputMessages = shouldUseResponseChain ? nextTurnMessages : [...messages];
  }

  logger.warn("MCP reached tool-call step limit; returning safe auto reply", {
    clientId,
    maxSteps: env.MCP_MAX_TOOL_STEPS,
    usedTools,
  });
  return McpResultDto.parse({
    decision: "AUTO_REPLY",
    replyText:
      "לא הצלחתי להשלים את הבדיקה עד הסוף כרגע. תכתוב לי שוב את הבקשה ואבדוק מיד.",
    usedTools,
  });
}
