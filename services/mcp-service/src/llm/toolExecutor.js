// src/llm/toolExecutor.js

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

  try {
    return await Tool.execute(args, context);
  } catch (err) {
    console.error(`[toolExecutor] Tool ${toolName} failed:`, err.message);
    return { error: err.message };
  }
}
