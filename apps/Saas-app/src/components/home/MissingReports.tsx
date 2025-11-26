import { View, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import Text from '../ui/Text';
import Avatar from '../ui/Avatar';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';

interface MissingReportsProps {
  data: Array<{ id: string; name: string; daysMissed: number }>;
}

export default function MissingReports({ data }: MissingReportsProps) {
  return (
    <Card>
      <SectionHeader title="לקוחות שלא דיווחו" description="שלח תזכורת על הדיווח היומי" />
      <View style={styles.list}>
        {data.map((item) => (
          <View key={item.id} style={styles.row}>
            <Avatar name={item.name} />
            <View style={{ flex: 1 }}>
              <Text weight="medium">{item.name}</Text>
              <Text variant="caption" color={colors.neutral600}>{item.daysMissed} ימים ללא דיווח</Text>
            </View>
            <Text variant="caption" color={colors.warning}>שלח תזכורת</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
});