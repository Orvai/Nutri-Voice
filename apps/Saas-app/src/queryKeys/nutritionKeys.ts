export const nutritionKeys = {
    root: ["nutrition"] as const,
  
    vitamins: () => [...nutritionKeys.root, "vitamins"] as const,

    food: (search?: string) =>
      search
        ? [...nutritionKeys.root, "food", { search }] as const
        : [...nutritionKeys.root, "food"] as const,

    templateMenus: () =>
      [...nutritionKeys.root, "templateMenus"] as const,
  
    templateMenu: (id: string) =>
      [...nutritionKeys.root, "templateMenus", id] as const,

    clientMenus: (clientId?: string) =>
      [...nutritionKeys.root, "clientMenus", clientId] as const,
    clientMenu: (id: string) =>
      [...nutritionKeys.root, "clientMenus", id] as const,

  };