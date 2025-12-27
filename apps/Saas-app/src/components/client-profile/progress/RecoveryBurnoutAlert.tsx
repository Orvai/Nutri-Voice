import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/RecoveryBurnoutAlert.styles';

/**
 * Monitors effort distribution to detect potential burnout or fatigue.
 * Uses color-coding to represent intensity levels.
 */
const RecoveryBurnoutAlert = memo(({ recovery }: any) => {
  const { effortDistribution } = recovery;
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recovery & Effort Analysis</Text>
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.indicator} />
          <Text style={styles.statusText}>
            {effortDistribution.HARD > 3 ? 'High Fatigue Risk' : 'Optimal Recovery'}
          </Text>
        </View>
        
        <View style={styles.distributionContainer}>
          {Object.entries(effortDistribution).map(([level, count]: any) => (
            <View key={level} style={styles.levelItem}>
               <Text style={styles.levelLabel}>{level}</Text>
               <Text style={styles.levelCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

export default RecoveryBurnoutAlert;