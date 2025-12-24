const axios = require("axios");

const MENU_BASE = process.env.MENU_SERVICE_URL;

async function getClientMenus(clientId) {
  console.log("🚀 getClientMenus CALLED with ID:", clientId);
  const res = await axios.get(
    `${MENU_BASE}/internal/menu/client-menus`,
    {
      headers: {
        "x-internal-token": process.env.INTERNAL_TOKEN,
        "x-client-id": clientId,
      },
      params: {
        clientId,
        includeInactive: "false",
      },
    }
  );

  return res.data.data;
}

module.exports = { getClientMenus };
