import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  useUpdateClientMenu,
} from "../../../hooks/nutrition/useClientMenus";

import { useTemplateMenus } from "../../../hooks/nutrition/useTemplateMenus";
import { styles } from "./styles/ClientNutritionPlans.styles";

type Props = {
  clientId: string;
};

function clampAllowedDaysPerWeek(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 7) return 7;
  return Math.round(value);
}

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
  const updateClientMenu = useUpdateClientMenu();

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLoadingFromTemplates, setIsLoadingFromTemplates] = useState(false);

  useEffect(() => {
    if (clientMenus && clientMenus.length > 0 && !activeTab) {
      setActiveTab(clientMenus[0].id);
    }
  }, [clientMenus, activeTab]);

  const canLoadFromTemplates = useMemo(() => {
    if (!clientMenus) return false;
    if (!templates) return false;
    return clientMenus.length === 0 && templates.length > 0;
  }, [clientMenus, templates]);

  const handleLoadFromTemplates = async () => {
    if (!canLoadFromTemplates || isLoadingFromTemplates) return;

    setIsLoadingFromTemplates(true);
    try {
      for (const template of templates ?? []) {
        await createFromTemplate.mutateAsync({
          templateMenuId: template.id,
        });
      }
    } catch (err) {
      console.error("Failed to load client menus from templates", err);
      Alert.alert(
        "שגיאה",
        "לא הצלחנו לטעון את התפריטים מהטמפלייטים. נסה שוב."
      );
    } finally {
      setIsLoadingFromTemplates(false);
    }
  };

  const {
    data: plan,
    isLoading: loadingMenu,
  } = useClientMenu(activeTab ?? undefined);

  const initializingMenus = loadingClientMenus || loadingTemplates || !clientMenus;

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
        <Text style={styles.emptyText}>לא נמצאו תפריטי תזונה ללקוח</Text>

        {templates && templates.length > 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.loadTemplatesButton,
              (pressed || isLoadingFromTemplates) && styles.loadTemplatesButtonPressed,
            ]}
            onPress={handleLoadFromTemplates}
            disabled={isLoadingFromTemplates}
          >
            {isLoadingFromTemplates ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loadTemplatesButtonText}>
                טען תפריט
              </Text>
            )}
          </Pressable>
        ) : (
          <Text style={styles.emptySubText}>לא נמצאו טמפלייטים זמינים למאמן</Text>
        )}
      </View>
    );
  }

  const tabs = clientMenus.map((menu) => ({
    id: menu.id,
    label: menu.label,
  }));

  const totalAllowedDays = clientMenus.reduce(
    (sum, menu) =>
      sum + clampAllowedDaysPerWeek(menu.allowedDaysPerWeek ?? 0),
    0
  );

  const totalWeeklyCalories = Math.round(
    clientMenus.reduce((sum, menu) => {
      const allowedDays = clampAllowedDaysPerWeek(menu.allowedDaysPerWeek ?? 0);
      return sum + menu.totalCalories * allowedDays;
    }, 0)
  );

  const handleAllowedDaysPerWeekChange = async (
    menuId: string,
    requestedDays: number
  ) => {
    const targetMenu = clientMenus.find((menu) => menu.id === menuId);
    if (!targetMenu) return;

    const nextTargetDays = clampAllowedDaysPerWeek(requestedDays);
    const otherMenu =
      clientMenus.find(
        (menu) =>
          menu.id !== menuId && menu.dayType !== targetMenu.dayType
      ) ??
      clientMenus.find((menu) => menu.id !== menuId) ??
      null;
    const updates: Array<{ id: string; allowedDaysPerWeek: number }> = [
      { id: menuId, allowedDaysPerWeek: nextTargetDays },
    ];

    if (otherMenu) {
      updates.push({
        id: otherMenu.id,
        allowedDaysPerWeek: clampAllowedDaysPerWeek(7 - nextTargetDays),
      });
    }

    try {
      for (const update of updates) {
        const currentMenu = clientMenus.find((menu) => menu.id === update.id);
        const currentAllowedDays = clampAllowedDaysPerWeek(
          currentMenu?.allowedDaysPerWeek ?? 0
        );
        if (currentAllowedDays === update.allowedDaysPerWeek) continue;

        await updateClientMenu.mutateAsync({
          id: update.id,
          data: { allowedDaysPerWeek: update.allowedDaysPerWeek },
        });
      }
    } catch (err) {
      console.error("Failed to update allowed days per menu", err);
      Alert.alert("שגיאה", "לא הצלחנו לעדכן את חלוקת הימים השבועית.");
    }
  };

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

      <View style={styles.weekSummaryCard}>
        <View style={styles.weekSummaryRow}>
          <Text style={styles.weekSummaryLabel}>סה״כ קלוריות שבועי:</Text>
          <Text style={styles.weekSummaryValue}>{totalWeeklyCalories}</Text>
          <Text style={styles.weekSummaryUnit}>קק״ל</Text>
        </View>
        <Text
          style={[
            styles.weekDaysText,
            totalAllowedDays === 7 ? styles.weekDaysOk : styles.weekDaysWarning,
          ]}
        >
          סה״כ ימים מוגדרים: {totalAllowedDays}/7
        </Text>
      </View>

      {loadingMenu || !plan ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <NutritionDayCard
          plan={plan}
          onAllowedDaysPerWeekChange={handleAllowedDaysPerWeekChange}
        />
      )}
    </ScrollView>
  );
}
