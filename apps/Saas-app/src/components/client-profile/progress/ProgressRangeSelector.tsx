import React, { memo } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { styles } from './styles/ProgressRangeSelector.styles';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface RangeProps {
  range: { startDate: string; endDate: string };
  onChange: (range: any) => void;
}

const ProgressRangeSelector = memo(({ range, onChange }: RangeProps) => {
  
  const setPreset = (days: number) => {
    // Animate the transitions of all cards in the dashboard
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onChange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });
  };

  // Helper to check which preset is active
  const getDiffDays = () => {
    const s = new Date(range.startDate);
    const e = new Date(range.endDate);
    return Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24));
  };

  const activeDiff = getDiffDays();

  return (
    <View style={styles.outerContainer}>
      {/* Quick Presets Row */}
      <View style={styles.presetsRow}>
        {[7, 30, 90].map((days) => (
          <TouchableOpacity
            key={days}
            style={[styles.presetBtn, activeDiff === days && styles.activePresetBtn]}
            onPress={() => setPreset(days)}
          >
            <Text style={[styles.presetText, activeDiff === days && styles.activePresetText]}>
              {days === 7 ? 'שבוע' : days === 30 ? 'חודש' : '3 חודשים'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Range Display */}
      <View style={styles.container}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Analysis Period</Text>
          <Text style={styles.dateRange}>{`${range.startDate} — ${range.endDate}`}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Custom</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ProgressRangeSelector;