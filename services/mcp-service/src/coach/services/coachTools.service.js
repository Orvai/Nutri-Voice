import { callGateway } from "../../http/gatewayClient.js";
import { CoachToolResultDto } from "../../dtos/coachResult.dto.js";

function unwrapGatewayData(result) {
  if (result && typeof result === "object" && Object.prototype.hasOwnProperty.call(result, "data")) {
    return result.data;
  }
  return result;
}

function buildToolAudit(context, toolName, explicitClientId = null) {
  return {
    requestId: context.audit?.requestId || null,
    actorId: context.audit?.actorId || context.userId || null,
    clientId: explicitClientId || context.clientId || context.audit?.clientId || null,
    toolName,
  };
}

function normalizeToolResult({
  ok = true,
  entityType,
  entityId = null,
  summary,
  data = null,
  meta = {},
  audit = {},
}) {
  return CoachToolResultDto.parse({
    ok,
    entityType,
    entityId: entityId || null,
    summary,
    data,
    meta,
    audit,
  });
}

function requireClientId(toolName, args, context) {
  const clientId = args?.clientId || context.clientId || null;
  if (!clientId) {
    throw new Error(`${toolName} requires clientId`);
  }
  return clientId;
}

export const coachCapabilityMap = {
  coach_list_clients: {
    description: "List clients available to the authenticated coach.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "COACH_LIST_CLIENTS",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "coach_list_clients"),
      });
      const clients = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      return normalizeToolResult({
        entityType: "client_list",
        summary: `Found ${clients.length} clients.`,
        data: clients,
        meta: { count: clients.length },
        audit: buildToolAudit(context, "coach_list_clients"),
      });
    },
  },

  coach_get_daily_state: {
    description: "Fetch daily status for a specific client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
      },
      required: [],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("coach_get_daily_state", args, context);
      const res = await callGateway({
        contractKey: "COACH_GET_DAILY_STATE",
        sender: "coach",
        context: { ...context, clientId },
        query: { clientId },
        audit: buildToolAudit(context, "coach_get_daily_state", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "daily_state",
        entityId: clientId,
        summary: `Fetched daily state for client ${clientId}.`,
        data,
        audit: buildToolAudit(context, "coach_get_daily_state", clientId),
      });
    },
  },

  coach_get_daily_state_range: {
    description: "Fetch daily state history for a date range.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        startDate: { type: "string" },
        endDate: { type: "string" },
      },
      required: ["startDate", "endDate"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("coach_get_daily_state_range", args, context);
      const res = await callGateway({
        contractKey: "COACH_GET_DAILY_STATE_RANGE",
        sender: "coach",
        context: { ...context, clientId },
        query: {
          clientId,
          startDate: args.startDate,
          endDate: args.endDate,
        },
        audit: buildToolAudit(context, "coach_get_daily_state_range", clientId),
      });
      const data = unwrapGatewayData(res);
      const count = Array.isArray(data) ? data.length : 0;
      return normalizeToolResult({
        entityType: "daily_state_range",
        entityId: clientId,
        summary: `Fetched ${count} daily-state entries.`,
        data,
        meta: { count, startDate: args.startDate, endDate: args.endDate },
        audit: buildToolAudit(context, "coach_get_daily_state_range", clientId),
      });
    },
  },

  coach_list_conversations: {
    description: "List coach conversations.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
    async run(_args, context) {
      const res = await callGateway({
        contractKey: "COACH_LIST_CONVERSATIONS",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "coach_list_conversations"),
      });
      const data = unwrapGatewayData(res);
      const count = Array.isArray(data) ? data.length : 0;
      return normalizeToolResult({
        entityType: "conversation_list",
        summary: `Fetched ${count} conversations.`,
        data,
        meta: { count },
        audit: buildToolAudit(context, "coach_list_conversations"),
      });
    },
  },

  coach_get_conversation: {
    description: "Fetch one conversation by id.",
    parameters: {
      type: "object",
      properties: {
        conversationId: { type: "string" },
      },
      required: ["conversationId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "COACH_GET_CONVERSATION",
        sender: "coach",
        context,
        pathParams: {
          conversationId: args.conversationId,
        },
        audit: buildToolAudit(context, "coach_get_conversation"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "conversation",
        entityId: args.conversationId,
        summary: `Fetched conversation ${args.conversationId}.`,
        data,
        audit: buildToolAudit(context, "coach_get_conversation"),
      });
    },
  },

  coach_get_conversation_messages: {
    description: "Fetch messages for a conversation.",
    parameters: {
      type: "object",
      properties: {
        conversationId: { type: "string" },
      },
      required: ["conversationId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "COACH_GET_CONVERSATION_MESSAGES",
        sender: "coach",
        context,
        pathParams: {
          conversationId: args.conversationId,
        },
        audit: buildToolAudit(context, "coach_get_conversation_messages"),
      });
      const data = unwrapGatewayData(res);
      const count = Array.isArray(data) ? data.length : 0;
      return normalizeToolResult({
        entityType: "conversation_messages",
        entityId: args.conversationId,
        summary: `Fetched ${count} messages from conversation ${args.conversationId}.`,
        data,
        meta: { count },
        audit: buildToolAudit(context, "coach_get_conversation_messages"),
      });
    },
  },

  coach_send_message: {
    description: "Send a coach message to a conversation.",
    parameters: {
      type: "object",
      properties: {
        conversationId: { type: "string" },
        text: { type: "string" },
        contentType: { type: "string" },
        media: { type: "object" },
      },
      required: ["conversationId", "text"],
      additionalProperties: true,
    },
    async run(args, context) {
      const body = {
        text: args.text,
        contentType: args.contentType || "TEXT",
        media: args.media || undefined,
      };
      const res = await callGateway({
        contractKey: "COACH_SEND_MESSAGE",
        sender: "coach",
        context,
        pathParams: {
          conversationId: args.conversationId,
        },
        body,
        audit: buildToolAudit(context, "coach_send_message"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "message",
        entityId: data?.id || null,
        summary: "Message sent.",
        data,
        audit: buildToolAudit(context, "coach_send_message"),
      });
    },
  },

  coach_mark_message_handled: {
    description: "Mark a client message as handled.",
    parameters: {
      type: "object",
      properties: {
        messageId: { type: "string" },
        handledBy: { type: "string", enum: ["AI", "COACH"] },
      },
      required: ["messageId", "handledBy"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "COACH_MARK_MESSAGE_HANDLED",
        sender: "coach",
        context,
        pathParams: {
          messageId: args.messageId,
        },
        body: {
          handledBy: args.handledBy,
        },
        audit: buildToolAudit(context, "coach_mark_message_handled"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "message",
        entityId: args.messageId,
        summary: "Message marked as handled.",
        data,
        audit: buildToolAudit(context, "coach_mark_message_handled"),
      });
    },
  },

  nutrition_list_template_menus: {
    description: "List all nutrition template menus.",
    parameters: { type: "object", properties: {}, required: [], additionalProperties: false },
    async run(_args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_LIST_TEMPLATE_MENUS",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "nutrition_list_template_menus"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "template_menu_list",
        summary: `Fetched ${Array.isArray(data) ? data.length : 0} template menus.`,
        data,
        audit: buildToolAudit(context, "nutrition_list_template_menus"),
      });
    },
  },

  nutrition_get_template_menu: {
    description: "Fetch a nutrition template menu by id.",
    parameters: {
      type: "object",
      properties: { menuId: { type: "string" } },
      required: ["menuId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_GET_TEMPLATE_MENU",
        sender: "coach",
        context,
        pathParams: { menuId: args.menuId },
        audit: buildToolAudit(context, "nutrition_get_template_menu"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "template_menu",
        entityId: args.menuId,
        summary: `Fetched template menu ${args.menuId}.`,
        data,
        audit: buildToolAudit(context, "nutrition_get_template_menu"),
      });
    },
  },

  nutrition_update_template_menu: {
    description: "Update a template menu.",
    parameters: {
      type: "object",
      properties: {
        menuId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["menuId", "payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_UPDATE_TEMPLATE_MENU",
        sender: "coach",
        context,
        pathParams: { menuId: args.menuId },
        body: args.payload,
        audit: buildToolAudit(context, "nutrition_update_template_menu"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "template_menu",
        entityId: args.menuId,
        summary: `Updated template menu ${args.menuId}.`,
        data,
        audit: buildToolAudit(context, "nutrition_update_template_menu"),
      });
    },
  },

  nutrition_list_client_menus: {
    description: "List client menus for a given client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
      },
      required: [],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("nutrition_list_client_menus", args, context);
      const res = await callGateway({
        contractKey: "NUTRITION_LIST_CLIENT_MENUS",
        sender: "coach",
        context: { ...context, clientId },
        query: { clientId },
        audit: buildToolAudit(context, "nutrition_list_client_menus", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "client_menu_list",
        entityId: clientId,
        summary: `Fetched client menus for ${clientId}.`,
        data,
        audit: buildToolAudit(context, "nutrition_list_client_menus", clientId),
      });
    },
  },

  nutrition_get_client_menu: {
    description: "Fetch a client menu by id.",
    parameters: {
      type: "object",
      properties: { menuId: { type: "string" } },
      required: ["menuId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_GET_CLIENT_MENU",
        sender: "coach",
        context,
        pathParams: { menuId: args.menuId },
        audit: buildToolAudit(context, "nutrition_get_client_menu"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "client_menu",
        entityId: args.menuId,
        summary: `Fetched client menu ${args.menuId}.`,
        data,
        audit: buildToolAudit(context, "nutrition_get_client_menu"),
      });
    },
  },

  nutrition_update_client_menu: {
    description: "Update a client menu.",
    parameters: {
      type: "object",
      properties: {
        menuId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["menuId", "payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_UPDATE_CLIENT_MENU",
        sender: "coach",
        context,
        pathParams: { menuId: args.menuId },
        body: args.payload,
        audit: buildToolAudit(context, "nutrition_update_client_menu", context.clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "client_menu",
        entityId: args.menuId,
        summary: `Updated client menu ${args.menuId}.`,
        data,
        audit: buildToolAudit(context, "nutrition_update_client_menu", context.clientId),
      });
    },
  },

  nutrition_create_client_menu_from_template: {
    description: "Create a client menu from template for the active client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        templateMenuId: { type: "string" },
      },
      required: ["templateMenuId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId(
        "nutrition_create_client_menu_from_template",
        args,
        context
      );
      const res = await callGateway({
        contractKey: "NUTRITION_CREATE_CLIENT_MENU_FROM_TEMPLATE",
        sender: "coach",
        context: { ...context, clientId },
        body: {
          clientId,
          templateMenuId: args.templateMenuId,
        },
        audit: buildToolAudit(
          context,
          "nutrition_create_client_menu_from_template",
          clientId
        ),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "client_menu",
        entityId: data?.id || null,
        summary: `Created client menu from template ${args.templateMenuId}.`,
        data,
        audit: buildToolAudit(
          context,
          "nutrition_create_client_menu_from_template",
          clientId
        ),
      });
    },
  },

  nutrition_list_food: {
    description: "List available foods.",
    parameters: { type: "object", properties: {}, required: [], additionalProperties: false },
    async run(_args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_LIST_FOOD",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "nutrition_list_food"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "food_list",
        summary: `Fetched ${Array.isArray(data) ? data.length : 0} food items.`,
        data,
        audit: buildToolAudit(context, "nutrition_list_food"),
      });
    },
  },

  nutrition_list_vitamins: {
    description: "List available vitamins.",
    parameters: { type: "object", properties: {}, required: [], additionalProperties: false },
    async run(_args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_LIST_VITAMINS",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "nutrition_list_vitamins"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "vitamin_list",
        summary: `Fetched ${Array.isArray(data) ? data.length : 0} vitamins.`,
        data,
        audit: buildToolAudit(context, "nutrition_list_vitamins"),
      });
    },
  },

  nutrition_update_meal_template: {
    description: "Update a meal template.",
    parameters: {
      type: "object",
      properties: {
        templateId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["templateId", "payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "NUTRITION_UPDATE_MEAL_TEMPLATE",
        sender: "coach",
        context,
        pathParams: { templateId: args.templateId },
        body: args.payload,
        audit: buildToolAudit(context, "nutrition_update_meal_template"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "meal_template",
        entityId: args.templateId,
        summary: `Updated meal template ${args.templateId}.`,
        data,
        audit: buildToolAudit(context, "nutrition_update_meal_template"),
      });
    },
  },

  workout_list_templates: {
    description: "List workout templates.",
    parameters: { type: "object", properties: {}, required: [], additionalProperties: false },
    async run(_args, context) {
      const res = await callGateway({
        contractKey: "WORKOUT_LIST_TEMPLATES",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "workout_list_templates"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_template_list",
        summary: `Fetched ${Array.isArray(data) ? data.length : 0} workout templates.`,
        data,
        audit: buildToolAudit(context, "workout_list_templates"),
      });
    },
  },

  workout_create_template: {
    description: "Create workout template.",
    parameters: {
      type: "object",
      properties: {
        payload: { type: "object" },
      },
      required: ["payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const res = await callGateway({
        contractKey: "WORKOUT_CREATE_TEMPLATE",
        sender: "coach",
        context,
        body: args.payload,
        audit: buildToolAudit(context, "workout_create_template"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_template",
        entityId: data?.id || null,
        summary: "Created workout template.",
        data,
        audit: buildToolAudit(context, "workout_create_template"),
      });
    },
  },

  workout_list_exercises: {
    description: "List workout exercises.",
    parameters: { type: "object", properties: {}, required: [], additionalProperties: false },
    async run(_args, context) {
      const res = await callGateway({
        contractKey: "WORKOUT_LIST_EXERCISES",
        sender: "coach",
        context,
        audit: buildToolAudit(context, "workout_list_exercises"),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "exercise_list",
        summary: `Fetched ${Array.isArray(data) ? data.length : 0} exercises.`,
        data,
        audit: buildToolAudit(context, "workout_list_exercises"),
      });
    },
  },

  workout_upload_exercise_video: {
    description: "Upload exercise video (requires file upload path; if unavailable escalate).",
    parameters: {
      type: "object",
      properties: {
        exerciseId: { type: "string" },
        file: { type: "string" },
      },
      required: ["exerciseId"],
      additionalProperties: false,
    },
    async run(args, context) {
      return normalizeToolResult({
        ok: false,
        entityType: "exercise_video_upload",
        entityId: args.exerciseId,
        summary:
          "Direct file upload is not supported in this assistant call path; escalate to manual upload flow.",
        data: null,
        meta: {
          status: "escalation_required",
          reason: "multipart_upload_required",
          recommendedNextStep: "Use the workout exercise upload endpoint from UI/manual flow.",
        },
        audit: buildToolAudit(context, "workout_upload_exercise_video"),
      });
    },
  },

  workout_list_client_programs: {
    description: "List workout programs for active client.",
    parameters: {
      type: "object",
      properties: { clientId: { type: "string" } },
      required: [],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("workout_list_client_programs", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_LIST_CLIENT_PROGRAMS",
        sender: "coach",
        context: { ...context, clientId },
        pathParams: { clientId },
        audit: buildToolAudit(context, "workout_list_client_programs", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_program_list",
        entityId: clientId,
        summary: `Fetched workout programs for client ${clientId}.`,
        data,
        audit: buildToolAudit(context, "workout_list_client_programs", clientId),
      });
    },
  },

  workout_get_client_program: {
    description: "Get one workout program for active client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        programId: { type: "string" },
      },
      required: ["programId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("workout_get_client_program", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_GET_CLIENT_PROGRAM",
        sender: "coach",
        context: { ...context, clientId },
        pathParams: {
          clientId,
          programId: args.programId,
        },
        audit: buildToolAudit(context, "workout_get_client_program", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_program",
        entityId: args.programId,
        summary: `Fetched workout program ${args.programId}.`,
        data,
        audit: buildToolAudit(context, "workout_get_client_program", clientId),
      });
    },
  },

  workout_create_client_program: {
    description: "Create a workout program for active client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("workout_create_client_program", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_CREATE_CLIENT_PROGRAM",
        sender: "coach",
        context: { ...context, clientId },
        pathParams: { clientId },
        body: args.payload,
        audit: buildToolAudit(context, "workout_create_client_program", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_program",
        entityId: data?.id || null,
        summary: "Created workout program.",
        data,
        audit: buildToolAudit(context, "workout_create_client_program", clientId),
      });
    },
  },

  workout_update_client_program: {
    description: "Update a workout program for active client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        programId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["programId", "payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("workout_update_client_program", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_UPDATE_CLIENT_PROGRAM",
        sender: "coach",
        context: { ...context, clientId },
        pathParams: {
          clientId,
          programId: args.programId,
        },
        body: args.payload,
        audit: buildToolAudit(context, "workout_update_client_program", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_program",
        entityId: args.programId,
        summary: `Updated workout program ${args.programId}.`,
        data,
        audit: buildToolAudit(context, "workout_update_client_program", clientId),
      });
    },
  },

  workout_delete_client_program: {
    description: "Delete a workout program for active client.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        programId: { type: "string" },
      },
      required: ["programId"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("workout_delete_client_program", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_DELETE_CLIENT_PROGRAM",
        sender: "coach",
        context: { ...context, clientId },
        pathParams: {
          clientId,
          programId: args.programId,
        },
        audit: buildToolAudit(context, "workout_delete_client_program", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_program",
        entityId: args.programId,
        summary: `Deleted workout program ${args.programId}.`,
        data,
        audit: buildToolAudit(context, "workout_delete_client_program", clientId),
      });
    },
  },

  coach_log_workout: {
    description: "Log workout for active client via tracking service.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("coach_log_workout", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_LOG_CREATE",
        sender: "coach",
        context: { ...context, clientId },
        body: args.payload,
        audit: buildToolAudit(context, "coach_log_workout", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_log",
        entityId: data?.id || null,
        summary: "Logged workout for client.",
        data,
        audit: buildToolAudit(context, "coach_log_workout", clientId),
      });
    },
  },

  coach_update_workout_log: {
    description: "Update workout log for active client via tracking service.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string" },
        logId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["logId", "payload"],
      additionalProperties: false,
    },
    async run(args, context) {
      const clientId = requireClientId("coach_update_workout_log", args, context);
      const res = await callGateway({
        contractKey: "WORKOUT_LOG_UPDATE",
        sender: "coach",
        context: { ...context, clientId },
        pathParams: { logId: args.logId },
        body: args.payload,
        audit: buildToolAudit(context, "coach_update_workout_log", clientId),
      });
      const data = unwrapGatewayData(res);
      return normalizeToolResult({
        entityType: "workout_log",
        entityId: args.logId,
        summary: `Updated workout log ${args.logId}.`,
        data,
        audit: buildToolAudit(context, "coach_update_workout_log", clientId),
      });
    },
  },
};

export function getCoachToolNames() {
  return Object.keys(coachCapabilityMap);
}

export async function runCoachTool(toolName, args, context) {
  const capability = coachCapabilityMap[toolName];
  if (!capability) {
    throw new Error(`Unknown coach tool: ${toolName}`);
  }
  return capability.run(args || {}, context);
}
