import { describe, expect, it } from "vitest";
import {
  validateTrustedActorForRunMcpInput,
  normalizeTrustedActorFromHeaders,
} from "../security/trustedIdentity.js";

describe("trusted identity authorization scaffolding", () => {
  it("rejects sender=coach when trusted actor does not match userId", () => {
    const input = {
      sender: "coach",
      userId: "coach-1",
      clientId: "client-1",
    };

    const result = validateTrustedActorForRunMcpInput(input, {
      userId: "coach-2",
      role: "coach",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("must match trusted actor userId");
  });

  it("normalizes trusted actor headers", () => {
    const result = normalizeTrustedActorFromHeaders({
      "x-user-id": "coach-1",
      "x-role": "coach",
    });

    expect(result.ok).toBe(true);
    expect(result.actor).toEqual({
      userId: "coach-1",
      role: "coach",
    });
  });
});
