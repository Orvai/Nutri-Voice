import { normalizeTrustedActorFromHeaders } from "../security/trustedIdentity.js";

export function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];

  if (!token || token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ message: "Invalid internal token" });
  }

  const trustedActor = normalizeTrustedActorFromHeaders(req.headers);
  if (!trustedActor.ok) {
    return res.status(401).json({ message: trustedActor.error });
  }

  req.trustedActor = trustedActor.actor;
  next();
}
