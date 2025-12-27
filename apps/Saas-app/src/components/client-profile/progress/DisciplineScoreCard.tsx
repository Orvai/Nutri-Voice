import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/DisciplineScoreCard.styles';

/**
 * The "Health Indicator" of the client's progress
 * Aggregates logging frequency and goal adherence into a single KPI
 */
const DisciplineScoreCard = memo(({ data }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.scoreCircle}>
           {/* Visual KPI score */}
          <Text style={styles.scoreValue}>{data.score}</Text>
          <Text style={styles.scorePercent}>%</Text>
        </View>
        
        <View style={styles.textDetails}>
          <Text style={styles.cardTitle}>Client Discipline</Text>
          <Text style={styles.cardStatus}>Excellent Consistency</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricsGrid}>
        <View style={styles.metricEntry}>
          <Text style={styles.metricLabel}>Logging Rate</Text>
          <Text style={styles.metricValue}>{data.logCompleteness} Days</Text>
        </View>
        <View style={styles.metricEntry}>
          <Text style={styles.metricLabel}>Target Adherence</Text>
          <Text style={styles.metricValue}>{data.adherenceDays} Days</Text>
        </View>
      </View>
    </View>
  );
});

export default DisciplineScoreCard;