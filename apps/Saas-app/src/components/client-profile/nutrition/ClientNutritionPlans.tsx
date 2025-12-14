// src/components/client-profile/nutrition/ClientNutritionPlans.tsx

import { useEffect, useRef, useState } from "react";
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
    data: clientMenus,
    isLoading: loadingClientMenus,
    error,
  } = useClientMenus(clientId);

  const {
    data: templates,
    isLoading: loadingTemplates,
  } = useTemplateMenus();

  const createFromTemplate = useCreateClientMenuFromTemplate();


  /* ============================
     Local state
  ============================ */

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const didInitRef = useRef(false);

  /* ============================
     Auto-create client menus
  ============================ */

  useEffect(() => {
    if (didInitRef.current) return;
    if (loadingClientMenus || loadingTemplates) return;
    if (!clientMenus || !templates) return;
    if (clientMenus.length > 0) return;

    didInitRef.current = true;

    templates.forEach((tmpl) => {
      createFromTemplate.mutate({
        templateMenuId: tmpl.id,
      });
    });
  }, [
    clientId,
    loadingClientMenus,
    loadingTemplates,
    clientMenus,
    templates,
    createFromTemplate,
  ]);

  /* ============================
     Select first tab
  ============================ */

  useEffect(() => {
    if (clientMenus && clientMenus.length > 0 && !activeTab) {
      setActiveTab(clientMenus[0].id);
    }
  }, [clientMenus, activeTab]);

  /* ============================
     Load full menu (UI model)
  ============================ */

  const {
    data: plan,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab ?? undefined);

  /* ============================
     Loading / Error states
  ============================ */

  if (
    loadingClientMenus ||
    loadingTemplates ||
    loadingMenu ||
    !clientMenus ||
    !templates ||
    !plan
  ) {
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
        <Text style={{ color: "red" }}>
          {error instanceof Error ? error.message : "Error loading menus"}
        </Text>
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
