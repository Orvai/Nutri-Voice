import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  LayoutAnimation
} from 'react-native';
import { useDailyStateRange } from '../../../../src/hooks/tracking/useDailyState'; 
import { useDailyAnalytics } from '../../../../src/hooks/tracking/useDailyAnalytics';

import ProgressRangeSelector from '../../../../src/components/client-profile/progress/ProgressRangeSelector';
import DisciplineScoreCard from '../../../../src/components/client-profile/progress/DisciplineScoreCard';
import AIInsightsPanel from '../../../../src/components/client-profile/progress/AIInsightsPanel';
import StreaksTracker from '../../../../src/components/client-profile/progress/StreaksTracker';
import CalorieDeltaEngine from '../../../../src/components/client-profile/progress/CalorieDeltaEngine';
import NutritionPeriodReport from '../../../../src/components/client-profile/progress/NutritionPeriodReport';
import StrengthProgressionList from '../../../../src/components/client-profile/progress/StrengthProgressionList';
import RecoveryBurnoutAlert from '../../../../src/components/client-profile/progress/RecoveryBurnoutAlert';
import HabitCorrelationCards from '../../../../src/components/client-profile/progress/HabitCorrelationCards';
import BodyHabitsSummary from '../../../../src/components/client-profile/progress/BodyHabitsSummary';

export default function ProgressTab({ client }) {
  const [range, setRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: dailyStates, isLoading } = useDailyStateRange(range.startDate, range.endDate);
  const analytics = useDailyAnalytics(dailyStates);

  // Wrapped handleRangeChange to ensure UI feedback
  const handleRangeChange = (newRange) => {
    setRange(newRange);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
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
            <NutritionPeriodReport nutrition={analytics.nutritionReport} />
            <StrengthProgressionList 
              exercises={analytics.strength.exercises} 
              volumeTrend={analytics.strength.volumeTrend} 
            />
            <RecoveryBurnoutAlert recovery={analytics.recovery} />
            <HabitCorrelationCards correlations={analytics.correlations} />
            <BodyHabitsSummary body={analytics.bodyMetrics} />
          </>
        )}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  header: { marginBottom: 20, alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyText: { color: '#1E293B', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptySubText: { color: '#64748B', fontSize: 14, textAlign: 'center' },
  footerSpacer: { height: 60 }
});