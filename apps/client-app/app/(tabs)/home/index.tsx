import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { AppHeader } from "@/components/layout/AppHeader";
import { StatusView } from "@/components/ui/StatusView";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FocusCard } from "@/components/home/FocusCard";
import { NutritionSummaryCard } from "@/components/home/NutritionSummaryCard";
import { QuickActionsRow } from "@/components/home/QuickActionsRow";
import { CoachTipCard } from "@/components/home/CoachTipCard";
import { NextWorkoutCard } from "@/components/home/NextWorkoutCard";
import { DailyMetricsGrid } from "@/components/home/DailyMetricsGrid";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { useHomeData } from "@/hooks/home/useHomeData";
import { useHomeQuickActions } from "@/hooks/home/useHomeQuickActions";
import { useNextBestAction } from "@/hooks/composition/useNextBestAction";
import { colors } from "@/constants/colors";

export default function HomeScreen() {
  const { data, isLoading, isError, refetch } = useHomeData();
  const {
    addWater,
    addCalories,
    isAddingWater,
    isAddingCalories,
    error: quickActionError
  } = useHomeQuickActions();
  const nextAction = useNextBestAction(data);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען את היום שלך" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <CoachHelpFallback onRetry={() => void refetch()} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen>
        <StatusView
          type="empty"
          title="אין נתונים להצגה"
          message="נסה לרענן או פנה למאמן דרך העוזר."
          actionLabel="רענן"
          onActionPress={() => void refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        subtitle="היום"
        title={data.greetingTitle}
        onNotificationsPress={() => router.push("/messages")}
      />

      <FocusCard
        actionLabel={nextAction.label}
        description={
          data.focusAction === "startWorkout"
            ? "יום העמסה: נכנסים לאימון הבא ומדווחים סטים בזמן אמת."
            : "יום ללא העמסה או אימון הושלם: הצעד הבא הוא דיווח ארוחה."
        }
        onPress={() => router.push(nextAction.route as never)}
      />

      <NutritionSummaryCard data={data} />

      <QuickActionsRow
        actions={[
          {
            key: "water",
            label: isAddingWater ? "מעדכן..." : "מים +250",
            icon: "water-outline",
            onPress: async () => {
              await addWater(250);
              setFeedback("עודכנו 250 מ״ל מים");
            }
          },
          {
            key: "meal",
            label: "דווח ארוחה",
            icon: "restaurant-outline",
            onPress: () => router.push("/nutrition/report")
          },
          {
            key: "calories",
            label: isAddingCalories ? "מעדכן..." : "+120 קל׳",
            icon: "flame-outline",
            onPress: async () => {
              await addCalories(120);
              setFeedback("עודכנו 120 קלוריות");
            }
          }
        ]}
      />

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      {quickActionError ? <Text style={styles.error}>{quickActionError}</Text> : null}

      <CoachTipCard
        coachName={data.coachTip.coachName}
        coachAvatarUrl={data.coachTip.coachAvatarUrl}
        message={data.coachTip.message}
        onOpenAssistant={() =>
          router.push({
            pathname: "/(tabs)/assistant",
            params: { prompt: data.coachTip.message }
          })
        }
      />

      {data.nextWorkout ? (
        <>
          <SectionHeader
            title="האימון הבא"
            actionLabel="צפה בתוכנית"
            onActionPress={() => router.push(`/workout/${data.nextWorkout.id}` as never)}
          />
          <NextWorkoutCard
            workout={data.nextWorkout}
            onOpenWorkout={() => router.push(`/workout/${data.nextWorkout.id}` as never)}
          />
        </>
      ) : null}

      <SectionHeader title="התקדמות יומית" />
      <DailyMetricsGrid waterLabel={data.waterLabel} stepsLabel={data.stepsLabel} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  feedback: {
    color: colors.success,
    fontSize: 13,
    textAlign: "right"
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    textAlign: "right"
  }
});
