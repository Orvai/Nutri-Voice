import Svg, { Circle } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import Text from './Text';

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress: number; // 0 - 1
  label?: string;
}

export default function ProgressRing({ size = 96, stroke = 10, progress, label }: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={colors.neutral200}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <Circle
          stroke={colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.label]}>
        <Text weight="bold">{Math.round(progress * 100)}%</Text>
        {label && <Text variant="caption" color={colors.neutral600}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});