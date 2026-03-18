import { describe, expect, it, vi, beforeEach } from "vitest";
import "./setup-env.js";

vi.mock("../http/gatewayClient.js", () => ({
  callGateway: vi.fn(),
}));

import { updateMeal } from "../client/services/tools/menu-meal/updateMeal.service.js";
import { callGateway } from "../http/gatewayClient.js";

describe("updateMeal service", () => {
  const context = {
    sender: "client",
    clientId: "client-1",
    userId: "client-1",
    dailyState: {
      dayType: "TRAINING",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes logId as path param and keeps payload in body", async () => {
    callGateway.mockResolvedValue({
      data: {
        id: "log-1",
        clientId: "client-1",
        date: "2026-03-17T10:00:00.000Z",
        dayType: "TRAINING",
        calories: 800,
        protein: 60,
        carbs: 75,
        fat: 20,
        description: null,
        matchedMenuItemId: null,
        loggedAt: "2026-03-17T10:00:00.000Z",
      },
    });

    const result = await updateMeal(
      {
        logId: "log-1",
        calories: 800,
      },
      context
    );

    expect(callGateway).toHaveBeenCalledWith({
      contractKey: "MEAL_LOG_UPDATE",
      sender: "client",
      context,
      pathParams: { logId: "log-1" },
      body: { calories: 800 },
    });

    expect(result.data.id).toBe("log-1");
    expect(result.data.calories).toBe(800);
  });

  it("rejects payloads without logId", async () => {
    await expect(
      updateMeal(
        {
          calories: 500,
        },
        context
      )
    ).rejects.toThrow();
  });

  it("rejects empty updates", async () => {
    await expect(
      updateMeal(
        {
          logId: "log-1",
        },
        context
      )
    ).rejects.toThrow("At least one meal field must be provided for update");
  });
});
