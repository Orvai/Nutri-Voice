// services/tools/getMenuContext.service.js
import axios from "axios";
import { MenuContextDto } from "../../dto/tools/menuContext.dto.js";

const GATEWAY_URL = process.env.GATEWAY_URL;

export async function getMenuContext(_, context) {
  const dayType = context?.dailyState?.dayType;

  if (!dayType) {
    throw new Error("Missing dayType in dailyState");
  }

  const res = await axios.get(
    `${GATEWAY_URL}/api/client-menus`,
    {
      headers: {
        Authorization: `Bearer ${context.userToken}`,
      },
    }
  );

  const menus = res.data?.data ?? [];

  const menu = menus.find(
    (m) => m.isActive && m.type === dayType
  );

  if (!menu) {
    throw new Error(`No active menu for dayType ${dayType}`);
  }

  const menuContext = {
    menuId: menu.id,
    name: menu.name,
    dayType: menu.type,
    notes: menu.notes,

    meals: menu.meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      notes: meal.notes,
      totalCalories: meal.totalCalories,

      options: meal.options.map((opt) => ({
        id: opt.id,
        name: opt.name,

        items: opt.items.map((item) => ({
          foodItemId: item.foodItem.id,
          foodName: item.foodItem.name,
          role: item.role,
          grams: item.grams,
          caloriesPer100g: item.foodItem.caloriesPer100g,
        })),
      })),
    })),

    vitamins: menu.vitamins.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      notes: v.notes,
    })),
  };

  return MenuContextDto.parse(menuContext);
}
