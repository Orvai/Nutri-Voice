/**
 * contracts/gateway.contract.js
 *
 * Source of Truth for MCP → Gateway calls
 *
 * Design principles:
 * - Contract describes WHAT can be called, not HOW gateway authenticates.
 * - MCP always sends internal identity via verifyInternalToken.
 * - clientContext determines where clientId comes from.
 *
 * clientContext meanings:
 * - SELF  → clientId = identity.user.id (client acting on self)
 * - PATH  → clientId MUST be provided in URL path
 * - NONE  → endpoint is not client-specific
 */

export const GatewayRole = {
  CLIENT: "client",
  COACH: "coach",
  BOTH: "client_or_coach",
};

export const ClientContext = {
  SELF: "SELF",
  PATH: "PATH",
  NONE: "NONE",
};

export const GatewayContract = {
  /* ======================================================
     WEBHOOK
  ====================================================== */
  WEBHOOK_INCOMING: {
    method: "POST",
    path: "/api/webhook/incoming",
    role: null,
    clientContext: ClientContext.NONE,
  },

  /* ======================================================
     TRACKING — CLIENT SELF
  ====================================================== */
  DAILY_STATE_GET: {
    method: "GET",
    path: "/api/tracking/daily-state",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.SELF,
  },

  MEAL_LOG_CREATE: {
    method: "POST",
    path: "/api/tracking/meal-log",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  MEAL_LOG_UPDATE: {
    method: "PUT",
    path: "/api/tracking/meal-log/{logId}",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  WORKOUT_LOG_CREATE: {
    method: "POST",
    path: "/api/tracking/workout-log",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  WORKOUT_LOG_UPDATE: {
    method: "PUT",
    path: "/api/tracking/workout-log/{logId}",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  WORKOUT_LOG_UPDATE_EXERCISE: {
    method: "PATCH",
    path: "/api/tracking/workout-log/exercise/{exerciseLogId}",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  WEIGHT_LOG_CREATE: {
    method: "POST",
    path: "/api/tracking/weight-log",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  WEIGHT_LOG_UPDATE: {
    method: "PUT",
    path: "/api/tracking/weight-log/{logId}",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  DAY_SELECTION_CREATE: {
    method: "POST",
    path: "/api/tracking/day-selection",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF,
  },

  /* ======================================================
     TRACKING — COACH ON CLIENT (clientId in PATH)
  ====================================================== */
  DAY_SELECTION_TODAY_FOR_CLIENT: {
    method: "GET",
    path: "/api/tracking/day-selection/today/{clientId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },

  MEAL_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/meal-log/history/{clientId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },

  WORKOUT_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/workout-log/history/{clientId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },

  WEIGHT_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/weight-log/history/{clientId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },

  /* ======================================================
     MENUS
  ====================================================== */
  CLIENT_MENUS_LIST: {
    method: "GET",
    path: "/api/client-menus",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.NONE,
  },

  CLIENT_MENUS_GET_BY_ID: {
    method: "GET",
    path: "/api/client-menus/{id}",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.NONE,
  },

  CLIENT_MENUS_CREATE: {
    method: "POST",
    path: "/api/client-menus",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  CLIENT_MENUS_UPDATE: {
    method: "PUT",
    path: "/api/client-menus/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  CLIENT_MENUS_DELETE: {
    method: "DELETE",
    path: "/api/client-menus/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  /* ======================================================
     WORKOUT PROGRAMS
  ====================================================== */
  WORKOUT_PROGRAMS_LIST_ALL: {
    method: "GET",
    path: "/api/workout/programs",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  WORKOUT_PROGRAMS_GET_BY_ID: {
    method: "GET",
    path: "/api/workout/programs/{programId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  WORKOUT_PROGRAMS_LIST_FOR_CLIENT: {
    method: "GET",
    path: "/api/workout/{clientId}/workout-programs",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,
  },

  WORKOUT_PROGRAMS_GET_FOR_CLIENT: {
    method: "GET",
    path: "/api/workout/{clientId}/workout-programs/{programId}",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,
  },

  WORKOUT_PROGRAMS_CREATE_FOR_CLIENT: {
    method: "POST",
    path: "/api/workout/{clientId}/workout-programs",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },

  WORKOUT_PROGRAMS_UPDATE_FOR_CLIENT: {
    method: "PUT",
    path: "/api/workout/{clientId}/workout-programs/{programId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },

  WORKOUT_PROGRAMS_DELETE_FOR_CLIENT: {
    method: "DELETE",
    path: "/api/workout/{clientId}/workout-programs/{programId}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.PATH,
  },
};

export const GatewayContractKeys = Object.keys(GatewayContract);
export const GatewayContractValues = Object.values(GatewayContract);
