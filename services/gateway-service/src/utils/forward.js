import axios from "axios";

export function forward(baseURL, targetPath) {
  return async (req, res, next) => {
    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      // Build target URL (including params support like /users/:id)
      let path = targetPath;
      if (targetPath.includes(":")) {
        for (const [key, value] of Object.entries(req.params)) {
          path = path.replace(`:${key}`, value);
        }
      }

      const url = `${baseURL}${path}`;
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

      // Pass cookies back to client
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      // ⭐ AUTH MUST NOT BE NORMALIZED
      if (
        req.path.startsWith("/auth/login") ||
        req.path.startsWith("/auth/logout") ||
        req.path.startsWith("/auth/refresh")
      ) {
        return res.status(response.status).json(response.data);
      }

      // ⭐ All other services normalized
      return res.status(response.status).json({
        data: response.data,
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
