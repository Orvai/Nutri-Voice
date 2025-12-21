// llm/tools/getMenuContext.tool.js
import { getMenuContext } from "../../services/tools/menu-meal/getMenuContext.service.js";

export const getMenuContextTool = {
  name: "get_menu_context",
  description:
    "Fetches full nutrition menu context for the current day including meals, items, vitamins and notes",
  execute: async (args, context) => {
    return getMenuContext(args, context);
  },
};
