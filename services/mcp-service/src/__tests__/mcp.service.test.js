import { beforeEach, describe, expect, it, vi } from "vitest";
import "./setup-env.js";

vi.mock("../llm/llmClient.js", () => ({
  runLLM: vi.fn(),
}));

vi.mock("../http/gatewayClient.js", () => ({
  callGateway: vi.fn(),
}));

vi.mock("../llm/toolExecutor.js", () => ({
  executeTool: vi.fn(),
}));

import { runMcp } from "../client/services/mcp.service.js";
import { runLLM } from "../llm/llmClient.js";
import { callGateway } from "../http/gatewayClient.js";
import { executeTool } from "../llm/toolExecutor.js";
import {
  clearAllConversationStateForTests,
  patchConversationState,
} from "../client/state/conversationState.store.js";

const baseInput = {
  conversationId: "conv-1",
  messageId: "msg-1",
  sender: "client",
  clientId: "client-1",
  userText: "שלום",
  history: [],
};

function dailyStateFixture(dayType = "TRAINING") {
  const activeCaloriesAllowed = dayType === "TRAINING" ? 2200 : 1800;
  return {
    data: {
      dayType,
      calorieTargets: {
        trainingDay: 2200,
        restDay: 1800,
      },
      activeCaloriesAllowed,
      consumedCalories: 900,
      remainingCalories: activeCaloriesAllowed - 900,
      meals: [],
      workouts: [],
      weight: null,
      metrics: null,
    },
  };
}

describe("runMcp", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await clearAllConversationStateForTests();
    callGateway.mockResolvedValue(dailyStateFixture());
  });

  it("returns COACH_REPLY when final tool-followup response asks for escalation", async () => {
    runLLM
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-1",
            function: {
              name: "report_meal",
              arguments: JSON.stringify({
                calories: 500,
                protein: 40,
                carbs: 60,
                fat: 10,
                dayType: "TRAINING",
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        content: "COACH_REPLY",
      });

    executeTool.mockResolvedValue({ success: true });

    const result = await runMcp(baseInput);

    expect(result.decision).toBe("COACH_REPLY");
    expect(result.replyText).toBeNull();
    expect(result.usedTools).toEqual(["report_meal"]);
  });

  it("returns safe auto reply when any tool execution fails", async () => {
    runLLM.mockResolvedValueOnce({
      tool_calls: [
        {
          id: "call-1",
          function: {
            name: "update_meal",
            arguments: JSON.stringify({
              logId: "log-1",
              calories: 700,
            }),
          },
        },
      ],
    });

    executeTool.mockResolvedValue({ error: "downstream failed" });

    const result = await runMcp(baseInput);

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("תקלה זמנית");
    expect(result.usedTools).toEqual(["update_meal"]);
    expect(runLLM).toHaveBeenCalledTimes(1);
  });

  it("returns AUTO_REPLY when no tools are called and model returns text", async () => {
    runLLM.mockResolvedValueOnce({
      content: "  הכל טוב אח  ",
    });

    const result = await runMcp(baseInput);

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toBe("הכל טוב אח");
    expect(result.usedTools).toEqual([]);
  });

  it("sends image_url content to the LLM when user message is IMAGE", async () => {
    runLLM.mockResolvedValueOnce({
      content: "נראה כמו כ-550 קלוריות (הערכה)",
    });

    await runMcp({
      ...baseInput,
      contentType: "IMAGE",
      userText: "כמה קלוריות זה?",
      media: {
        mediaUrl: "https://example.com/meal.jpg",
        mediaMimeType: "image/jpeg",
      },
    });

    const firstCallInput = runLLM.mock.calls[0][0];
    const userMessage = firstCallInput.messages[firstCallInput.messages.length - 1];

    expect(Array.isArray(userMessage.content)).toBe(true);
    expect(userMessage.content[0]).toMatchObject({
      type: "text",
      text: "כמה קלוריות זה?",
    });
    expect(userMessage.content[1]).toMatchObject({
      type: "image_url",
      image_url: {
        url: "https://example.com/meal.jpg",
      },
    });
  });

  it("continues chained tool calls until meal is reported", async () => {
    runLLM
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-1",
            function: {
              name: "get_daily_state",
              arguments: JSON.stringify({}),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-2",
            function: {
              name: "set_day_type",
              arguments: JSON.stringify({ dayType: "TRAINING" }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-3",
            function: {
              name: "report_meal",
              arguments: JSON.stringify({
                calories: 620,
                protein: 35,
                carbs: 75,
                fat: 18,
                dayType: "TRAINING",
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        content: "דיווחתי את הארוחה",
      });

    executeTool.mockImplementation(async ({ toolName }) => {
      if (toolName === "get_daily_state") {
        return dailyStateFixture().data;
      }
      if (toolName === "set_day_type") {
        return { dayType: "TRAINING" };
      }
      if (toolName === "report_meal") {
        return { success: true, logId: "meal-log-1" };
      }
      return { error: "unexpected tool" };
    });

    const result = await runMcp(baseInput);

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toBe("דיווחתי את הארוחה");
    expect(result.usedTools).toEqual([
      "get_daily_state",
      "set_day_type",
      "report_meal",
    ]);
    expect(runLLM).toHaveBeenCalledTimes(4);
  });

  it("updates dailyState context after set_day_type before report_meal", async () => {
    callGateway.mockResolvedValueOnce(dailyStateFixture("REST"));

    runLLM
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-1",
            function: {
              name: "set_day_type",
              arguments: JSON.stringify({ dayType: "TRAINING" }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-2",
            function: {
              name: "report_meal",
              arguments: JSON.stringify({
                calories: 500,
                protein: 35,
                carbs: 55,
                fat: 16,
                dayType: "TRAINING",
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        content: "נרשם בהצלחה",
      });

    executeTool
      .mockResolvedValueOnce({
        success: true,
        data: { dayType: "TRAINING" },
      })
      .mockImplementationOnce(async ({ context, toolName }) => {
        if (toolName !== "report_meal") {
          return { error: "unexpected tool order" };
        }
        if (context?.dailyState?.dayType !== "TRAINING") {
          return { error: "dailyState not synced after set_day_type" };
        }
        return { success: true, logId: "meal-log-2" };
      });

    const result = await runMcp(baseInput);

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toBe("נרשם בהצלחה");
    expect(result.usedTools).toEqual(["set_day_type", "report_meal"]);
    expect(runLLM).toHaveBeenCalledTimes(3);
  });

  it("executes pending meal candidate on short confirmation without re-asking", async () => {
    await patchConversationState(baseInput.conversationId, {
      pending_meal_candidate: {
        calories: 560,
        protein: 30,
        carbs: 62,
        fat: 20,
        dayType: "TRAINING",
        description: "צ'יפס גדול",
      },
    });

    executeTool.mockResolvedValue({
      data: { id: "meal-log-9" },
      meta: { source: "ESTIMATE" },
    });

    const result = await runMcp({
      ...baseInput,
      userText: "כן",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("דיווחתי");
    expect(result.usedTools).toEqual(["report_meal"]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("asks only for day type if pending meal confirmation lacks dayType", async () => {
    callGateway.mockResolvedValueOnce(dailyStateFixture(null));

    await patchConversationState(baseInput.conversationId, {
      pending_meal_candidate: {
        calories: 410,
        protein: 20,
        carbs: 44,
        fat: 17,
      },
    });

    const result = await runMcp({
      ...baseInput,
      userText: "כן",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("העמסה או יום ללא העמסה");
    expect(result.usedTools).toEqual([]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("uses remembered dayType from conversation state and logs meal without asking again", async () => {
    callGateway.mockResolvedValueOnce(dailyStateFixture(null));

    await patchConversationState(baseInput.conversationId, {
      resolved_day_type: {
        dayType: "TRAINING",
        source: "SET_DAY_TYPE",
        capturedAt: new Date().toISOString(),
      },
      pending_meal_candidate: {
        calories: 510,
        protein: 28,
        carbs: 58,
        fat: 19,
      },
    });

    executeTool.mockImplementationOnce(async ({ toolName, args }) => {
      if (toolName !== "report_meal") {
        return { error: "unexpected tool" };
      }

      if (args.dayType !== "TRAINING") {
        return { error: "dayType was not hydrated from conversation memory" };
      }

      return { data: { id: "meal-log-remembered" } };
    });

    const result = await runMcp({
      ...baseInput,
      userText: "כן",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("דיווחתי");
    expect(result.usedTools).toEqual(["report_meal"]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("blocks out-of-scope questions with a fixed domain reply", async () => {
    const result = await runMcp({
      ...baseInput,
      userText: "מי זכה באוסקר השנה?",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("איני יכול לענות לך על זה");
    expect(result.usedTools).toEqual([]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("returns natural greeting reply for small talk and skips tools/llm", async () => {
    const result = await runMcp({
      ...baseInput,
      userText: "מה קורה בראדר",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("הכל טוב");
    expect(result.usedTools).toEqual([]);
    expect(callGateway).not.toHaveBeenCalled();
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("uses female greeting style for small talk when gender is female", async () => {
    const result = await runMcp({
      ...baseInput,
      userGender: "female",
      userText: "מה קורה",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("מה קורה חיים שלי");
    expect(result.usedTools).toEqual([]);
    expect(callGateway).not.toHaveBeenCalled();
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("marks distress-like messages as coach-reply with suggested response", async () => {
    executeTool.mockResolvedValueOnce({
      decision: "COACH_REPLY",
      reasons: ["רגישות"],
    });

    const result = await runMcp({
      ...baseInput,
      userText: "קשה לי מאוד להמשיך ככה",
    });

    expect(result.decision).toBe("COACH_REPLY");
    expect(result.replyText).toBeNull();
    expect(result.coachSuggestedReply).toBeTruthy();
    expect(result.usedTools).toEqual(["should_coach_reply"]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("starts workout reporting flow by offering existing programs", async () => {
    executeTool.mockResolvedValueOnce({
      summaries: [
        { id: "p1", name: "אימון A" },
        { id: "p2", name: "אימון B" },
      ],
    });

    const result = await runMcp({
      ...baseInput,
      userText: "אני רוצה לדווח על אימון",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("איזה אימון מהתוכניות שלך ביצעת");
    expect(result.replyText).toContain("אימון A");
    expect(result.usedTools).toEqual(["get_workout_programs"]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("after workout selection asks for effort, notes and exercise weights", async () => {
    await patchConversationState(baseInput.conversationId, {
      awaiting_missing_fields: {
        actionType: "report_workout",
        missingFields: ["workoutType", "effortLevel", "notes", "exerciseWeights"],
        draftPayload: {},
      },
      last_workout_context: {
        availablePrograms: [
          { id: "p1", name: "אימון A" },
          { id: "p2", name: "אימון B" },
        ],
      },
    });

    executeTool.mockResolvedValueOnce({
      currentProgram: { id: "p1", name: "אימון A" },
      workoutDay: "אימון A",
      exerciseList: [
        { exerciseName: "סקוואט" },
        { exerciseName: "לחיצת חזה" },
      ],
      completionStatus: "UNKNOWN",
      notes: [],
      substitutions: [],
      progressionContext: { hasHistory: false, hint: null },
    });

    const result = await runMcp({
      ...baseInput,
      userText: "1",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("רמת מאמץ");
    expect(result.replyText).toContain("סקוואט");
    expect(result.usedTools).toEqual(["get_workout_context"]);
    expect(runLLM).not.toHaveBeenCalled();
  });

  it("does not escalate when workout report is missing required details and asks follow-up", async () => {
    runLLM
      .mockResolvedValueOnce({
        tool_calls: [
          {
            id: "call-workout-1",
            function: {
              name: "report_workout",
              arguments: JSON.stringify({
                workoutType: "אימון A",
                effortLevel: "HARD",
                exercises: [{ exerciseName: "סקוואט" }],
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        content: "חסר לי עדיין הערות ומשקל לכל תרגיל שביצעת.",
      });

    const result = await runMcp({
      ...baseInput,
      userText: "סיימתי אימון A",
    });

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("חסר לי עדיין");
    expect(result.usedTools).toEqual(["report_workout"]);
    expect(runLLM).toHaveBeenCalledTimes(2);
  });

  it("falls back to AUTO_REPLY when LLM request fails", async () => {
    runLLM.mockRejectedValueOnce(new Error("LLM request failed"));

    const result = await runMcp(baseInput);

    expect(result.decision).toBe("AUTO_REPLY");
    expect(result.replyText).toContain("תקלה זמנית");
  });
});
