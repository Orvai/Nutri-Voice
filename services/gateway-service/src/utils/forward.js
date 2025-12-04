import axios from "axios";

export function forward(baseURL, targetPath) {
  return async (req, res, next) => {
    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      // Resolve URL params (e.g., /users/:id)
      let resolvedPath = targetPath;
      if (resolvedPath.includes(":")) {
        for (const [key, value] of Object.entries(req.params)) {
          resolvedPath = resolvedPath.replace(`:${key}`, value);
        }
      }

      const url = `${baseURL}${resolvedPath}`;
      const method = req.method.toLowerCase();

      const headers = {
        "x-internal-token": process.env.INTERNAL_TOKEN,
        ...(req.headers.authorization && {
          authorization: req.headers.authorization,
        }),
      };

      const config = {
        method,
        url,
        headers,
        params: req.query,
        withCredentials: true,
      };

      if (method !== "get" && method !== "delete") {
        config.data = req.body;
      }

      const response = await axios(config);

      // Forward cookies (auth)
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      // ⭐ AUTH routes MUST return RAW (do NOT normalize)
      const isAuthRoute =
        targetPath === "/internal/auth/login" ||
        targetPath === "/internal/auth/logout" ||
        targetPath === "/internal/auth/token/refresh";

      if (isAuthRoute) {
        return res.status(response.status).json(response.data);
      }

      // ⭐ Normalize ALL other services
      // response.data can be:
      // - an array
      // - an object containing { data: [] }
      // - or other nested forms
      let payload = response.data;
      let normalized = [];

      if (Array.isArray(payload)) {
        normalized = payload;
      } else if (Array.isArray(payload?.data)) {
        normalized = payload.data;
      } else if (Array.isArray(payload?.items)) {
        normalized = payload.items;
      }

      return res.status(response.status).json({
        data: normalized,
      });

    } catch (err) {
      console.error(
        "❌ Gateway forward error:",
        err?.response?.data || err.message
      );

      if (err.response) {
        return res.status(err.response.status).json({
          error: err.response.data?.message || err.response.data || "Error",
        });
      }

      next(err);
    }
  };
}
