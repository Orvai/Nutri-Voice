import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/BodyHabitsSummary.styles';

/**
 * Final summary of physical measurements and daily habits.
 * Essential for checking if overall trends align with targets.
 */
const BodyHabitsSummary = memo(({ body }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Body & Metrics Summary</Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Steps Avg</Text>
          <Text style={styles.gridValue}>{body.avgSteps.toLocaleString()}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Weight Change</Text>
          <Text style={[styles.gridValue, { color: body.weightChange <= 0 ? '#10B981' : '#EF4444' }]}>
            {body.weightChange} kg
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Sleep Avg</Text>
          <Text style={styles.gridValue}>{body.avgSleep}h</Text>
        </View>
      </View>
    </View>
  );
});

export default BodyHabitsSummary;