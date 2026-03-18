import axios from "axios";
import { buildAuditContext, resolveClientId } from "./audit.js";

export function forward(baseURL, targetPath, options = {}) {
  const { preservePath = false } = options;

  return async (req, res, next) => {
    let url = "";
    const method = req.method.toLowerCase();

    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      /* ============================
          1. Resolve target URL
      ============================ */
      let resolvedPath = preservePath ? req.path : targetPath;

      if (resolvedPath && resolvedPath.includes(":")) {
        for (const [key, value] of Object.entries(req.params)) {
          resolvedPath = resolvedPath.replace(`:${key}`, value);
        }
      }

      url = `${baseURL}${resolvedPath}`;

      /* ============================
          2. Identity Injection Logic                       
      ============================ */
      const user = req.user || {};
      const actorId = user.actorId || user.id;
      const actorRole = user.role;
      const subjectId = user.userId || user.id;
      const audit = buildAuditContext(req, {
        requestId: req.audit?.requestId,
        toolName: req.audit?.toolName,
      });
      const resolvedClientId = resolveClientId(req);
      const coachIdHeader =
        req.headers["x-coach-id"] ||
        user.coachId ||
        (actorRole === "coach" ? actorId : undefined);

      /* ============================
          3. Build SAFE headers
      ============================ */
      const headers = {
        // Internal Auth Secret
        "x-internal-token": process.env.INTERNAL_TOKEN,

        // Identity Headers (Source of Truth for the Actor)
        "x-user-id": subjectId,
        "x-role": actorRole,
        "x-session-id": user.sessionId,
        "x-actor-id": actorId,
        "x-actor-type": user.actorType,
        "x-tenant-id": user.tenantId,

        "x-client-id":
          req.headers["x-client-id"] ||
          resolvedClientId ||
          (actorRole === "client" ? actorId : undefined),
        "x-coach-id": coachIdHeader,

        // Pass-through headers 
        authorization: req.headers.authorization,
        "content-type": req.headers["content-type"],
        cookie: req.headers.cookie,
        
        // MCP Specifics 
        "x-mcp-sender": req.headers["x-mcp-sender"],
        "x-mcp-client-id": req.headers["x-mcp-client-id"],
        "x-mcp-user-id": req.headers["x-mcp-user-id"],
        "x-tool-name": req.headers["x-tool-name"] || audit.toolName,
        "x-request-id": req.headers["x-request-id"] || audit.requestId,

        // Cache control
        "cache-control": "no-cache",
        pragma: "no-cache",
        expires: "0",
      };

      Object.keys(headers).forEach((k) => {
        if (headers[k] === undefined || headers[k] === null) {
          delete headers[k];
        }
      });

      /* ============================
          4. Axios config
      ============================ */
      const config = {
        method,
        url,
        headers,
        params: req.query, 
        withCredentials: true,
      };

      const isMultipart = req.is("multipart/form-data");

      if (isMultipart) {
        config.data = req;
        config.maxBodyLength = Infinity;
        config.maxContentLength = Infinity;
      } else if (method !== "get" && method !== "delete") {
        config.data = req.body;
      }

      console.log(
        `➡️ FORWARD: ${method.toUpperCase()} ${url} | Actor: ${actorId} (${actorRole}) | requestId=${audit.requestId}`
      );

      const response = await axios(config);

      /* ============================
          5. Forward cookies & response
      ============================ */
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      const isAuthRoute =
        targetPath.includes("/auth/login") ||
        targetPath.includes("/auth/logout") ||
        targetPath.includes("/token/refresh");

      if (isAuthRoute) {
        return res.status(response.status).json(response.data);
      }

      const payload = response.data;
      if (payload && payload.data !== undefined) {
        return res.status(response.status).json(payload);
      }

      return res.status(response.status).json({ data: payload });

    } catch (err) {
      if (err.response) {
        console.error(`❌ ERROR from downstream: ${err.response.status} on ${url}`);
        return res.status(err.response.status).json(
           err.response.data 
        );
      }
      
      console.error("❌ GATEWAY ERROR:", err.message);
      next(err);
    }
  };
}
