import axios from "axios";
import { resolveClientId } from "../utils/audit.js";

const MENU_BASE = process.env.MENU_SERVICE_URL;
const IDM_BASE = process.env.IDM_SERVICE_URL;

function clean(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text || text === "undefined" || text === "null") return null;
  return text;
}

async function getClientIdFromMenuId(menuId, req) {
  try {
    const res = await axios.get(`${MENU_BASE}/internal/menu/client-menus/${menuId}`, {
      headers: {
        "x-internal-token": process.env.INTERNAL_TOKEN,
        "x-request-id": req.audit?.requestId,
      },
    });

    return clean(res.data?.data?.clientId);
  } catch (_e) {
    return null;
  }
}

function extractCoachActorId(req) {
  return clean(
    req.user?.actorId ||
      req.headers["x-actor-id"] ||
      req.headers["x-mcp-user-id"] ||
      req.headers["x-coach-id"] ||
      req.user?.id
  );
}

async function checkCoachOwnsClient(req, coachId, clientId) {
  if (!IDM_BASE) {
    throw new Error("IDM_SERVICE_URL is missing");
  }

  const headers = {
    "x-internal-token": process.env.INTERNAL_TOKEN,
    "x-user-id": coachId,
    "x-role": "coach",
    "x-coach-id": coachId,
    "x-request-id": req.audit?.requestId,
  };

  const res = await axios.get(
    `${IDM_BASE}/internal/coaches/${coachId}/clients/${clientId}/ownership`,
    { headers }
  );

  return Boolean(res.data?.data?.owns);
}

export async function requireOwnership(req, res, next) {
  try {
    let clientId = clean(resolveClientId(req));
    const menuId = clean(req.params?.id);

    if (!clientId && menuId) {
      clientId = await getClientIdFromMenuId(menuId, req);
    }

    if (!clientId) return next();

    const role = clean(req.user?.role)?.toLowerCase();
    if (role === "client") {
      const actorClientId = clean(req.user?.actorId || req.user?.id);
      if (actorClientId !== clientId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.headers["x-client-id"] = clientId;
      return next();
    }

    if (role === "coach") {
      const coachId = extractCoachActorId(req);
      if (!coachId) {
        return res.status(403).json({ message: "Missing coach actor context" });
      }

      const ok = await checkCoachOwnsClient(req, coachId, clientId);
      if (!ok) {
        return res.status(403).json({ message: "You do not own this client" });
      }

      req.headers["x-client-id"] = clientId;
      req.headers["x-coach-id"] = coachId;
      req.ownership = { clientId, coachId };
    }

    next();
  } catch (err) {
    if (err?.response?.status) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
}
