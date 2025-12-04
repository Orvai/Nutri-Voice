import axios from "axios";

export function forward(baseURL, targetPath) {
  return async (req, res, next) => {
    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      const url = `${baseURL}${targetPath}`;
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
        withCredentials: true
      };

      if (method !== "get" && method !== "delete") {
        config.data = req.body;
      }

      const response = await axios(config);

      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      res.status(response.status).json(response.data);

    } catch (err) {
      console.error(
        "❌ Gateway forward error:",
        err?.response?.data || err.message
      );

      if (err.response) {
        return res
          .status(err.response.status)
          .json(err.response.data);
      }

      next(err);
    }
  };
}
