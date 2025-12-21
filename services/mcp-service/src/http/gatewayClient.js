// src/http/gatewayClient.js
import axios from "axios";
import { env } from "../config/env.js";

export const gatewayClient = axios.create({
  baseURL: env.GATEWAY_BASE_URL,
  headers: {
    "x-internal-token": env.INTERNAL_SERVICE_TOKEN,
  },
});
