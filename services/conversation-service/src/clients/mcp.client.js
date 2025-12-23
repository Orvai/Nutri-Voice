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

async function runMcp(input) {
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

  const res = await axios.post(finalUrl, input, {
    headers: {
      "x-internal-token": process.env.INTERNAL_TOKEN,
    },
  });

  return res.data;
}

module.exports = { runMcp };
