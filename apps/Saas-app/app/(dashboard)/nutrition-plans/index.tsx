// app/(dashboard)/nutrition-plans/index.tsx
import { ScrollView, View, ActivityIndicator, Text } from "react-native";
import { useState, useEffect } from "react";

import NutritionTabs from "../../../src/components/nutrition/NutritionTabs";
import NutritionDayCard from "../../../src/components/nutrition/NutritionDayCard";

import { useTemplateMenus } from "../../../src/hooks/useTemplateMenus";
import { mapTemplateMenuToNutritionPlan } from "../../../src/utils/mapTemplateMenuToNutritionPlan";
import { NutritionPlan } from "../../../src/types/nutrition";

export default function NutritionPlansScreen() {
  const { menus, loading, error } = useTemplateMenus();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const uiPlans: NutritionPlan[] = menus.map(mapTemplateMenuToNutritionPlan);

  useEffect(() => {
    if (uiPlans.length > 0 && !activeTab) {
      setActiveTab(uiPlans[0].id);
    }
  }, [uiPlans]);
  
  console.log("🔍 MENUS =", menus);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (uiPlans.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>אין תבניות תזונה זמינות כרגע</Text>
      </View>
    );
  }

  const activePlan = uiPlans.find((p) => p.id === activeTab) ?? uiPlans[0];

  const tabs = uiPlans.map((p) => ({
    id: p.id,
    label: p.dayType === "training" ? "תפריט יום אימון" : "תפריט יום מנוחה",
  }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <NutritionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <NutritionDayCard plan={activePlan} />
    </ScrollView>
  );
}
