import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/StrengthProgressionList.styles';

/**
 * Renders a list of exercises with performance metrics.
 * Highlights Personal Bests and progressive overload (improvement).
 */
const StrengthProgressionList = memo(({ exercises }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Strength & Progression</Text>
      <View style={styles.list}>
        {Object.values(exercises).map((ex: any, idx: number) => (
          <View key={idx} style={styles.exerciseCard}>
            <View style={styles.headerRow}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <View style={[styles.badge, ex.improvement >= 0 ? styles.positiveBadge : styles.negativeBadge]}>
                <Text style={styles.badgeText}>
                  {ex.improvement >= 0 ? '+' : ''}{ex.improvement} kg
                </Text>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Personal Best</Text>
                <Text style={styles.statValue}>{ex.maxWeight} kg</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Frequency</Text>
                <Text style={styles.statValue}>{ex.frequency}x</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

export default StrengthProgressionList;