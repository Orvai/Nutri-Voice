import { RunMcpDto } from "../../dtos/runMcp.dto.js";
import { McpResultDto } from "../../dtos/mcpResult.dto.js";
import { callGateway } from "../../http/gatewayClient.js";
import { executeTool } from "../../llm/toolExecutor.js";
import { logger } from "../../utils/logger.js";
import { buildSystemPrompt } from "../llm/systemPrompt.js";
import { toolRegistry } from "../llm/tools/registry.js";
import { buildStateSystemMessage, buildUserMessage } from "../messages/messageBuilders.js";
import { buildSmallTalkReply, isOutOfScopeMessage } from "../policies/scope.policy.js";
import {
  buildCoachSuggestedReply,
  detectCoachCriticalMessage,
} from "../policies/escalation.policy.js";
import { isShortConfirmation } from "../policies/confirmation.policy.js";
import { isWorkoutReportStart } from "../policies/workout.policy.js";
import { createRuntimeContext } from "./runtimeContext.factory.js";
import {
  getConversationState,
  patchConversationState,
} from "../state/conversationState.service.js";
import {
  hydrateDayTypeFromState,
  rememberResolvedDayType,
} from "../state/dayType.service.js";
import { pickPendingAction } from "../state/workoutDraft.service.js";
import { getPreviousResponseIdFromConversationState } from "../state/responsesSession.service.js";
import {
  applyDayTypeFromShortReply,
  executePendingAction,
  maybeHandleWorkoutProgramSelection,
  startWorkoutReportCollection,
} from "../engine/pendingAction.engine.js";
import { runMcpToolLoop } from "../engine/mcpToolLoop.engine.js";

export async function runMcpUsecase(input) {
  const {
    conversationId,
    messageId,
    sender,
    clientId,
    userId,
    userGender,
    contentType,
    media,
    userText,
    history,
    requestAudit,
  } = RunMcpDto.parse(input);

  const context = await createRuntimeContext({
    conversationId,
    messageId,
    sender,
    clientId,
    userId,
    userGender,
    requestAudit,
  });
  context.systemPrompt = buildSystemPrompt({
    userGender: context.userProfile?.gender,
  });
  context.previousResponseId = getPreviousResponseIdFromConversationState(
    context.conversationState
  );

  const usedTools = [];
  const stateMessage = buildStateSystemMessage(
    context.conversationState,
    context.userProfile
  );
  const userMessage = buildUserMessage({ userText, contentType, media });
  const messages = [...history, stateMessage, userMessage];

  try {
    const smallTalkReply = buildSmallTalkReply(userText, context.userProfile?.gender);
    if (smallTalkReply) {
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText: smallTalkReply,
        usedTools,
      });
    }

    const dailyStateRes = await callGateway({
      contractKey: "DAILY_STATE_GET",
      sender,
      context,
    });
    context.dailyState = dailyStateRes?.data ?? dailyStateRes;

    if (context.dailyState?.dayType) {
      context.conversationState = await rememberResolvedDayType(
        conversationId,
        context.dailyState.dayType,
        "TOOL_DAILY_STATE"
      );
    } else if (hydrateDayTypeFromState(context)) {
      context.conversationState = await patchConversationState(conversationId, {
        awaiting_day_type: false,
      });
    }

    messages[history.length] = buildStateSystemMessage(
      context.conversationState,
      context.userProfile
    );

    if (context.conversationState?.awaiting_day_type) {
      const maybeHandled = await applyDayTypeFromShortReply({
        userText,
        context,
        usedTools,
        conversationId,
      });

      if (maybeHandled) return maybeHandled;
    }

    const criticalSignal = detectCoachCriticalMessage(userText);
    if (criticalSignal.isCritical) {
      await executeTool({
        toolName: "should_coach_reply",
        args: {
          userMessage: userText,
          mentionsMedical: criticalSignal.mentionsMedical,
          hasUncertainty: true,
        },
        context,
        toolRegistry,
      });
      usedTools.push("should_coach_reply");

      return McpResultDto.parse({
        decision: "COACH_REPLY",
        replyText: null,
        coachSuggestedReply: buildCoachSuggestedReply(criticalSignal),
        usedTools,
      });
    }

    if (isOutOfScopeMessage(userText)) {
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText:
          "איני יכול לענות לך על זה. אני כאן כדי לעזור רק בנושאי כושר, אימונים ותזונה.",
        usedTools,
      });
    }

    const workoutSelectionResult = await maybeHandleWorkoutProgramSelection({
      userText,
      context,
      usedTools,
      conversationId,
    });
    if (workoutSelectionResult) {
      return workoutSelectionResult;
    }

    const awaitingState = context.conversationState?.awaiting_missing_fields;
    if (
      isWorkoutReportStart(userText) &&
      (!awaitingState || awaitingState.actionType !== "report_workout")
    ) {
      return startWorkoutReportCollection({
        context,
        usedTools,
        conversationId,
      });
    }

    const pendingAction = pickPendingAction(await getConversationState(conversationId));
    if (isShortConfirmation(userText) && pendingAction) {
      return executePendingAction({
        pendingAction,
        context,
        usedTools,
        conversationId,
      });
    }

    return await runMcpToolLoop({
      context,
      messages,
      usedTools,
      clientId,
      conversationId,
    });
  } catch (error) {
    logger.error("MCP critical error", {
      error: error.message,
      clientId,
      conversationId,
      messageId,
    });
    return McpResultDto.parse({
      decision: "AUTO_REPLY",
      replyText:
        "יש כרגע תקלה זמנית בעיבוד הנתונים שלי. תנסה שוב עוד רגע ואבדוק לך את זה.",
      usedTools,
    });
  }
}
