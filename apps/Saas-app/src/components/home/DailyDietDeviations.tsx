import { View, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import Text from '../ui/Text';
import Chip from '../ui/Chip';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';

interface DeviationProps {
  data: Array<{ id: string; meal: string; delta: number }>;
}

export default function DailyDietDeviations({ data }: DeviationProps) {
  return (
    <Card>
      <SectionHeader title="לקוחות שחרגו מהתפריט" description="שינויי קלוריות לפי ארוחה" />
      <View style={styles.list}>
        {data.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text weight="medium">{item.meal}</Text>
            <Chip
              label={`${item.delta > 0 ? '+' : ''}${item.delta} קלוריות`}
              tone={item.delta > 0 ? (item.delta > 50 ? 'danger' : 'warning') : 'success'}
            />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
});