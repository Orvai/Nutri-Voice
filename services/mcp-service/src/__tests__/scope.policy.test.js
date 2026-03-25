import { describe, expect, it } from "vitest";

import { isOutOfScopeMessage } from "../client/policies/scope.policy.js";

describe("scope policy", () => {
  it("keeps day-type weekly questions in scope", () => {
    expect(isOutOfScopeMessage("כמה ימי העמסה נשארו לי השבוע?")).toBe(false);
    expect(isOutOfScopeMessage("כמה ימים ללא העמסה נשארו לי?")).toBe(false);
  });

  it("marks unrelated questions as out of scope", () => {
    expect(isOutOfScopeMessage("מי זכה באוסקר השנה?")).toBe(true);
  });
});

