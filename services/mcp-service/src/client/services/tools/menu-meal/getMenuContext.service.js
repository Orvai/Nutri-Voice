// services/tools/getMenuContext.service.js
import { callGateway } from "../../../../http/gatewayClient.js";
import { MenuContextDto } from "../../../../dtos/tools/menu-meal/menuContext.dto.js";

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\u0590-\u05FFa-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ");
}

function buildSynonyms(foodName) {
  const normalized = normalizeText(foodName);
  const tokens = normalized.split(" ").filter(Boolean);
  return [...new Set([normalized, ...tokens])];
}

function buildEmptyContext(dayType, mismatchReason = null) {
  return MenuContextDto.parse({
    requiresDayType: !dayType,
    availableDayTypes: ["TRAINING", "REST"],
    dayType: dayType || null,
    menuId: null,
    name: null,
    notes: null,
    menuItems: [],
    normalizedFoodIndex: [],
    candidateMatches: [],
    synonyms: {},
    portionUnits: ["גרם", "יחידה", "כף", "כוס"],
    inMenu: null,
    likelyMatch: null,
    mismatchReason,
    meals: [],
    vitamins: [],
  });
}

export async function getMenuContext(_, context) {
  const dayType = context?.dailyState?.dayType;
  if (!dayType) {
    return buildEmptyContext(null, "DAY_TYPE_MISSING");
  }

  const res = await callGateway({
    contractKey: "CLIENT_MENUS_LIST",
    sender: context.sender,
    context,
  });

  const menus = res?.data?.data ?? res?.data ?? res ?? [];
  const activeMenus = menus.filter((m) => m?.isActive);
  const menu = activeMenus.find((m) => m.type === dayType);

  if (!menu) {
    return buildEmptyContext(dayType, "NO_ACTIVE_MENU_FOR_DAY_TYPE");
  }

  const menuItems = [];
  const normalizedFoodIndex = [];
  const synonyms = {};

  for (const meal of menu.meals ?? []) {
    for (const opt of meal.options ?? []) {
      for (const item of opt.items ?? []) {
        const foodName = item.foodItem?.name;
        if (!foodName) continue;

        const foodItemId = item.foodItem?.id ?? null;
        const syns = buildSynonyms(foodName);
        const portionUnits = ["גרם", "יחידה", "כף", "כוס"];

        menuItems.push({
          foodItemId,
          foodName,
          role: item.role ?? null,
          grams: item.grams ?? null,
          caloriesPer100g: item.foodItem?.caloriesPer100g ?? null,
        });

        synonyms[foodName] = syns;

        for (const token of syns) {
          normalizedFoodIndex.push({
            token,
            foodItemId,
            foodName,
            synonyms: syns,
            portionUnits,
          });
        }
      }
    }
  }

  return MenuContextDto.parse({
    requiresDayType: false,
    availableDayTypes: ["TRAINING", "REST"],
    dayType: menu.type,
    menuId: menu.id,
    name: menu.name,
    notes: menu.notes ?? null,
    menuItems,
    normalizedFoodIndex,
    candidateMatches: [],
    synonyms,
    portionUnits: ["גרם", "יחידה", "כף", "כוס"],
    inMenu: null,
    likelyMatch: null,
    mismatchReason: null,
    meals: (menu.meals ?? []).map((meal) => ({
      id: meal.id,
      name: meal.name,
      notes: meal.notes ?? null,
      totalCalories: meal.totalCalories ?? 0,
      options: (meal.options ?? []).map((opt) => ({
        id: opt.id,
        name: opt.name ?? null,
        items: (opt.items ?? []).map((item) => ({
          foodItemId: item.foodItem?.id ?? null,
          foodName: item.foodItem?.name || "לא ידוע",
          role: item.role ?? null,
          grams: item.grams ?? null,
          caloriesPer100g: item.foodItem?.caloriesPer100g ?? null,
        })),
      })),
    })),
    vitamins: (menu.vitamins ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description ?? null,
      notes: v.notes ?? null,
    })),
  });
}
