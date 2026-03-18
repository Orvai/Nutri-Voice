// src/llm/toolExecutor.js

import { logger } from "../utils/logger.js";

/**
 * Executes a tool selected by the LLM
 *
 * Responsibility:
 * - Validate tool existence
 * - Enforce registry whitelist
 * - Execute tool with context
 */
export async function executeTool({
  toolName,
  args,
  context,
  toolRegistry,
}) {
  const Tool = toolRegistry[toolName];

  if (!Tool) {
    throw new Error(`[toolExecutor] Tool not found: ${toolName}`);
  }

  if (typeof Tool.execute !== "function") {
    throw new Error(`[toolExecutor] Tool ${toolName} has no execute() method`);
  }

  const previousToolName = context?.currentToolName;
  if (context) {
    context.currentToolName = toolName;
    context.audit = {
      ...(context.audit || {}),
      toolName,
    };
  }

  try {
    return await Tool.execute(args, context);
  } catch (err) {
    const errorMessage = err?.message || "Tool execution failed";
    logger.error("Tool execution failed", {
      toolName,
      error: errorMessage,
    });
    return { error: errorMessage };
  } finally {
    if (context) {
      context.currentToolName = previousToolName;
      if (context.audit) {
        context.audit.toolName = previousToolName || null;
      }
    }
  }
}
