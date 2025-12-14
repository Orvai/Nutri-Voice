import {ScrollView,View,ActivityIndicator,Text,Pressable,} from "react-native";
import { useEffect, useState } from "react";
import NutritionTabs from "../../../src/components/nutrition/NutritionTabs";
import NutritionDayCard from "../../../src/components/nutrition/NutritionDayCard";
import {useTemplateMenus,useTemplateMenu,} from "../../../src/hooks/nutrition/useTemplateMenus";

export default function NutritionPlansScreen() {
  const {
    data: menus,
    isLoading: loadingMenus,
    error,
  } = useTemplateMenus();

  console.log("TEMPLATE MENUS:", menus, "loading:", loadingMenus);

  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    console.log("EFFECT RUN", { menus, activeTab });

    if (menus && menus.length > 0 && !activeTab) {
      console.log("SETTING ACTIVE TAB:", menus[0].id);

      setActiveTab(menus[0].id);
    }
  }, [menus, activeTab]);

  
  const {
    data: plan,
    isLoading: loadingMenu,
  } = useTemplateMenu(activeTab);

  /* ===============================
     Loading
  =============================== */

  if (loadingMenus || loadingMenu || !plan) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ===============================
     Error
  =============================== */

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error.message}</Text>
      </View>
    );
  }

  /* ===============================
     Empty state
  =============================== */

  if (!menus || menus.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No nutrition templates available</Text>
      </View>
    );
  }

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
        <NutritionTabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

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
