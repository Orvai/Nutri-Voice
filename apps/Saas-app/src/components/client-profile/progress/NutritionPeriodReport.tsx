import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/NutritionPeriodReport.styles';

/**
 * Summary of nutritional intake over the selected range.
 * Provides daily averages for macros and calories.
 */
const NutritionPeriodReport = memo(({ nutrition }: any) => {
  const { avg } = nutrition;

  const MacroTag = ({ label, value, color }: any) => (
    <View style={[styles.tag, { borderColor: color }]}>
      <Text style={[styles.tagLabel, { color }]}>{label}</Text>
      <Text style={styles.tagValue}>{value}g</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Period Nutrition Report</Text>
      <View style={styles.card}>
        <View style={styles.calorieSection}>
          <Text style={styles.avgLabel}>Avg. Daily Calories</Text>
          <Text style={styles.avgValue}>{avg.calories.toLocaleString()}</Text>
          <Text style={styles.unit}>kcal / day</Text>
        </View>

        <View style={styles.macroGrid}>
          <MacroTag label="Protein" value={avg.protein} color="#10B981" />
          <MacroTag label="Carbs" value={avg.carbs} color="#3B82F6" />
          <MacroTag label="Fats" value={avg.fat} color="#F59E0B" />
        </View>
      </View>
    </View>
  );
});

export default NutritionPeriodReport;