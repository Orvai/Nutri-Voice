import * as idm from "../adapters/idm.adapter.js";

export async function requireClientOwnership(req, res, next) {
  const requestingUser = req.user;      
  const clientId = req.params.clientId || req.body.clientId;

  if (!clientId) {
    return res.status(400).json({ message: "clientId is required" });
  }

  if (requestingUser.role === "client") {
    if (requestingUser.userId !== clientId) {
      return res.status(403).json({ message: "Not your account" });
    }
    return next();
  }

  if (requestingUser.role === "coach") {
    const clients = await idm.listUsers({ coachId: requestingUser.userId });

    const isOwned = clients.data.some(c => c.id === clientId);

    if (!isOwned) {
      return res.status(403).json({ message: "Client does not belong to this coach" });
    }

    return next();
  }

  return res.status(403).json({ message: "Unauthorized" });
}
