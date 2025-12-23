import axios from "axios";
import { env } from "../config/env.js";
import { GatewayContract } from "../contracts/gateway.contract.js";

export async function callGateway({
  contractKey,
  sender,        // "client" | "coach"
  context,       // { clientId?, userId? }
  pathParams = {},
  query = {},
  body,
}) {
  const contract = GatewayContract[contractKey];
  if (!contract) {
    throw new Error(`Unknown contractKey: ${contractKey}`);
  }

  /* ===============================
     Build URL
  =============================== */
  let url = contract.path;

  for (const [key, value] of Object.entries(pathParams)) {
    url = url.replace(`{${key}}`, value);
  }

  if (url.includes("{")) {
    throw new Error(`Missing path params for ${contractKey}`);
  }

  /* ===============================
     INTERNAL HEADERS 
  =============================== */
  const headers = {
    "x-internal-token": env.INTERNAL_TOKEN,
    "x-mcp-sender": sender,                 
    "x-mcp-client-id": context?.clientId,   
    "x-mcp-user-id": context?.userId,       
  };

  const client = axios.create({
    baseURL: env.GATEWAY_BASE_URL,
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
