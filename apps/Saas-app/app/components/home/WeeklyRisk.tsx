import { View, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import ProgressRing from '../ui/ProgressRing';
import { theme } from '../../styles/theme';

interface WeeklyRiskProps {
  data: {
    hydration: number;
    sleep: number;
    recovery: number;
  };
}

export default function WeeklyRisk({ data }: WeeklyRiskProps) {
  return (
    <Card>
      <SectionHeader title="מדדי סיכון שבועיים" description="אזורים שדורשים תשומת לב" />
      <View style={styles.grid}>
        <ProgressRing progress={data.hydration} label="הידרציה" />
        <ProgressRing progress={data.sleep} label="שינה" />
        <ProgressRing progress={data.recovery} label="התאוששות" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});