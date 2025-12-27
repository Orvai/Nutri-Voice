/**
 * contracts/gateway.contract.js
 *
 * Source of Truth for MCP → Gateway calls
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
      TRACKING — READ (Daily State & History)
      Role: BOTH (Client sees own data, Coach sees client data)
      Context: PATH (clientId is explicit in URL)
  ====================================================== */
  DAILY_STATE_GET: {
    method: "GET",
    path: "/api/tracking/daily-state", 
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,           
  },

  DAY_SELECTION_TODAY_GET: {
    method: "GET",
    path: "/api/tracking/day-selection/today/{clientId}",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,
  },

  MEAL_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/meal-log/history/{clientId}",
    role: GatewayRole.BOTH, 
    clientContext: ClientContext.PATH,
  },

  WORKOUT_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/workout-log/history/{clientId}",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,
  },

  WEIGHT_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/weight-log/history/{clientId}",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,
  },

  /* ======================================================
      TRACKING — WRITE (Log Actions)
      Role: CLIENT (Usually users log for themselves)
      Context: SELF (clientId comes from User Token)
  ====================================================== */
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
      MENU SERVICE - EXTENDED (Missing parts)
     ====================================================== */

  // --- SPECIAL ACTION: Create from Template ---
  CLIENT_MENUS_CREATE_FROM_TEMPLATE: {
    method: "POST",
    path: "/api/client-menus/from-template",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE, // ה-Tool שולח את ה-clientId ב-Body
  },

  // --- FOOD ---
  FOOD_LIST: {
    method: "GET",
    path: "/api/food",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.NONE,
  },
  FOOD_CREATE: {
    method: "POST",
    path: "/api/food",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  FOOD_UPDATE: {
    method: "PUT",
    path: "/api/food/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  FOOD_DELETE: {
    method: "DELETE",
    path: "/api/food/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  // --- VITAMINS ---
  VITAMINS_LIST: {
    method: "GET",
    path: "/api/vitamins",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.NONE,
  },
  VITAMINS_CREATE: {
    method: "POST",
    path: "/api/vitamins",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  // --- MEAL TEMPLATES ---
  MEAL_TEMPLATES_LIST: {
    method: "GET",
    path: "/api/meal-templates",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  MEAL_TEMPLATES_GET_BY_ID: {
    method: "GET",
    path: "/api/meal-templates/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  MEAL_TEMPLATES_CREATE: {
    method: "POST",
    path: "/api/meal-templates",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  MEAL_TEMPLATES_UPDATE: {
    method: "PUT",
    path: "/api/meal-templates/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  MEAL_TEMPLATES_DELETE: {
    method: "DELETE",
    path: "/api/meal-templates/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },

  // --- TEMPLATE MENUS ---
  TEMPLATE_MENUS_LIST: {
    method: "GET",
    path: "/api/template-menus",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  TEMPLATE_MENUS_GET_BY_ID: {
    method: "GET",
    path: "/api/template-menus/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  TEMPLATE_MENUS_CREATE: {
    method: "POST",
    path: "/api/template-menus",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  TEMPLATE_MENUS_UPDATE: {
    method: "PUT",
    path: "/api/template-menus/{id}",
    role: GatewayRole.COACH,
    clientContext: ClientContext.NONE,
  },
  TEMPLATE_MENUS_DELETE: {
    method: "DELETE",
    path: "/api/template-menus/{id}",
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
  /* ======================================================
      METRICS LOG (Steps, Water, Sleep)
      Role: BOTH (Read history) / CLIENT (Write log)
     ====================================================== */

  METRICS_LOG_HISTORY: {
    method: "GET",
    path: "/api/tracking/metrics-log/history/{clientId}",
    role: GatewayRole.BOTH,
    clientContext: ClientContext.PATH,
  },

  METRICS_LOG_UPSERT: {
    method: "POST",
    path: "/api/tracking/metrics-log",
    role: GatewayRole.CLIENT,
    clientContext: ClientContext.SELF, 
  },
};

export const GatewayContractKeys = Object.keys(GatewayContract);
export const GatewayContractValues = Object.values(GatewayContract);