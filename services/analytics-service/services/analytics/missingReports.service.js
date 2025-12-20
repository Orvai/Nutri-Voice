// services/analytics/missingReports.service.js

const { differenceInCalendarDays } = require("date-fns");

/**
 * Business rules for risk calculation
 */
function calcRisk(days) {
  if (days <= 2) return "low";
  if (days <= 6) return "medium";
  return "high";
}

class MissingReportsService {
  constructor({ activityRepo, clientRepo }) {
    this.activityRepo = activityRepo;
    this.clientRepo = clientRepo;
  }

  async getMissingReports(coachId) {
    const now = new Date();

    // 1. Get last activity per client for this coach
    const activityRows =
      await this.activityRepo.getLastActivityByCoach(coachId);
    /**
     * Expected shape:
     * [
     *   { clientId, lastActivityAt: Date | null }
     * ]
     */

    if (!activityRows || activityRows.length === 0) {
      return [];
    }

    // 2. Fetch client details
    const clientIds = activityRows.map((r) => r.clientId);
    const clients =
      await this.clientRepo.getClientsByIds(clientIds);
    /**
     * Expected shape:
     * [
     *   { id, name, avatar }
     * ]
     */

    const clientMap = new Map(
      clients.map((c) => [c.id, c])
    );

    // 3. Build response
    return activityRows.map((row) => {
      const client = clientMap.get(row.clientId);

      const days =
        row.lastActivityAt == null
          ? 999
          : differenceInCalendarDays(
              now,
              new Date(row.lastActivityAt)
            );

      return {
        clientId: row.clientId,
        name: client ? client.name : "Unknown",
        avatar: client?.avatar || undefined,
        days,
        risk: calcRisk(days),
      };
    });
  }
}

module.exports = {
  MissingReportsService,
};
