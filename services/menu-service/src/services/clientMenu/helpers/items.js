// src/services/clientMenu/helpers/items.js

const withStatus = (e, s = 400) => Object.assign(e, { status: s });

const fetchFoodItemOrThrow = async (tx, id) => {
  const item = await tx.foodItem.findUnique({ where: { id } });
  if (!item) {
    throw withStatus(new Error(`FoodItem not found: ${id}`), 400);
  }
  return item;
};

const fetchOptionItemOrThrow = async (tx, itemId, optionId) => {
  const item = await tx.clientMenuMealOptionItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.optionId !== optionId) {
    throw withStatus(
      new Error("ClientMenuMealOptionItem not found"),
      404
    );
  }

  return item;
};

// DELETE ITEMS (by option)
const deleteOptionItems = async (tx, optionId, itemsToDelete = []) => {
  if (!itemsToDelete?.length) return;

  await tx.clientMenuMealOptionItem.deleteMany({
    where: {
      id: { in: itemsToDelete.map((i) => i.id) },
      optionId,
    },
  });
};

// UPDATE ITEMS
const updateOptionItems = async (tx, optionId, itemsToUpdate = []) => {
  if (!itemsToUpdate?.length) return;

  for (const item of itemsToUpdate) {
    const existing = await fetchOptionItemOrThrow(
      tx,
      item.id,
      optionId
    );

    if (item.foodItemId) {
      await fetchFoodItemOrThrow(tx, item.foodItemId);
    }

    await tx.clientMenuMealOptionItem.update({
      where: { id: existing.id },
      data: {
        foodItemId: item.foodItemId ?? existing.foodItemId,
        role: item.role ?? existing.role,
        grams: item.grams ?? existing.grams,
      },
    });
  }
};

// ADD ITEMS
const addOptionItems = async (tx, optionId, itemsToAdd = []) => {
  if (!itemsToAdd?.length) return;

  for (const item of itemsToAdd) {
    await fetchFoodItemOrThrow(tx, item.foodItemId);

    await tx.clientMenuMealOptionItem.create({
      data: {
        optionId,
        foodItemId: item.foodItemId,
        role: item.role,
        grams: item.grams ?? 100,
      },
    });
  }
};

module.exports = {
  deleteOptionItems,
  updateOptionItems,
  addOptionItems,
};
