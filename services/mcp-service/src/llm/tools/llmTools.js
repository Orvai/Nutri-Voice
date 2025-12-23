// src/llm/tools/llmTools.js
import { toolRegistry } from "./registry.js";

/**
 * Converts internal tool definition into OpenAI "tools" schema.
 * Every tool MUST expose:
 * - name (string)
 * - description (string)
 * - parameters (JSON Schema object)  // required for function calling
 */
function toOpenAiTool(tool) {
  if (!tool?.name) throw new Error("[llmTools] Tool is missing name");
  if (!tool?.description) throw new Error(`[llmTools] Tool ${tool.name} missing description`);

  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters || {
        type: "object",
        properties: {},
        required: [],
      },
    },
  };
}

/**
 * Export tools list for OpenAI function calling
 */
export const llmTools = Object.values(toolRegistry).map(toOpenAiTool);
