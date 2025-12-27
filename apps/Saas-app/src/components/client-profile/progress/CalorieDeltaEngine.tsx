import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/CalorieDeltaEngine.styles';

/**
 * Analyzes the distance from daily targets (The Delta).
 * Helps coaches identify "Binge" patterns vs "Precision" logging.
 */
const CalorieDeltaEngine = memo(({ data }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Calorie Behavior (Delta Engine)</Text>
      
      <View style={styles.mainCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
             <Text style={styles.summaryLabel}>Binge Days</Text>
             <Text style={styles.summaryValue}>{data.bingeCount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
             <Text style={styles.summaryLabel}>Precision Rate</Text>
             <Text style={styles.summaryValue}>{data.precisionCount} Days</Text>
          </View>
        </View>

        {/* Placeholder for Mini-Bar Chart */}
        <View style={styles.chartPlaceholder}>
          {data.deltas.slice(-7).map((day: any, i: number) => (
            <View key={i} style={styles.barColumn}>
              <View style={[
                styles.bar, 
                { height: Math.min(Math.abs(day.delta) / 10, 60) },
                day.delta > 0 ? styles.barPositive : styles.barNegative
              ]} />
              <Text style={styles.barLabel}>{day.dayType === 'TRAINING' ? 'T' : 'R'}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.footerNote}>* Bars represent last 7 entries (T=Training, R=Rest)</Text>
      </View>
    </View>
  );
});

export default CalorieDeltaEngine;