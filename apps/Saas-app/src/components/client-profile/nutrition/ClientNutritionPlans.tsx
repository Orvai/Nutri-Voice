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
import { styles } from "./styles/ClientNutritionPlans.styles";

type Props = {
  clientId: string;
};

export default function ClientNutritionPlans({ clientId }: Props) {
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

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const didInitRef = useRef(false);

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
          templateMenuId: tmpl.id,
        });
      }
    };

    createAll();
  }, [
    clientId,
    loadingClientMenus,
    loadingTemplates,
    clientMenus,
    templates,
    createFromTemplate,
  ]);

  useEffect(() => {
    if (clientMenus && clientMenus.length > 0 && !activeTab) {
      setActiveTab(clientMenus[0].id);
    }
  }, [clientMenus, activeTab]);

  const {
    data: plan,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab ?? undefined);

  const initializingMenus =
    loadingClientMenus ||
    loadingTemplates ||
    !clientMenus ||
    (clientMenus.length === 0 && !!templates?.length);

  if (initializingMenus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error instanceof Error
            ? error.message
            : "Error loading menus"}
        </Text>
      </View>
    );
  }

  if (!clientMenus?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text>לא נמצאו תפריטי תזונה ללקוח</Text>
      </View>
    );
  }

  const tabs = clientMenus.map((menu) => ({
    id: menu.id,
    label: menu.label,
  }));

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <NutritionTabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

        <Pressable disabled style={styles.badge}>
          <Text style={styles.badgeText}>תפריט לקוח</Text>
        </Pressable>
      </View>

      {loadingMenu || !plan ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <NutritionDayCard plan={plan} />
      )}
    </ScrollView>
  );
}
