// src/services/clientMenu/helpers/vitamins.js

const addClientMenuVitamins = async (tx, menuId, vitaminsToAdd = []) => {
    if (!vitaminsToAdd?.length) return;
  
    for (const v of vitaminsToAdd) {
      await tx.clientMenuVitamin.create({
        data: {
          clientMenuId: menuId,
          vitaminId: v.vitaminId ?? null,
          name: v.name,
          description: v.description ?? null,
        },
      });
    }
  };
  
  const updateClientMenuVitamins = async (tx, menuId, vitaminsToUpdate = []) => {
    if (!vitaminsToUpdate?.length) return;
  
    for (const v of vitaminsToUpdate) {
      await tx.clientMenuVitamin.update({
        where: { id: v.id },
        data: {
          vitaminId: v.vitaminId ?? undefined,
          name: v.name ?? undefined,
          description: v.description ?? undefined,
        },
      });
    }
  };
  
  const deleteClientMenuVitamins = async (tx, menuId, vitaminsToDelete = []) => {
    if (!vitaminsToDelete?.length) return;
  
    await tx.clientMenuVitamin.deleteMany({
      where: { id: { in: vitaminsToDelete.map(v => v.id) }, clientMenuId: menuId },
    });
  };
  
  module.exports = {
    addClientMenuVitamins,
    updateClientMenuVitamins,
    deleteClientMenuVitamins,
  };
  