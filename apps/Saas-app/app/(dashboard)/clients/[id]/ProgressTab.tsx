// app/(dashboard)/clients/[id]/ProgressTab.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { progressTheme } from "../../../../src/theme/progressTheme";

import { useDailyStateRange } from "../../../../src/hooks/tracking/useDailyState";
import { useDailyAnalytics } from "../../../../src/hooks/tracking/useDailyAnalytics";

import ProgressRangeSelector from "../../../../src/components/client-profile/progress/ProgressRangeSelector";
import DisciplineScoreCard from "../../../../src/components/client-profile/progress/DisciplineScoreCard";
import AIInsightsPanel from "../../../../src/components/client-profile/progress/AIInsightsPanel";
import StreaksTracker from "../../../../src/components/client-profile/progress/StreaksTracker";
import CalorieDeltaEngine from "../../../../src/components/client-profile/progress/CalorieDeltaEngine";
import NutritionPeriodReport from "../../../../src/components/client-profile/progress/NutritionPeriodReport";
import StrengthProgressionList from "../../../../src/components/client-profile/progress/StrengthProgressionList";
import RecoveryBurnoutAlert from "../../../../src/components/client-profile/progress/RecoveryBurnoutAlert";
import HabitCorrelationCards from "../../../../src/components/client-profile/progress/HabitCorrelationCards";
import BodyHabitsSummary from "../../../../src/components/client-profile/progress/BodyHabitsSummary";

import type { DateRange, ISODate } from "../../../../src/types/ui/tracking/coach-analytics.ui";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RangeValue = Pick<DateRange, "startDate" | "endDate">;

function toISODate(d: Date): ISODate {
  return d.toISOString().slice(0, 10) as ISODate;
}

export default function ProgressTab({ client }: { client: { id: string } }) {
  const [range, setRange] = useState<RangeValue>(() => {
    const end = new Date();
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return {
      startDate: toISODate(start),
      endDate: toISODate(end),
    };
  });

  const { data: dailyStates, isLoading } = useDailyStateRange(range.startDate, range.endDate);

  // IMPORTANT: Expected signature: (clientId, range, dailyStates)
  const analytics = useDailyAnalytics(client?.id, range, dailyStates);

  const handleRangeChange = (newRange: RangeValue) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRange(newRange);
  };

  if (isLoading) {
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
          <ProgressRangeSelector range={range} onChange={handleRangeChange} />
        </View>

        {!analytics ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>לא נמצאו נתונים לטווח התאריכים הנבחר.</Text>
            <Text style={styles.emptySubText}>נסה לבחור טווח זמן אחר או להזין נתונים ביומן.</Text>
          </View>
        ) : (
          <>
            <DisciplineScoreCard data={analytics.discipline} />
            <AIInsightsPanel insights={analytics.insights} />
            <StreaksTracker streaks={analytics.streaks} />
            <CalorieDeltaEngine data={analytics.calorieBehavior} />
            <NutritionPeriodReport nutrition={analytics.nutrition} />
            <StrengthProgressionList exercises={analytics.strength.exercises} confidence={analytics.strength.confidence} />
            <RecoveryBurnoutAlert recovery={analytics.recovery} />
            <HabitCorrelationCards correlations={analytics.correlations} />
            <BodyHabitsSummary body={analytics.body} />
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
