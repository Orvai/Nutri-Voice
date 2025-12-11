export async function requireOwnership(req, res, next) {
  const clientId = req.params.clientId || req.body.clientId;

  if (!clientId) return next();

  if (req.user.role === "client") {
     if (clientId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
     }
     return next();
  }

  if (req.user.role === "coach") {
     const isOwned = await checkCoachOwnsClient(req.user.id, clientId);
     if (!isOwned) {
        return res.status(403).json({ message: "You do not own this client" });
     }
  }

  next();
}
