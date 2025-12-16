// src/services/clientMenu/helpers/recompute.js

const recomputeMenuCalories = async (tx, menuId) => {
  const meals = await tx.clientMenuMeal.findMany({
    where: { clientMenuId: menuId },
    select: { totalCalories: true },
  });

  const total = meals.reduce(
    (sum, meal) => sum + (meal.totalCalories ?? 0),
    0
  );

  await tx.clientMenu.update({
    where: { id: menuId },
    data: { totalCalories: total },
  });

  return total;
};

module.exports = {
  recomputeMenuCalories,
};
