// src/services/clientMenu/helpers/items.js

const fetchFoodItemOrThrow = async (tx, id) => {
  const item = await tx.foodItem.findUnique({ where: { id } });
  if (!item) throw Object.assign(new Error(`FoodItem not found: ${id}`), { status: 400 });
  return item;
};

const fetchItemOrThrow = async (tx, itemId, mealId) => {
  const item = await tx.clientMenuMealItem.findUnique({ where: { id: itemId } });
  if (!item || item.clientMenuMealId !== mealId)
    throw Object.assign(new Error("ClientMenuMealItem not found"), { status: 404 });
  return item;
};

const computeCalories = (foodItem, quantity) => {
  if (!foodItem || foodItem.caloriesPer100g == null) return 0;
  return (foodItem.caloriesPer100g / 100) * quantity;
};

// DELETE ITEMS
const deleteMealItems = async (tx, mealId, itemsToDelete = []) => {
  if (!itemsToDelete?.length) return;

  await tx.clientMenuMealItem.deleteMany({
    where: { id: { in: itemsToDelete.map(i => i.id) }, clientMenuMealId: mealId },
  });
};

// UPDATE ITEMS (now supports defaultGrams)
const updateMealItems = async (tx, mealId, itemsToUpdate = []) => {
  if (!itemsToUpdate?.length) return;

  for (const item of itemsToUpdate) {
    const existing = await fetchItemOrThrow(tx, item.id, mealId);

    const newFood = item.foodItemId ?? existing.foodItemId;

    // Support defaultGrams for UI compatibility
    const newQty = item.quantity ?? item.defaultGrams ?? existing.quantity;

    const foodItem = await fetchFoodItemOrThrow(tx, newFood);
    const calories = computeCalories(foodItem, newQty);

    await tx.clientMenuMealItem.update({
      where: { id: existing.id },
      data: {
        foodItemId: newFood,
        quantity: newQty,
        calories,
        notes: item.notes ?? existing.notes,
      },
    });
  }
};

// ADD ITEMS (supports defaultGrams exactly like template menus)
const addMealItems = async (tx, mealId, itemsToAdd = []) => {
  if (!itemsToAdd?.length) return;

  for (const item of itemsToAdd) {
    const qty = item.quantity ?? item.defaultGrams ?? 100;

    const foodItem = await fetchFoodItemOrThrow(tx, item.foodItemId);
    const calories = computeCalories(foodItem, qty);

    await tx.clientMenuMealItem.create({
      data: {
        clientMenuMealId: mealId,
        foodItemId: item.foodItemId,
        quantity: qty,
        calories,
        notes: item.notes ?? null,
      },
    });
  }
};

module.exports = {
  deleteMealItems,
  updateMealItems,
  addMealItems,
  computeCalories,
};
