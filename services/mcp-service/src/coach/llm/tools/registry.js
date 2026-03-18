import { coachCapabilityMap } from "../../services/coachTools.service.js";

function normalizeParameters(parameters) {
  return (
    parameters || {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    }
  );
}

export const coachToolRegistry = Object.fromEntries(
  Object.entries(coachCapabilityMap).map(([name, capability]) => [
    name,
    {
      name,
      description: capability.description || `Coach tool: ${name}`,
      parameters: normalizeParameters(capability.parameters),
      async execute(args, context) {
        return capability.run(args || {}, context);
      },
    },
  ])
);
