import { useUpdateTemplateMenu } from "@/hooks/nutrition/useTemplateMenus";
import { useUpdateClientMenu } from "@/hooks/nutrition/useClientMenus";
import { useUpdateMealTemplate } from "@/hooks/nutrition/useMealTemplates";
import type { UINutritionSource } from "@/types/ui/nutrition/nutrition.types";

import type {
  ClientMenuUpdateRequestDto,
  TemplateMenuUpdateRequestDto,
  MealTemplateUpdateRequestDto,
} from "@common/api/sdk/schemas";

type VitaminInput = {
  vitaminId?: string | null;
  name: string;
  description?: string | null;
  notes?: string | null; 
};

type ClientItemInput = {
  foodItemId: string;
  role: string;
  grams?: number;
};

export function useNutritionMenuMutation(source: UINutritionSource) {
  const templateMenuMutation = useUpdateTemplateMenu();
  const clientMenuMutation = useUpdateClientMenu();

  const mealTemplateMutation = useUpdateMealTemplate();

  const isPending =
    source === "client"
      ? clientMenuMutation.isPending
      : templateMenuMutation.isPending || mealTemplateMutation.isPending;

  const isError =
    source === "client"
      ? clientMenuMutation.isError
      : templateMenuMutation.isError || mealTemplateMutation.isError;

  const error =
    source === "client"
      ? clientMenuMutation.error
      : templateMenuMutation.error ?? mealTemplateMutation.error;

  function mutateTemplateMenu(menuId: string, data: TemplateMenuUpdateRequestDto) {
    templateMenuMutation.mutate({ id: menuId, data });
  }

  function mutateClientMenu(menuId: string, data: ClientMenuUpdateRequestDto) {
    clientMenuMutation.mutate({ id: menuId, data });
  }

  function mutateMealTemplate(mealTemplateId: string, data: MealTemplateUpdateRequestDto) {
    mealTemplateMutation.mutate({ id: mealTemplateId, data });
  }

  return {
    isPending,
    isError,
    error,

    /* ===============================
       Notes
    =============================== */

    updateNotes(menuId: string, notes: string | null) {
      if (source === "client") {
        mutateClientMenu(menuId, { notes });
      } else {
        mutateTemplateMenu(menuId, { notes });
      }
    },

    /* ===============================
       Vitamins
    =============================== */

    addVitamin(menuId: string, vitamin: VitaminInput) {
      if (source === "client") {
        const payload: ClientMenuUpdateRequestDto = {
          vitaminsToAdd: [
            {
              vitaminId: vitamin.vitaminId ?? null,
              name: vitamin.name,
              description: vitamin.description ?? null,
              notes: vitamin.notes ?? null,
            },
          ],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      const payload: TemplateMenuUpdateRequestDto = {
        vitaminsToAdd: [
          {
            vitaminId: vitamin.vitaminId ?? null,
            name: vitamin.name,
            description: vitamin.description ?? null,
          },
        ],
      };
      mutateTemplateMenu(menuId, payload);
    },

    removeVitamin(menuId: string, vitaminRelationId: string) {
      if (source === "client") {
        const payload: ClientMenuUpdateRequestDto = {
          vitaminsToDelete: [{ id: vitaminRelationId }],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      const payload: TemplateMenuUpdateRequestDto = {
        vitaminsToDelete: [{ id: vitaminRelationId }],
      };
      mutateTemplateMenu(menuId, payload);
    },

    /* ===============================
       Meals
    =============================== */

    addMeal(
      menuId: string,
      args:
        | {
            source: "template";
            name: string;
            notes?: string | null;
            totalCalories?: number;
          }
        | {
            source: "client";
            name: string;
            notes?: string | null;
            totalCalories: number;
          }
    ) {
      if (source === "client") {
        // ClientMenuMealAddDto: { name, notes?, totalCalories }
        const payload: ClientMenuUpdateRequestDto = {
          mealsToAdd: [
            {
              name: args.name,
              notes: args.notes ?? null,
              totalCalories: args.totalCalories,
            },
          ],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      // TemplateMenuMealDto: { name, notes?, totalCalories?, options? }
      const payload: TemplateMenuUpdateRequestDto = {
        mealsToAdd: [
          {
            name: args.name,
            notes: args.notes ?? null,
            totalCalories: args.totalCalories,
          },
        ],
      };
      mutateTemplateMenu(menuId, payload);
    },

    updateMeal(
      menuId: string,
      mealId: string,
      data: { name?: string; notes?: string | null; totalCalories?: number }
    ) {
      if (source === "client") {
        const payload: ClientMenuUpdateRequestDto = {
          mealsToUpdate: [
            {
              id: mealId,
              name: data.name,
              notes: data.notes,
              totalCalories: data.totalCalories,
            },
          ],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      const payload: TemplateMenuUpdateRequestDto = {
        mealsToUpdate: [
          {
            id: mealId,
            name: data.name,
            notes: data.notes,
            totalCalories: data.totalCalories,
          },
        ],
      };
      mutateTemplateMenu(menuId, payload);
    },

    removeMeal(menuId: string, mealId: string) {
      if (source === "client") {
        const payload: ClientMenuUpdateRequestDto = {
          mealsToDelete: [{ id: mealId }],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      const payload: TemplateMenuUpdateRequestDto = {
        mealsToDelete: [{ id: mealId }],
      };
      mutateTemplateMenu(menuId, payload);
    },

    /* ===============================
       Meal Options
    =============================== */

    addMealOption(
      menuId: string,
      args:
        | {
            source: "client";
            mealId: string;
            mealTemplateId?: string;
            name?: string | null;
            orderIndex?: number;
            items: ClientItemInput[]; 
          }
        | {
            source: "template";
            mealId: string;
            mealTemplateId?: string;
            template?: {
              name: string;
              kind?: string;
              items?: ClientItemInput[];
            };
            name?: string | null;
            orderIndex?: number;
          }
    ) {
      if (source === "client") {
        if (args.source !== "client") return;

        const payload: ClientMenuUpdateRequestDto = {
          mealOptionsToAdd: [
            {
              mealId: args.mealId,
              mealTemplateId: args.mealTemplateId,
              name: args.name ?? null,
              orderIndex: args.orderIndex,
              items: args.items, 
            },
          ],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      if (args.source !== "template") return;

      const payload: TemplateMenuUpdateRequestDto = {
        mealOptionsToAdd: [
          {
            mealId: args.mealId,
            mealTemplateId: args.mealTemplateId,
            name: args.name ?? null,
            orderIndex: args.orderIndex,
            template: args.template
              ? {
                  name: args.template.name,
                  kind: args.template.kind,
                  items: args.template.items,
                }
              : undefined,
          },
        ],
      };
      mutateTemplateMenu(menuId, payload);
    },

    removeMealOption(menuId: string, optionId: string) {
      if (source === "client") {
        const payload: ClientMenuUpdateRequestDto = {
          mealOptionsToDelete: [{ id: optionId }],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

      const payload: TemplateMenuUpdateRequestDto = {
        mealOptionsToDelete: [{ id: optionId }],
      };
      mutateTemplateMenu(menuId, payload);
    },

    selectMealOption(menuId: string, mealId: string, optionId: string | null) {
      if (source !== "client") return;

      const payload: ClientMenuUpdateRequestDto = {
        mealsToUpdate: [
          {
            id: mealId,
            selectedOptionId: optionId,
          },
        ],
      };
      mutateClientMenu(menuId, payload);
    },

    /* ===============================
       Client Items (add/update/delete)
    =============================== */

    addClientItem(menuId: string, mealOptionId: string, item: ClientItemInput) {
      if (source !== "client") return;

      const payload: ClientMenuUpdateRequestDto = {
        mealOptionsToUpdate: [
          {
            id: mealOptionId,
            itemsToAdd: [
              {
                foodItemId: item.foodItemId,
                role: item.role,
                grams: item.grams,
              },
            ],
          },
        ],
      };
      mutateClientMenu(menuId, payload);
    },

    updateClientItem(
      menuId: string,
      mealOptionId: string,
      item: { id: string; role?: string; grams?: number }
    ) {
      if (source !== "client") return;

      const payload: ClientMenuUpdateRequestDto = {
        mealOptionsToUpdate: [
          {
            id: mealOptionId,
            itemsToUpdate: [
              {
                id: item.id,
                role: item.role,
                grams: item.grams,
              },
            ],
          },
        ],
      };
      mutateClientMenu(menuId, payload);
    },

    removeClientItem(menuId: string, mealOptionId: string, itemId: string) {
      if (source !== "client") return;

      const payload: ClientMenuUpdateRequestDto = {
        mealOptionsToUpdate: [
          {
            id: mealOptionId,
            itemsToDelete: [{ id: itemId }],
          },
        ],
      };
      mutateClientMenu(menuId, payload);
    },

    /* ===============================
       Template Items (MealTemplate)
    =============================== */

    addTemplateItem(
      mealTemplateId: string,
      item: { foodItemId: string; role: string; grams?: number }
    ) {
      if (source !== "template") return;

      mutateMealTemplate(mealTemplateId, {
        itemsToAdd: [
          {
            foodItemId: item.foodItemId,
            role: item.role,
            grams: item.grams,
          },
        ],
      });
    },

    updateTemplateItem(
      mealTemplateId: string,
      item: { id: string; foodItemId?: string; role?: string; grams?: number }
    ) {
      if (source !== "template") return;

      mutateMealTemplate(mealTemplateId, {
        itemsToUpdate: [
          {
            id: item.id,
            foodItemId: item.foodItemId,
            role: item.role,
            grams: item.grams,
          },
        ],
      });
    },

    removeTemplateItem(mealTemplateId: string, itemId: string) {
      if (source !== "template") return;

      mutateMealTemplate(mealTemplateId, {
        itemsToDelete: [{ id: itemId }],
      });
    },
  };
}
