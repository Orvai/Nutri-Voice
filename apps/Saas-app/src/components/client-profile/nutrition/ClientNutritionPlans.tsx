// src/components/client-profile/nutrition/ClientNutritionPlans.tsx

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import NutritionTabs from "../../nutrition/NutritionTabs";
import NutritionDayCard from "../../nutrition/NutritionDayCard";

import {
  useClientMenu,
  useClientMenus,
  useCreateClientMenuFromTemplate,
} from "../../../hooks/nutrition/useClientMenus";

import { useTemplateMenus } from "../../../hooks/nutrition/useTemplateMenus";

type Props = {
  clientId: string;
};

export default function ClientNutritionPlans({ clientId }: Props) {
  /* ============================
     Queries
  ============================ */

  const {
    data: clientMenus = [],
    isLoading: loadingClientMenus,
    error,
  } = useClientMenus(clientId);

  const {
    data: templates = [],
    isLoading: loadingTemplates,
  } = useTemplateMenus();

  const createFromTemplate = useCreateClientMenuFromTemplate();

  /* ============================
     Local state
  ============================ */

  const [activeTab, setActiveTab] = useState<string | null>(null);

  /* ============================
     Auto-create client menus
  ============================ */

  useEffect(() => {
    if (
      !loadingClientMenus &&
      !loadingTemplates &&
      clientMenus.length === 0 &&
      templates.length > 0
    ) {
      templates.forEach((tmpl) => {
        createFromTemplate.mutate({
          clientId,
          templateMenuId: tmpl.id,
        });
      });
    }
  }, [
    clientId,
    clientMenus.length,
    templates,
    loadingClientMenus,
    loadingTemplates,
  ]);

  /* ============================
     Select first tab
  ============================ */

  useEffect(() => {
    if (clientMenus.length > 0 && !activeTab) {
      setActiveTab(clientMenus[0].id);
    }
  }, [clientMenus, activeTab]);

  /* ============================
     Load full menu (ALREADY UI MODEL)
  ============================ */

  const {
    data: plan,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab);

  /* ============================
     Loading / Error states
  ============================ */

  if (loadingClientMenus || loadingTemplates || loadingMenu || !plan) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
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

  /* ============================
     Tabs
  ============================ */

  const tabs = clientMenus.map((menu) => ({
    id: menu.id,
    label: menu.dayType === "TRAINING" ? "יום אימון" : "יום מנוחה",
  }));

  /* ============================
     Render
  ============================ */

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
          disabled
          style={{
            backgroundColor: "#e5e7eb",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            opacity: 0.8,
          }}
        >
          <Text
            style={{ color: "#374151", fontWeight: "700", fontSize: 13 }}
          >
            תפריט לקוח
          </Text>
        </Pressable>
      </View>

      <NutritionDayCard plan={plan} />
    </ScrollView>
  );
}
