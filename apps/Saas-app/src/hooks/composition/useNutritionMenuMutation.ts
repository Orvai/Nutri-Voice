import { useUpdateTemplateMenu } from "@/hooks/nutrition/useTemplateMenus";
import { useUpdateClientMenu } from "@/hooks/nutrition/useClientMenus";
import { UINutritionSource } from "@/types/ui/nutrition/nutrition.types";

/**
 * Facade hook for nutrition menu mutations
 * UI-facing, semantic API (no DTO leakage)
 */
export function useNutritionMenuMutation(source: UINutritionSource) {
  const templateMutation = useUpdateTemplateMenu();
  const clientMutation = useUpdateClientMenu();

  /* ===============================
     Generic state
  =============================== */

  const isPending =
    source === "client"
      ? clientMutation.isPending
      : templateMutation.isPending;

  const isError =
    source === "client"
      ? clientMutation.isError
      : templateMutation.isError;

  const error =
    source === "client"
      ? clientMutation.error
      : templateMutation.error;

  /* ===============================
     Internal helpers (typed)
  =============================== */

  function mutateTemplate(
    menuId: string,
    data: Parameters<typeof templateMutation.mutate>[0]["data"]
  ) {
    templateMutation.mutate({ id: menuId, data });
  }

  function mutateClient(
    menuId: string,
    data: Parameters<typeof clientMutation.mutate>[0]["data"]
  ) {
    clientMutation.mutate({ id: menuId, data });
  }

  return {
    isPending,
    isError,
    error,

    /* ===============================
   Notes
=============================== */

  updateNotes(menuId: string, notes: string | null) {
    const payload = {
      notes,
    };

    if (source === "client") {
      mutateClient(menuId, payload);
      return;
    }

    mutateTemplate(menuId, payload);
  },


    /* ===============================
       Vitamins
    =============================== */

    addVitamin(
      menuId: string,
      vitamin: {
        vitaminId?: string | null;
        name: string;
        description?: string | null;
      }
    ) {
      const payload = {
        vitaminsToAdd: [
          {
            vitaminId: vitamin.vitaminId,
            name: vitamin.name,
            description: vitamin.description,
          },
        ],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },

    removeVitamin(menuId: string, vitaminRelationId: string) {
      const payload = {
        vitaminsToDelete: [{ id: vitaminRelationId }],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },

    /* ===============================
       Meals
    =============================== */

    /**
     * TemplateMenu:
     * mealsToAdd => { name }
     *
     * ClientMenu:
     * mealsToAdd => { templateId }
     */
    addMeal(menuId: string, args: { name: string } | { templateId: string }) {
      if (source === "client") {
        mutateClient(menuId, {
          mealsToAdd: [{ templateId: (args as { templateId: string }).templateId }],
        });
        return;
      }

      mutateTemplate(menuId, {
        mealsToAdd: [{ name: (args as { name: string }).name }],
      });
    },

    updateMealCalories(menuId: string, mealId: string, totalCalories: number) {
      const payload = {
        mealsToUpdate: [{ id: mealId, totalCalories }],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },

    removeMeal(menuId: string, mealId: string) {
      const payload = {
        mealsToDelete: [{ id: mealId }],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },

    /* ===============================
       Meal Options
    =============================== */

    /**
     * Both TemplateMenu & ClientMenu:
     * mealOptionsToAdd => { mealId, mealTemplateId }
     */
    addMealOption(
      menuId: string,
      mealId: string,
      mealTemplateId: string,
      name?: string
    ) {
      const payload = {
        mealOptionsToAdd: [
          {
            mealId,
            mealTemplateId,
            name,
          },
        ],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },

    removeMealOption(menuId: string, optionId: string) {
      const payload = {
        mealOptionsToDelete: [{ id: optionId }],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },

    selectMealOption(menuId: string, mealId: string, optionId: string) {
      const payload = {
        mealsToUpdate: [{ id: mealId, selectedOptionId: optionId }],
      };

      if (source === "client") {
        mutateClient(menuId, payload);
        return;
      }

      mutateTemplate(menuId, payload);
    },
  };
}
