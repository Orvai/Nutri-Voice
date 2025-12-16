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

  const createFromTemplate = useCreateClientMenuFromTemplate(clientId);

  /* ============================
     Local state
  ============================ */

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const didInitRef = useRef(false);

  /* ============================
     Auto-create client menus (SAFE)
  ============================ */

  useEffect(() => {
    if (didInitRef.current) return;
    if (loadingClientMenus || loadingTemplates) return;
    if (!clientMenus || !templates) return;
    if (!clientId) return;

    const hasAnyMenuType = clientMenus.some(
      (m) => m.dayType === "REST" || m.dayType === "TRAINING"
    );

    if (hasAnyMenuType) {
      didInitRef.current = true;
      return;
    }

    didInitRef.current = true;

    const createAll = async () => {
      for (const tmpl of templates) {
        await createFromTemplate.mutateAsync({
          clientId,
          templateMenuId: tmpl.id,
        });
      }
    };
  
    createAll();
  }, [
    clientId,
    loadingClientMenus,
    loadingTemplates,
    templates,
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
     Load full menu
  ============================ */

  const {
    data: plan,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab ?? undefined);

  /* ============================
     Loading / Error states
  ============================ */

  const initializingMenus =
  loadingClientMenus ||
  loadingTemplates ||
  !clientMenus ||
  (clientMenus.length === 0 && !!templates?.length);

  if (initializingMenus) {    return (
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

  if (!clientMenus?.length) {
    return (
      <View style={{ padding: 20 }}>
        <Text>לא נמצאו תפריטי תזונה ללקוח</Text>
      </View>
    );
  }
  /* ============================
     Tabs
  ============================ */

  const tabs = clientMenus.map((menu) => ({
    id: menu.id,
    label: menu.label,
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

      {loadingMenu || !plan ? (
        <View style={{ padding: 20 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <NutritionDayCard plan={plan} />
      )}
    </ScrollView>
  );
}
