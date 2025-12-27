import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/StreaksTracker.styles';

/**
 * Visualizing behavioral momentum through current and max streaks.
 * Highlights both adherence to nutrition and consistency in logging.
 */
const StreaksTracker = memo(({ streaks }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Consistency Streaks</Text>
      
      <View style={styles.row}>
        {/* Compliance Streak */}
        <View style={styles.card}>
          <Text style={styles.emoji}>🔥</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Nutrition Streak</Text>
            <View style={styles.valueRow}>
              <Text style={styles.currentValue}>{streaks.currentCompliance}</Text>
              <Text style={styles.maxValue}>/ {streaks.maxCompliance} max</Text>
            </View>
          </View>
        </View>

        {/* Logging Streak */}
        <View style={styles.card}>
          <Text style={styles.emoji}>📝</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Logging Streak</Text>
            <View style={styles.valueRow}>
              <Text style={styles.currentValue}>{streaks.currentLogging}</Text>
              <Text style={styles.maxValue}>/ {streaks.maxLogging} max</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default StreaksTracker;