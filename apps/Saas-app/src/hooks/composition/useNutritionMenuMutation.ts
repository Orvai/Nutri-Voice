import { useUpdateTemplateMenu } from "@/hooks/nutrition/useTemplateMenus";
import { useUpdateClientMenu } from "@/hooks/nutrition/useClientMenus";
import { useUpdateMealTemplate } from "@/hooks/nutrition/useMealTemplates";
import type { UINutritionSource } from "@/types/ui/nutrition/nutrition.types";

import type {
  ClientMenuUpdateRequestDto,
  TemplateMenuUpdateRequestDto,
  MealTemplateUpdateRequestDto,
} from "@common/api/sdk/schemas";

/* ===============================
   Local input types (UI-level)
================================ */

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

type AddMealInput = {
  name: string;
  notes?: string | null;
  totalCalories?: number;
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

  /* ===============================
     Low-level helpers
  =============================== */

  function mutateTemplateMenu(
    menuId: string,
    data: TemplateMenuUpdateRequestDto
  ) {
    templateMenuMutation.mutate({ id: menuId, data });
  }

  function mutateClientMenu(
    menuId: string,
    data: ClientMenuUpdateRequestDto
  ) {
    clientMenuMutation.mutate({ id: menuId, data });
  }

  function mutateMealTemplate(
    mealTemplateId: string,
    data: MealTemplateUpdateRequestDto
  ) {
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
        mutateClientMenu(menuId, {
          vitaminsToDelete: [{ id: vitaminRelationId }],
        });
        return;
      }

      mutateTemplateMenu(menuId, {
        vitaminsToDelete: [{ id: vitaminRelationId }],
      });
    },

    /* ===============================
       Meals
    =============================== */

    addMeal(menuId: string, args: AddMealInput) {
      if (source === "client") {
        // Client requires totalCalories → default here (UI does not know)
        const payload: ClientMenuUpdateRequestDto = {
          mealsToAdd: [
            {
              name: args.name,
              notes: args.notes ?? null,
              totalCalories: args.totalCalories ?? 0,
            },
          ],
        };
        mutateClientMenu(menuId, payload);
        return;
      }

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
        mutateClientMenu(menuId, {
          mealsToUpdate: [
            {
              id: mealId,
              name: data.name,
              notes: data.notes,
              totalCalories: data.totalCalories,
            },
          ],
        });
        return;
      }

      mutateTemplateMenu(menuId, {
        mealsToUpdate: [
          {
            id: mealId,
            name: data.name,
            notes: data.notes,
            totalCalories: data.totalCalories,
          },
        ],
      });
    },

    removeMeal(menuId: string, mealId: string) {
      if (source === "client") {
        mutateClientMenu(menuId, {
          mealsToDelete: [{ id: mealId }],
        });
        return;
      }

      mutateTemplateMenu(menuId, {
        mealsToDelete: [{ id: mealId }],
      });
    },

    /* ===============================
   Meal Options
================================ */

addMealOption(
  menuId: string,
  args:
    | {
        mealId: string;
        mealTemplateId?: string;
        name?: string | null;
        orderIndex?: number;
        items: ClientItemInput[];
      }
    | {
        mealId: string;
        mealTemplateId?: string;
        name?: string | null;
        orderIndex?: number;
        template?: {
          name: string;
          kind?: string;
          items?: ClientItemInput[];
        };
      }
) {
  /* ======================
     CLIENT MENU
  ====================== */
  if (source === "client") {
    const clientArgs = args as {
      mealId: string;
      mealTemplateId?: string;
      name?: string | null;
      orderIndex?: number;
      items?: ClientItemInput[];
    };

    // 🔒 Client menu currently supports ONLY items-based options
    if (!clientArgs.items) {
      throw new Error(
        "Client menu requires items when adding meal option"
      );
    }

    mutateClientMenu(menuId, {
      mealOptionsToAdd: [
        {
          mealId: clientArgs.mealId,
          mealTemplateId: clientArgs.mealTemplateId, // optional (future use)
          name: clientArgs.name ?? null,
          orderIndex: clientArgs.orderIndex,
          items: clientArgs.items,
        },
      ],
    });
    return;
  }

  /* ======================
     TEMPLATE MENU
  ====================== */

  const templateArgs = args as {
    mealId: string;
    mealTemplateId?: string;
    name?: string | null;
    orderIndex?: number;
    template?: {
      name: string;
      kind?: string;
      items?: ClientItemInput[];
    };
  };


  if (!templateArgs.mealTemplateId && !templateArgs.template) {
    throw new Error(
      "Template menu requires either mealTemplateId or template when adding meal option"
    );
  }

  mutateTemplateMenu(menuId, {
    mealOptionsToAdd: [
      {
        mealId: templateArgs.mealId,
        mealTemplateId: templateArgs.mealTemplateId,
        name: templateArgs.name ?? null,
        orderIndex: templateArgs.orderIndex,
        template: templateArgs.template
          ? {
              name: templateArgs.template.name,
              kind: templateArgs.template.kind,
              items: templateArgs.template.items,
            }
          : undefined,
      },
    ],
  });
},

removeMealOption(menuId: string, optionId: string) {
  if (source === "client") {
    mutateClientMenu(menuId, {
      mealOptionsToDelete: [{ id: optionId }],
    });
    return;
  }

  mutateTemplateMenu(menuId, {
    mealOptionsToDelete: [{ id: optionId }],
  });
},

selectMealOption(menuId: string, mealId: string, optionId: string | null) {
  // 🔒 Only client menus support selection
  if (source !== "client") return;

  mutateClientMenu(menuId, {
    mealsToUpdate: [
      {
        id: mealId,
        selectedOptionId: optionId,
      },
    ],
  });
},

    /* ===============================
       Client Items
    =============================== */

    addClientItem(menuId: string, mealOptionId: string, item: ClientItemInput) {
      if (source !== "client") return;

      mutateClientMenu(menuId, {
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
      });
    },

    updateClientItem(
      menuId: string,
      mealOptionId: string,
      item: { id: string; role?: string; grams?: number }
    ) {
      if (source !== "client") return;

      mutateClientMenu(menuId, {
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
      });
    },

    removeClientItem(menuId: string, mealOptionId: string, itemId: string) {
      if (source !== "client") return;

      mutateClientMenu(menuId, {
        mealOptionsToUpdate: [
          {
            id: mealOptionId,
            itemsToDelete: [{ id: itemId }],
          },
        ],
      });
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
