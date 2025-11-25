import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import Text from '../ui/Text';
import { View, StyleSheet } from 'react-native';
import { numberFormat } from '../../utils/numberFormat';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import Badge from '../ui/Badge';

interface DailyKpisProps {
  data: Array<{ title: string; value: number; change: number; unit: string }>;
}

export default function DailyKpis({ data }: DailyKpisProps) {
  return (
    <Card>
      <SectionHeader title="מדדי היום" description="סקירה מהירה של הביצועים" />
      <View style={styles.grid}>
        {data.map((item) => (
          <View key={item.title} style={styles.kpi}>
            <Text variant="subtitle" weight="medium">{item.title}</Text>
            <Text variant="title" weight="bold">{numberFormat(item.value)} {item.unit}</Text>
            <Badge label={`${item.change > 0 ? '+' : ''}${item.change}%`} />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  kpi: {
    flex: 1,
    minWidth: 180,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: theme.radius.md,
    backgroundColor: colors.neutral50,
  },
});