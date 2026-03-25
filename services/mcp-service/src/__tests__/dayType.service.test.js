import { describe, expect, it } from "vitest";

import { extractDayTypeFromText } from "../client/state/dayType.service.js";

describe("dayType extraction", () => {
  it("extracts TRAINING from explicit loading-day wording", () => {
    expect(extractDayTypeFromText("היום יום העמסה")).toBe("TRAINING");
  });

  it("extracts REST from no-loading wording", () => {
    expect(extractDayTypeFromText("היום יום ללא העמסה")).toBe("REST");
  });

  it("does not infer day type from workout-only wording", () => {
    expect(extractDayTypeFromText("עשיתי אימון עכשיו")).toBeNull();
  });
});

