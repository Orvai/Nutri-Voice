// src/llm/tools/getMenuContext.tool.js
import { getMenuContext } from "../../../services/tools/menu-meal/getMenuContext.service.js";


export const getMenuContextTool = {
  name: "get_menu_context",
  description:
    "Fetches structured nutrition menu context for current day type, with normalized food index and menu match metadata. If day type is missing, returns requiresDayType=true instead of failing.",

  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },

  execute: async (args, context) => {
    return getMenuContext(args, context);
  },
};
