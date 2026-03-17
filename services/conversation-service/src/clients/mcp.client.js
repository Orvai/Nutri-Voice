const axios = require("axios");

const MCP_BASE_URL = process.env.MCP_BASE_URL;

// ✅ לוג ברור
console.log("MCP_BASE_URL =", MCP_BASE_URL);
console.log("MCP_BASE_URL JSON =", JSON.stringify(MCP_BASE_URL));

function assertValidUrl(url) {
  if (typeof url !== "string") {
    throw new Error(`❌ MCP url is not a string. typeof=${typeof url}`);
  }

  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error("❌ MCP url is empty string");
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error(`❌ MCP url must start with http/https. got=${trimmed}`);
  }

  // ✅ בדיקת URL אמיתית של Node
  try {
    new URL(trimmed);
  } catch (e) {
    throw new Error(`❌ MCP_BASE_URL is invalid: ${trimmed} | ${e.message}`);
  }

  return trimmed;
}

function buildTrustedIdentityHeaders(actor = {}, input = {}) {
  const role = typeof actor.role === "string" ? actor.role.toLowerCase() : "";
  const userId = typeof actor.userId === "string" ? actor.userId.trim() : "";

  if (!userId) {
    throw new Error("❌ Trusted actor userId is required for MCP call");
  }

  if (role !== "client" && role !== "coach") {
    throw new Error(`❌ Trusted actor role is invalid: ${actor.role}`);
  }

  const headers = {
    "x-user-id": userId,
    "x-role": role,
  };

  if (input.clientId) {
    headers["x-client-id"] = input.clientId;
  }

  if (role === "coach") {
    headers["x-coach-id"] = userId;
  }

  return headers;
}

async function runMcp(input, trustedActor) {
  const base = assertValidUrl(MCP_BASE_URL);

  const finalUrl = `${base.replace(/\/+$/, "")}/internal/mcp/run`; // מסיר / בסוף אם יש
  console.log("🚀 MCP FINAL URL =", finalUrl);
  console.log("🚀 MCP FINAL URL JSON =", JSON.stringify(finalUrl));

  // ✅ גם פה בדיקת URL מלאה
  try {
    new URL(finalUrl);
  } catch (e) {
    throw new Error(`❌ FINAL URL invalid: ${finalUrl} | ${e.message}`);
  }

  const trustedHeaders = buildTrustedIdentityHeaders(trustedActor, input);

  const res = await axios.post(finalUrl, input, {
    headers: {
      "x-internal-token": process.env.INTERNAL_TOKEN,
      ...trustedHeaders,
    },
  });

  return res.data;
}

module.exports = { runMcp };
