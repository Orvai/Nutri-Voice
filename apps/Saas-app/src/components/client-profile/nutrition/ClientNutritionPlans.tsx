// src/components/client-profile/nutrition/ClientNutritionPlans.tsx
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import NutritionTabs from "../../nutrition/NutritionTabs";
import NutritionDayCard from "../../nutrition/NutritionDayCard";
import {useClientMenu,useClientMenus,useCreateClientMenuFromTemplate,} from "../../../hooks/nutrition/useClientMenus";
import { mapClientMenuToNutritionPlan } from "../../../utils/mapClientMenuToNutritionPlan";

type Props = {
  clientId: string;
};

export default function ClientNutritionPlans({ clientId }: Props) {
  const {
    data: menus = [],
    isLoading: loadingMenus,
    error,
    refetch,
  } = useClientMenus(clientId);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [creationTriggered, setCreationTriggered] = useState(false);

  const createFromTemplate = useCreateClientMenuFromTemplate(clientId);

  useEffect(() => {
    if (menus && menus.length > 0 && !activeTab) {
      setActiveTab(menus[0].id);
    }
  }, [menus, activeTab]);

  useEffect(() => {
    if (loadingMenus) return;
    if ((menus?.length ?? 0) > 0) return;
    if (creationTriggered || createFromTemplate.isPending) return;

    setCreationTriggered(true);
    createFromTemplate.mutate(undefined, {
      onSuccess: (data) => {
        if (data?.id) {
          setActiveTab(data.id);
        }
        refetch();
      },
      onSettled: () => setCreationTriggered(false),
    });
  }, [createFromTemplate, creationTriggered, loadingMenus, menus, refetch]);

  const {
    data: fullMenu,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab);

  const plan = useMemo(() => {
    if (!fullMenu) return null;
    return mapClientMenuToNutritionPlan(fullMenu);
  }, [fullMenu]);

  if (loadingMenus || loadingMenu || !plan) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
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
        <Text>לא נמצאו תפריטי תזונה ללקוח</Text>
      </View>
    );
  }

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