import { randomUUID } from "crypto";

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (!text || text === "undefined" || text === "null") continue;
    return text;
  }
  return null;
}

export function resolveClientId(req) {
  return firstNonEmpty(
    req.params?.clientId,
    req.body?.clientId,
    req.query?.clientId,
    req.headers?.["x-client-id"],
    req.headers?.["x-mcp-client-id"]
  );
}

export function resolveActorId(req) {
  return firstNonEmpty(
    req.user?.actorId,
    req.user?.id,
    req.headers?.["x-actor-id"],
    req.headers?.["x-user-id"],
    req.headers?.["x-mcp-user-id"],
    req.headers?.["x-coach-id"]
  );
}

export function resolveRequestId(req) {
  return firstNonEmpty(req.headers?.["x-request-id"]) || randomUUID();
}

export function buildAuditContext(req, overrides = {}) {
  const requestId = overrides.requestId || resolveRequestId(req);
  return {
    requestId,
    actorId: overrides.actorId || resolveActorId(req),
    clientId: overrides.clientId || resolveClientId(req),
    toolName: overrides.toolName || firstNonEmpty(req.headers?.["x-tool-name"]),
  };
}
