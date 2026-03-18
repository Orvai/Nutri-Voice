import { buildAuditContext } from "../utils/audit.js";

export function attachAuditContext(req, res, next) {
  req.audit = buildAuditContext(req);
  res.setHeader("x-request-id", req.audit.requestId);
  next();
}
