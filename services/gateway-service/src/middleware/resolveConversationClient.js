import axios from "axios";

const CONVERSATION_BASE = process.env.CONVERSATION_SERVICE_URL;

function clean(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text || text === "undefined" || text === "null") return null;
  return text;
}

function applyResolvedClientId(req, clientId) {
  if (!clientId) return;
  req.params = req.params || {};
  req.params.clientId = req.params.clientId || clientId;

  // In newer Express setups, req.query can be getter-only. Mutate only when object exists.
  if (req.query && typeof req.query === "object") {
    req.query.clientId = req.query.clientId || clientId;
  }

  if (req.body && typeof req.body === "object") {
    req.body.clientId = req.body.clientId || clientId;
  }

  req.headers["x-client-id"] = req.headers["x-client-id"] || clientId;
}

async function fetchConversationById(req, conversationId) {
  const res = await axios.get(`${CONVERSATION_BASE}/internal/conversations/${conversationId}`, {
    headers: {
      "x-internal-token": process.env.INTERNAL_TOKEN,
      "x-request-id": req.audit?.requestId,
    },
  });

  return res.data?.data || null;
}

async function fetchMessageById(req, messageId) {
  const res = await axios.get(`${CONVERSATION_BASE}/internal/messages/${messageId}`, {
    headers: {
      "x-internal-token": process.env.INTERNAL_TOKEN,
      "x-request-id": req.audit?.requestId,
    },
  });

  return res.data?.data || null;
}

export async function resolveConversationClient(req, res, next) {
  try {
    const conversationId = clean(req.params?.id || req.params?.conversationId);
    if (!conversationId) return next();

    const conversation = await fetchConversationById(req, conversationId);
    const clientId = clean(conversation?.clientId);
    if (!clientId) {
      return res.status(404).json({ message: "Conversation client not found" });
    }

    applyResolvedClientId(req, clientId);
    return next();
  } catch (err) {
    if (err?.response?.status) {
      return res.status(err.response.status).json(err.response.data);
    }
    return next(err);
  }
}

export async function resolveMessageClient(req, res, next) {
  try {
    const messageId = clean(req.params?.id || req.params?.messageId);
    if (!messageId) return next();

    const message = await fetchMessageById(req, messageId);
    const clientId = clean(message?.conversation?.clientId);
    if (!clientId) {
      return res.status(404).json({ message: "Message client not found" });
    }

    applyResolvedClientId(req, clientId);
    return next();
  } catch (err) {
    if (err?.response?.status) {
      return res.status(err.response.status).json(err.response.data);
    }
    return next(err);
  }
}
