import { ScrollView, View, ActivityIndicator, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";

import NutritionTabs from "../../../src/components/nutrition/NutritionTabs";
import NutritionDayCard from "../../../src/components/nutrition/NutritionDayCard";

import { useTemplateMenus } from "../../../src/hooks/nutrition/useTemplateMenus";
import { mapTemplateMenuToNutritionPlan } from "../../../src/utils/mapTemplateMenuToNutritionPlan";
import { UINutritionPlan } from "../../../src/types/nutrition-ui";

export default function NutritionPlansScreen() {
  const {
    data,
    isLoading,
    error,
  } = useTemplateMenus(); // UseQueryResult<TemplateMenu[], Error>

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const menus = data ?? [];
  const uiPlans: UINutritionPlan[] = menus.map(mapTemplateMenuToNutritionPlan);

  useEffect(() => {
    if (uiPlans.length > 0 && !activeTab) {
      setActiveTab(uiPlans[0].id);
    }
  }, [uiPlans, activeTab]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error.message}</Text>
      </View>
    );
  }

  if (!uiPlans.length) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No nutrition templates available</Text>
      </View>
    );
  }

  const activeId = activeTab ?? uiPlans[0].id;
  const activePlan = uiPlans.find((p) => p.id === activeId) ?? uiPlans[0];

  const tabs = uiPlans.map((p) => ({
    id: p.id,
    label: p.dayType === "TRAINING" ? "יום אימון" : "יום מנוחה",
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
        <NutritionTabs tabs={tabs} active={activeId} onChange={setActiveTab} />

        <Pressable
          onPress={() => {
            console.log("TODO: open create-template flow");
          }}
          style={{
            backgroundColor: "#22c55e",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
            + New Template
          </Text>
        </Pressable>
      </View>

      <NutritionDayCard plan={activePlan} />
    </ScrollView>
  );
}
