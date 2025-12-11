import axios from "axios";

const MENU_BASE = process.env.MENU_SERVICE_URL;

// Helper: fetch clientId by menuId
async function getClientIdFromMenuId(menuId) {
  try {
    const res = await axios.get(`${MENU_BASE}/internal/menu/client-menus/${menuId}`, {
      headers: { "x-internal-token": process.env.INTERNAL_TOKEN }
    });

    return res.data?.data?.clientId || null;
  } catch (e) {
    return null;
  }
}

async function checkCoachOwnsClient(coachId, clientId) {
  // TODO: replace with IDM relationship lookup when ready
  return true; // temporary safe fallback
}

export async function requireOwnership(req, res, next) {
  let clientId =
    req.params.clientId ||
    req.body.clientId ||
    null;

  // Handle menuId → clientId translation
  const menuId = req.params.id; // for /client-menus/:id

  if (!clientId && menuId) {
    const extractedClientId = await getClientIdFromMenuId(menuId);
    if (extractedClientId) {
      clientId = extractedClientId;
    }
  }

  // If still no clientId → nothing to validate
  if (!clientId) return next();

  // CLIENT ACCESS
  if (req.user?.role === "client") {
    if (clientId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  }

  // COACH ACCESS
  if (req.user?.role === "coach") {
    const ok = await checkCoachOwnsClient(req.user.id, clientId);
    if (!ok) {
      return res.status(403).json({ message: "You do not own this client" });
    }
  }

  next();
}
