const axios = require("axios");

const CLIENTS_SERVICE_URL = process.env.CLIENTS_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

if (!CLIENTS_SERVICE_URL) {
  throw new Error("CLIENTS_SERVICE_URL is not defined");
}

const headers = {
  "x-internal-token": INTERNAL_TOKEN
};

/**
 * Get clients for analytics
 *
 * CURRENT BEHAVIOR (TEMPORARY):
 * --------------------------------
 * - Fetches ALL users from idm-service
 * - Does NOT filter by coachId
 *
 * This is intentional for now, to allow analytics to work end-to-end.
 *
 * TODO (idm-service):
 * --------------------------------
 * Add support for filtering users by coachId:
 *   GET /internal/users?coachId=:coachId
 *
 * Once available:
 * - Update this service to pass coachId as query param
 * - Remove over-fetching
 *
 * @param {string} coachId (currently unused)
 * @returns {Promise<Array<{ id: string }>>}
 */
async function getClientsForCoach(coachId) {
  // coachId intentionally unused for now
  void coachId;

  const res = await axios.get(
    `${CLIENTS_SERVICE_URL}/internal/users`,
    { headers }
  );

  /**
   * Expected response (current):
   * [
   *   { id: "user-id-1", ... },
   *   { id: "user-id-2", ... }
   * ]
   */
  return res.data.map(user => ({
    id: user.id
  }));
}

module.exports = {
  getClientsForCoach
};
