import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || "http://localhost:4010";
process.env.INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || "test-internal-token";
process.env.CONVERSATION_STATE_BACKEND = "memory";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

vi.mock("../http/gatewayClient.js", () => ({
  callGateway: vi.fn(),
}));

import { runCoachMcp } from "../coach/services/coachAssistant.service.js";
import { callGateway } from "../http/gatewayClient.js";
import { clearAllCoachSessionStateForTests } from "../coach/state/coachSession.store.js";

function baseInput(overrides = {}) {
  return {
    conversationId: "coach-conv-1",
    messageId: "coach-msg-1",
    sender: "coach",
    userId: "coach-1",
    userText: "show Daniel status",
    clientId: null,
    history: [],
    requestAudit: {
      requestId: "req-1",
      actorId: "coach-1",
      clientId: null,
    },
    metadata: {
      intent: "client_overview",
    },
    ...overrides,
  };
}

describe("coach assistant e2e", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await clearAllCoachSessionStateForTests();
  });

  it("coach querying client status", async () => {
    callGateway.mockImplementation(async ({ contractKey }) => {
      if (contractKey === "COACH_LIST_CLIENTS") {
        return { data: [{ id: "client-1", name: "Daniel Levi" }] };
      }
      if (contractKey === "COACH_GET_DAILY_STATE") {
        return { data: { dayType: "TRAINING" } };
      }
      if (contractKey === "NUTRITION_LIST_CLIENT_MENUS") {
        return { data: [{ id: "menu-1" }] };
      }
      if (contractKey === "WORKOUT_LIST_CLIENT_PROGRAMS") {
        return { data: [{ id: "program-1" }, { id: "program-2" }] };
      }
      throw new Error(`Unexpected contractKey ${contractKey}`);
    });

    const result = await runCoachMcp(baseInput());

    expect(result.status).toBe("ok");
    expect(result.resolvedClient?.id).toBe("client-1");
    expect(result.usedTools).toEqual([
      "coach_list_clients",
      "coach_get_daily_state",
      "nutrition_list_client_menus",
      "workout_list_client_programs",
    ]);
    expect(result.replyText).toContain("dayType=TRAINING");
    expect(result.replyText).toContain("menus=1");
    expect(result.replyText).toContain("workoutPrograms=2");
  });

  it("coach logging workout and propagating audit", async () => {
    callGateway.mockResolvedValue({
      data: { id: "workout-log-1" },
    });

    const result = await runCoachMcp(
      baseInput({
        userText: "log workout",
        clientId: "client-1",
        metadata: {
          intent: "workout_log",
          payload: {
            workoutType: "A",
            effortLevel: "HARD",
            notes: "done",
            exercises: [{ exerciseName: "Squat", weight: 100 }],
          },
        },
      })
    );

    expect(result.status).toBe("ok");
    expect(result.usedTools).toEqual(["coach_log_workout"]);
    expect(result.toolResults[0]).toMatchObject({
      ok: true,
      entityType: "workout_log",
      summary: "Logged workout for client.",
    });

    const call = callGateway.mock.calls[0][0];
    expect(call.contractKey).toBe("WORKOUT_LOG_CREATE");
    expect(call.audit.requestId).toBe("req-1");
    expect(call.audit.toolName).toBe("coach_log_workout");
    expect(call.audit.clientId).toBe("client-1");
  });

  it("coach updating workout program", async () => {
    callGateway.mockResolvedValue({
      data: { id: "program-1", name: "Updated Program" },
    });

    const result = await runCoachMcp(
      baseInput({
        clientId: "client-1",
        metadata: {
          intent: "workout_update_program",
          programId: "program-1",
          payload: {
            name: "Updated Program",
          },
        },
      })
    );

    expect(result.status).toBe("ok");
    expect(result.usedTools).toEqual(["workout_update_client_program"]);
    expect(result.replyText).toContain("Updated workout program program-1");
  });

  it("out-of-scope rejection", async () => {
    const result = await runCoachMcp(
      baseInput({
        userText: "who won the oscar?",
        metadata: {},
      })
    );

    expect(result.status).toBe("out_of_scope");
    expect(result.toolResults).toEqual([]);
    expect(callGateway).not.toHaveBeenCalled();
  });

  it("coach escalation path", async () => {
    const result = await runCoachMcp(
      baseInput({
        userText: "this is urgent medical issue",
        metadata: {},
      })
    );

    expect(result.status).toBe("escalation_required");
    expect(result.meta.reason).toBe("high_risk_or_privileged_request");
  });

  it("ambiguous client name handling", async () => {
    callGateway.mockImplementation(async ({ contractKey }) => {
      if (contractKey === "COACH_LIST_CLIENTS") {
        return {
          data: [
            { id: "client-1", name: "Daniel Cohen" },
            { id: "client-2", name: "Daniel Levi" },
          ],
        };
      }
      throw new Error(`Unexpected contractKey ${contractKey}`);
    });

    const result = await runCoachMcp(baseInput({ userText: "show daniel status" }));

    expect(result.status).toBe("clarification_required");
    expect(result.meta.reason).toBe("ambiguous_client");
    expect(result.meta.options).toHaveLength(2);
  });

  it("deterministic response shape", async () => {
    callGateway.mockResolvedValue({
      data: { id: "workout-log-1" },
    });

    const result = await runCoachMcp(
      baseInput({
        clientId: "client-1",
        metadata: {
          intent: "workout_log",
          payload: {
            workoutType: "A",
            effortLevel: "NORMAL",
            notes: "ok",
            exercises: [{ exerciseName: "Press", weight: 40 }],
          },
        },
      })
    );

    expect(result).toMatchObject({
      status: "ok",
      summary: expect.any(String),
      replyText: expect.any(String),
      toolResults: expect.any(Array),
      usedTools: expect.any(Array),
      meta: expect.any(Object),
      audit: expect.any(Object),
    });

    expect(result.toolResults[0]).toMatchObject({
      ok: expect.any(Boolean),
      entityType: expect.any(String),
      entityId: expect.anything(),
      summary: expect.any(String),
      meta: expect.any(Object),
      audit: expect.any(Object),
    });
  });
});
