import { describe, expect, it } from "vitest";
import "./setup-env.js";

process.env.GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || "http://localhost:4000";
process.env.INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || "test-internal-token";
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "test-openai-key";

const { toolRegistry } = await import("../client/llm/tools/registry.js");

describe("tool registry consistency", () => {
  it("registers upsert_metrics_log under the correct key", () => {
    expect(toolRegistry.upsert_metrics_log).toBeDefined();
    expect(toolRegistry.upsert_metrics_log.name).toBe("upsert_metrics_log");
  });

  it("registers get_day_type_weekly_balance under the correct key", () => {
    expect(toolRegistry.get_day_type_weekly_balance).toBeDefined();
    expect(toolRegistry.get_day_type_weekly_balance.name).toBe(
      "get_day_type_weekly_balance"
    );
  });

  it("executes ask_calories with the expected args/context signature", async () => {
    const result = await toolRegistry.ask_calories.execute(
      {},
      {
        dailyState: {
          remainingCalories: 250,
        },
      }
    );

    expect(result.replyText).toContain("250");
  });
});
