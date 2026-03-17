function readHeaderString(headers, key) {
  const value = headers?.[key];
  if (Array.isArray(value)) return (value[0] || "").trim();
  if (typeof value === "string") return value.trim();
  return "";
}

const ALLOWED_ROLES = new Set(["client", "coach"]);

export function normalizeTrustedActorFromHeaders(headers = {}) {
  const userId = readHeaderString(headers, "x-user-id");
  const role = readHeaderString(headers, "x-role").toLowerCase();

  if (!userId) {
    return { ok: false, error: "Missing x-user-id header" };
  }

  if (!ALLOWED_ROLES.has(role)) {
    return { ok: false, error: "Invalid x-role header (must be client|coach)" };
  }

  return {
    ok: true,
    actor: {
      userId,
      role,
    },
  };
}

export function validateTrustedActorForRunMcpInput(input, actor) {
  if (!actor) {
    return { ok: false, error: "Missing trusted actor context" };
  }

  if (input.sender === "client") {
    if (actor.role !== "client") {
      return { ok: false, error: "Sender=client requires trusted actor role=client" };
    }

    if (actor.userId !== input.clientId) {
      return { ok: false, error: "Sender=client must match trusted actor userId" };
    }

    if (input.userId && input.userId !== input.clientId) {
      return { ok: false, error: "For sender=client, userId must equal clientId" };
    }

    return { ok: true };
  }

  if (input.sender === "coach") {
    if (actor.role !== "coach") {
      return { ok: false, error: "Sender=coach requires trusted actor role=coach" };
    }

    if (!input.userId) {
      return { ok: false, error: "Sender=coach requires userId in payload" };
    }

    if (actor.userId !== input.userId) {
      return { ok: false, error: "Sender=coach must match trusted actor userId" };
    }

    return { ok: true };
  }

  return { ok: false, error: `Unsupported sender: ${input.sender}` };
}

export function applyTrustedActorToRunMcpInput(input, actor) {
  if (input.sender === "client") {
    return { ...input, userId: input.clientId };
  }

  if (input.sender === "coach") {
    return { ...input, userId: actor.userId };
  }

  return input;
}
