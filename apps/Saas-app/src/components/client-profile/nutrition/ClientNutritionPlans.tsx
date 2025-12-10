// src/components/client-profile/nutrition/ClientNutritionPlans.tsx

import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import NutritionTabs from "../../nutrition/NutritionTabs";
import NutritionDayCard from "../../nutrition/NutritionDayCard";
import { useClientMenu, useClientMenus } from "../../../hooks/nutrition/useClientMenus";
import { useTemplateMenus } from "../../../hooks/nutrition/useTemplateMenus";
import { useCreateClientMenuFromTemplate } from "../../../hooks/nutrition/useClientMenus";
import { mapClientMenuToNutritionPlan } from "../../../utils/mapClientMenuToNutritionPlan";

type Props = {
  clientId: string;
};

export default function ClientNutritionPlans({ clientId }: Props) {
  // Load existing client menus
  const {
    data: menus = [],
    isLoading: loadingMenus,
    error,
    refetch,
  } = useClientMenus(clientId);

  // Load coach template menus
  const {
    data: templates = [],
    isLoading: loadingTemplates,
  } = useTemplateMenus();

  const createMenu = useCreateClientMenuFromTemplate(clientId);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Auto-create client menus from all templates (e.g., HIGH + LOW)
  useEffect(() => {
    if (!loadingMenus && !loadingTemplates) {
      if (menus.length === 0 && templates.length > 0) {
        // Create client menus for each template
        templates.forEach((tmpl) => {
          createMenu.mutate({
            templateMenuId: tmpl.id,
            name: tmpl.name,
            selectedOptions: [],
          });
        });

        // Re-fetch client menus after creation
        refetch();
      }
    }
  }, [menus, templates, loadingMenus, loadingTemplates]);

  // Select first tab automatically
  useEffect(() => {
    if (menus.length > 0 && !activeTab) {
      setActiveTab(menus[0].id);
    }
  }, [menus, activeTab]);

  // Load full menu
  const {
    data: fullMenu,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab);

  const plan = useMemo(() => {
    if (!fullMenu) return null;
    return mapClientMenuToNutritionPlan(fullMenu);
  }, [fullMenu]);

  // Loading states
  if (loadingMenus || loadingTemplates || loadingMenu || !plan) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error.message}</Text>
      </View>
    );
  }

  // Tabs labels
  const tabs = menus.map((p) => ({
    id: p.id,
    label: p.type === "TRAINING" ? "יום אימון" : "יום מנוחה",
  }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <NutritionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <Pressable
          disabled
          style={{
            backgroundColor: "#e5e7eb",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            opacity: 0.8,
          }}
        >
          <Text style={{ color: "#374151", fontWeight: "700", fontSize: 13 }}>
            תפריט לקוח
          </Text>
        </Pressable>
      </View>

      <NutritionDayCard plan={plan} />
    </ScrollView>
  );
}
