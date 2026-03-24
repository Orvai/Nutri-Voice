import axios from "axios";
import { env } from "../../config/env.js";
import { GatewayContract } from "../../contracts/gateway.contract.js";

export async function callGateway({
  contractKey,
  sender,
  context,
  pathParams = {},
  query = {},
  body,
  audit = {},
}) {
  const contract = GatewayContract[contractKey];
  if (!contract) {
    throw new Error(`Unknown contractKey: ${contractKey}`);
  }

  let url = contract.path;

  for (const [key, value] of Object.entries(pathParams)) {
    url = url.replace(`{${key}}`, value);
  }

  if (url.includes("{")) {
    throw new Error(`Missing path params for ${contractKey}`);
  }

  const headers = {
    "x-internal-token": env.INTERNAL_TOKEN,
    "x-mcp-sender": sender,
    "x-mcp-client-id": context?.clientId,
    "x-mcp-user-id": context?.userId,
    "x-request-id": audit.requestId || context?.audit?.requestId,
    "x-actor-id": audit.actorId || context?.audit?.actorId || context?.userId,
    "x-tool-name": audit.toolName || context?.currentToolName || context?.audit?.toolName,
  };
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined || headers[key] === null) {
      delete headers[key];
    }
  });

  const client = axios.create({
    baseURL: env.GATEWAY_BASE_URL,
    timeout: env.GATEWAY_TIMEOUT_MS,
    headers,
  });

  const response = await client.request({
    method: contract.method,
    url,
    params: query,
    data: body,
  });

  return response.data;
}
