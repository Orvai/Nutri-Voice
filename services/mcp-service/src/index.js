import { createServer } from "./server.js";
import { env } from "./config/env.js";

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`🧠 MCP Service running on port ${env.PORT}`);
});
