import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/HabitCorrelationCards.styles';

/**
 * Displays correlations between lifestyle metrics and physical results.
 * Helps identify why a client might be underperforming.
 */
const HabitCorrelationCards = memo(({ correlations }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Habit Correlations</Text>
      <View style={styles.row}>
        <View style={styles.smallCard}>
           <Text style={styles.icon}>😴</Text>
           <Text style={styles.corrValue}>{correlations.sleepVsEffort.length} logs</Text>
           <Text style={styles.corrLabel}>Sleep Impact</Text>
        </View>
        <View style={styles.smallCard}>
           <Text style={styles.icon}>💧</Text>
           <Text style={styles.corrValue}>Stable</Text>
           <Text style={styles.corrLabel}>Hydration</Text>
        </View>
      </View>
    </View>
  );
});

export default HabitCorrelationCards;