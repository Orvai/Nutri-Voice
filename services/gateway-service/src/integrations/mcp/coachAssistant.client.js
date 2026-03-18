import axios from "axios";

const MCP_TIMEOUT_MS = Number(process.env.MCP_TIMEOUT_MS || 30000);

export async function runCoachAssistant({ payload, actor, audit }) {
  const mcpBaseUrl = process.env.MCP_SERVICE_URL;
  if (!mcpBaseUrl) {
    throw new Error("MCP_SERVICE_URL is missing");
  }

  const url = `${mcpBaseUrl.replace(/\/+$/, "")}/internal/mcp/coach/run`;
  const response = await axios.post(url, payload, {
    timeout: MCP_TIMEOUT_MS,
    headers: {
      "x-internal-token": process.env.INTERNAL_TOKEN,
      "x-user-id": actor.actorId,
      "x-role": actor.role,
      "x-request-id": audit?.requestId,
      "x-actor-id": actor.actorId,
      "x-tenant-id": actor.tenantId,
    },
  });

  return response.data;
}
