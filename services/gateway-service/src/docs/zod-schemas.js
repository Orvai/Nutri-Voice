import { zodToJsonSchema } from "zod-to-json-schema";

// ===== Import all DTOs (CommonJS → ES) =====
import * as Idm from "../dto/idm.dto.js";
import * as Menu from "../dto/menu.dto.js";
import * as Tracking from "../dto/tracking.dto.js";
import * as Workout from "../dto/workout.dto.js";

/**
 * Extract all Zod schemas from a DTO module
 * - Only exports that have .safeParse (i.e., are Zod schemas)
 */
function extractSchemas(dtoModule) {
  const out = {};

  for (const [name, schema] of Object.entries(dtoModule)) {
    if (schema && typeof schema.safeParse === "function") {
      out[name] = zodToJsonSchema(schema, name);
    }
  }

  return out;
}

// ===== Convert all schema groups =====
const idmSchemas = extractSchemas(Idm);
const menuSchemas = extractSchemas(Menu);
const trackingSchemas = extractSchemas(Tracking);
const workoutSchemas = extractSchemas(Workout);


// ===== Combined registry (used by Swagger) =====
export const zodSchemas = {
  ...idmSchemas,
  ...menuSchemas,
  ...trackingSchemas,
  ...workoutSchemas,
};
console.log("[ZOD-SCHEMAS] Loaded schemas keys:", Object.keys(zodSchemas));
console.log("[ZOD-SCHEMAS] Total schemas loaded:", Object.keys(zodSchemas).length);


// Debug print
console.log("[ZOD-SCHEMAS] Total schemas loaded:", Object.keys(zodSchemas).length);
