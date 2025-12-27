import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/AIInsightsPanel.styles';

const AIInsightsPanel = memo(({ insights }: { insights?: string[] }) => {
  const safeInsights = insights || [];

  if (safeInsights.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Smart Coaching Insights</Text>
      {safeInsights.map((text, idx) => (
        <View key={idx} style={styles.insightBox}>
          <View style={styles.indicator} />
          <Text style={styles.insightText}>{text}</Text>
        </View>
      ))}
    </View>
  );
});

export default AIInsightsPanel;