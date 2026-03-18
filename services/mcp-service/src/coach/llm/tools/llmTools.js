import { coachToolRegistry } from "./registry.js";

function toOpenAiTool(tool) {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };
}

export const coachLlmTools = Object.values(coachToolRegistry).map(toOpenAiTool);
