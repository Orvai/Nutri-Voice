import { beforeEach, describe, expect, it, vi } from "vitest";
import "./setup-env.js";

vi.mock("../http/gatewayClient.js", () => ({
  callGateway: vi.fn(),
}));

import { callGateway } from "../http/gatewayClient.js";
import { getDayTypeWeeklyBalance } from "../client/services/tools/DailyState/getDayTypeWeeklyBalance.service.js";

function weekRows(dayTypes) {
  return dayTypes.map((dayType) => ({
    data: { dayType: dayType ?? null },
  }));
}

describe("getDayTypeWeeklyBalance service", () => {
  const context = {
    sender: "client",
    clientId: "client-1",
    userId: "client-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns weekly usage and remaining counts for both day types", async () => {
    callGateway.mockImplementation(async ({ contractKey }) => {
      if (contractKey === "CLIENT_MENUS_LIST") {
        return {
          data: [
            { id: "menu-1", type: "TRAINING", isActive: true, allowedDaysPerWeek: 2 },
            { id: "menu-2", type: "REST", isActive: true, allowedDaysPerWeek: 5 },
          ],
        };
      }

      if (contractKey === "DAILY_STATE_RANGE_GET") {
        return {
          data: weekRows(["TRAINING", "REST", "REST", null, null, null, null]),
        };
      }

      return {};
    });

    const result = await getDayTypeWeeklyBalance(
      {
        date: "2026-03-18T12:00:00.000Z",
      },
      context
    );

    expect(result.dayTypes.TRAINING.usedDaysThisWeek).toBe(1);
    expect(result.dayTypes.TRAINING.remainingDaysThisWeek).toBe(1);
    expect(result.dayTypes.REST.usedDaysThisWeek).toBe(2);
    expect(result.dayTypes.REST.remainingDaysThisWeek).toBe(3);
    expect(result.summaryText).toContain("ימי העמסה");
  });
});

