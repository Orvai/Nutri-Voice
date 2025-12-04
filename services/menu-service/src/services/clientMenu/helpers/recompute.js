// src/services/clientMenu/helpers/recompute.js

const recomputeMealCalories = async (tx, mealId) => {
    const agg = await tx.clientMenuMealItem.aggregate({
      where: { clientMenuMealId: mealId },
      _sum: { calories: true },
    });
  
    const total = agg._sum.calories ?? 0;
  
    await tx.clientMenuMeal.update({
      where: { id: mealId },
      data: { totalCalories: total },
    });
  
    return total;
  };
  
  const recomputeMenuCalories = async (tx, menuId) => {
    const agg = await tx.clientMenuMeal.aggregate({
      where: { clientMenuId: menuId },
      _sum: { totalCalories: true },
    });
  
    const total = agg._sum.totalCalories ?? 0;
  
    await tx.clientMenu.update({
      where: { id: menuId },
      data: { totalCalories: total },
    });
  
    return total;
  };
  
  module.exports = {
    recomputeMealCalories,
    recomputeMenuCalories,
  };
  