import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";

import NutritionTabs from "../../../src/components/nutrition/NutritionTabs";
import NutritionDayCard from "../../../src/components/nutrition/NutritionDayCard";

import {useTemplateMenus,useTemplateMenu,} from "../../../src/hooks/nutrition/useTemplateMenus";
import { mapTemplateMenuToNutritionPlan } from "../../../src/utils/mapTemplateMenuToNutritionPlan";

export default function NutritionPlansScreen() {
  const {data: menus,isLoading: loadingMenus,error} = useTemplateMenus();

  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (menus && menus.length > 0 && !activeTab) {
      setActiveTab(menus[0].id);
    }
  }, [menus,activeTab]);
  const {
    data: fullMenu,
    isLoading: loadingMenu,
  } = useTemplateMenu(activeTab);

  if (loadingMenus || loadingMenu || !fullMenu) {
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
  if (!menus || menus.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No nutrition templates available</Text>
      </View>
    );
  }

  const plan = mapTemplateMenuToNutritionPlan(fullMenu);

  const tabs = menus.map((p) => ({
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
        <NutritionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <Pressable
          onPress={() => console.log("TODO: open create-template flow")}
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

      <NutritionDayCard plan={plan} />
    </ScrollView>
  );
}
