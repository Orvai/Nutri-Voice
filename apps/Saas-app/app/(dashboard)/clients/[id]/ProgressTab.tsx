// app/(dashboard)/clients/[id]/ProgressTab.tsx
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { progressTheme } from "../../../../src/theme/progressTheme";
import { useClientProgressData } from "../../../../src/hooks/tracking/useClientProgressData";

import ProgressRangeSelector from "../../../../src/components/client-profile/progress/ProgressRangeSelector";
import ProgressSectionEmptyState from "../../../../src/components/client-profile/progress/ProgressSectionEmptyState";
import DisciplineScoreCard from "../../../../src/components/client-profile/progress/DisciplineScoreCard";
import AIInsightsPanel from "../../../../src/components/client-profile/progress/AIInsightsPanel";
import StreaksTracker from "../../../../src/components/client-profile/progress/StreaksTracker";
import CalorieDeltaEngine from "../../../../src/components/client-profile/progress/CalorieDeltaEngine";
import NutritionPeriodReport from "../../../../src/components/client-profile/progress/NutritionPeriodReport";
import StrengthProgressionList from "../../../../src/components/client-profile/progress/StrengthProgressionList";
import RecoveryBurnoutAlert from "../../../../src/components/client-profile/progress/RecoveryBurnoutAlert";
import HabitCorrelationCards from "../../../../src/components/client-profile/progress/HabitCorrelationCards";
import BodyHabitsSummary from "../../../../src/components/client-profile/progress/BodyHabitsSummary";

function resolveErrorMessage(error: unknown): string {
  if (!error) return "אירעה שגיאה לא צפויה.";
  if (error instanceof Error && error.message) return error.message;
  return "לא הצלחנו לטעון נתוני התקדמות כרגע.";
}

export default function ProgressTab({ client }: { client: { id: string } }) {
  const {
    selectedRange,
    availableRanges,
    progressData,
    widgetAvailability,
    selectedRangeHasData,
    loading,
    error,
    availabilityLoading,
    setSelectedRange,
  } = useClientProgressData(client.id);

  const showInitialLoading = loading && !progressData && !error;

  if (showInitialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={progressTheme.colors.accent} />
        <Text style={styles.loadingText}>מנתח נתונים בתקופת זמן זו...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>מדדי התקדמות</Text>
          <ProgressRangeSelector
            range={selectedRange}
            options={availableRanges}
            onChange={setSelectedRange}
            availabilityLoading={availabilityLoading}
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>שגיאה בטעינת נתוני ההתקדמות</Text>
            <Text style={styles.errorText}>{resolveErrorMessage(error)}</Text>
          </View>
        ) : !selectedRangeHasData || !progressData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>לא נמצאו נתונים לטווח התאריכים הנבחר.</Text>
            <Text style={styles.emptySubText}>
              נסה לבחור טווח אחר או לעדכן נתוני יומן, אימונים ומדדים ללקוח הזה.
            </Text>
          </View>
        ) : (
          <>
            {widgetAvailability.discipline ? (
              <DisciplineScoreCard data={progressData.discipline} />
            ) : (
              <ProgressSectionEmptyState
                title="מדד עקביות"
                message="אין מספיק רישומי מעקב בטווח הזה כדי לחשב מדד עקביות אמין."
              />
            )}

            {widgetAvailability.insights ? (
              <AIInsightsPanel insights={progressData.insights} />
            ) : (
              <ProgressSectionEmptyState
                title="תובנות חכמות"
                message="כרגע אין מספיק מידע מייצג כדי לייצר תובנות פעולה אמינות."
              />
            )}

            {widgetAvailability.streaks ? (
              <StreaksTracker streaks={progressData.streaks} />
            ) : (
              <ProgressSectionEmptyState
                title="מומנטום ועקביות"
                message="אין מספיק ימים מדווחים בטווח הזה כדי להציג סטריקים."
              />
            )}

            {widgetAvailability.calorieBehavior ? (
              <CalorieDeltaEngine data={progressData.calorieBehavior} />
            ) : (
              <ProgressSectionEmptyState
                title="התנהגות קלורית"
                message="לא נמצאו מספיק ימי יעד קלורי (יום העמסה/ללא העמסה) להצגת דלתא קלורית."
              />
            )}

            {widgetAvailability.nutrition ? (
              <NutritionPeriodReport nutrition={progressData.nutrition} />
            ) : (
              <ProgressSectionEmptyState
                title="סיכום תזונה לתקופה"
                message="לא נמצאו מספיק רישומי תזונה בטווח שנבחר."
              />
            )}

            {widgetAvailability.strength ? (
              <StrengthProgressionList
                exercises={progressData.strength.exercises}
                confidence={progressData.strength.confidence}
              />
            ) : (
              <ProgressSectionEmptyState
                title="כוח והתקדמות"
                message="אין מספיק נתוני משקלים מתרגילי אימון כדי להציג התקדמות כוח."
              />
            )}

            {widgetAvailability.recovery ? (
              <RecoveryBurnoutAlert recovery={progressData.recovery} />
            ) : (
              <ProgressSectionEmptyState
                title="התאוששות ועומס"
                message="לא נמצאו מספיק נתוני אימון בטווח הזה כדי להעריך עומס והתאוששות."
              />
            )}

            {widgetAvailability.correlations ? (
              <HabitCorrelationCards correlations={progressData.correlations} />
            ) : (
              <ProgressSectionEmptyState
                title="קשרים בין הרגלים לביצועים"
                message="נדרשים גם נתוני אימון וגם שינה כדי לזהות קשרים מובהקים."
              />
            )}

            {widgetAvailability.body ? (
              <BodyHabitsSummary body={progressData.body} />
            ) : (
              <ProgressSectionEmptyState
                title="גוף והרגלים"
                message="אין מספיק נתוני צעדים, שינה או משקל להצגת מגמות גוף והרגלים."
              />
            )}
          </>
        )}

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: progressTheme.colors.bg },
  container: { flex: 1, backgroundColor: progressTheme.colors.bg },
  contentContainer: { padding: 16 },

  header: { marginBottom: 14 },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: progressTheme.colors.text,
    marginBottom: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: progressTheme.colors.bg,
  },

  loadingText: {
    marginTop: 12,
    color: progressTheme.colors.textDim,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  errorContainer: {
    padding: 22,
    alignItems: "flex-end",
    backgroundColor: progressTheme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: progressTheme.colors.dangerBorder,
    marginTop: 10,
  },

  errorTitle: {
    color: progressTheme.colors.danger,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "right",
    writingDirection: "rtl",
  },

  errorText: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 16,
  },

  emptyContainer: {
    padding: 22,
    alignItems: "flex-end",
    backgroundColor: progressTheme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    marginTop: 10,
  },

  emptyText: {
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "right",
    writingDirection: "rtl",
  },

  emptySubText: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 16,
  },

  footerSpacer: { height: 60 },
});
