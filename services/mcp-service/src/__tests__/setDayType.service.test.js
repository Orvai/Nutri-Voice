import { beforeEach, describe, expect, it, vi } from "vitest";
import "./setup-env.js";

vi.mock("../http/gatewayClient.js", () => ({
  callGateway: vi.fn(),
}));

import { setDayType } from "../client/services/tools/DailyState/setDayType.service.js";
import { callGateway } from "../http/gatewayClient.js";

function weekRows(dayTypes) {
  return dayTypes.map((dayType) => ({
    data: { dayType: dayType ?? null },
  }));
}

describe("setDayType service", () => {
  const context = {
    sender: "client",
    clientId: "client-1",
    userId: "client-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns recoverable limit error when projected weekly count exceeds allowedDaysPerWeek", async () => {
    callGateway.mockImplementation(async ({ contractKey }) => {
      if (contractKey === "CLIENT_MENUS_LIST") {
        return {
          data: [{ id: "menu-1", type: "TRAINING", isActive: true, allowedDaysPerWeek: 2 }],
        };
      }

      if (contractKey === "DAILY_STATE_RANGE_GET") {
        return {
          data: weekRows(["TRAINING", "TRAINING", null, null, null, null, null]),
        };
      }

      if (contractKey === "DAY_SELECTION_CREATE") {
        return { data: { dayType: "TRAINING" } };
      }

      return {};
    });

    const result = await setDayType(
      {
        dayType: "TRAINING",
        date: "2026-03-18T12:00:00.000Z",
      },
      context
    );

    expect(result.success).toBe(false);
    expect(result.recoverable).toBe(true);
    expect(result.code).toBe("DAY_TYPE_WEEKLY_LIMIT_REACHED");
    expect(result.data.allowedDaysPerWeek).toBe(2);
    expect(result.data.currentWeekCount).toBe(2);

    const createCalls = callGateway.mock.calls.filter(
      ([arg]) => arg.contractKey === "DAY_SELECTION_CREATE"
    );
    expect(createCalls).toHaveLength(0);
  });

  it("allows updating day type when target date is already counted as same day type", async () => {
    callGateway.mockImplementation(async ({ contractKey }) => {
      if (contractKey === "CLIENT_MENUS_LIST") {
        return {
          data: [{ id: "menu-1", type: "TRAINING", isActive: true, allowedDaysPerWeek: 2 }],
        };
      }

      if (contractKey === "DAILY_STATE_RANGE_GET") {
        return {
          // Sunday..Saturday; Monday + Tuesday are already TRAINING
          data: weekRows([null, "TRAINING", "TRAINING", null, null, null, null]),
        };
      }

      if (contractKey === "DAY_SELECTION_CREATE") {
        return {
          data: {
            id: "day-selection-1",
            dayType: "TRAINING",
          },
        };
      }

      return {};
    });

    const result = await setDayType(
      {
        dayType: "TRAINING",
        date: "2026-03-16T12:00:00.000Z",
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data.dayType).toBe("TRAINING");

    const createCalls = callGateway.mock.calls.filter(
      ([arg]) => arg.contractKey === "DAY_SELECTION_CREATE"
    );
    expect(createCalls).toHaveLength(1);
  });
});
