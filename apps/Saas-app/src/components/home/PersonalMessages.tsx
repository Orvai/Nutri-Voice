import { View, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import Text from '../ui/Text';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

interface PersonalMessagesProps {
  data: Array<{ id: string; sender: string; preview: string; time: string }>;
}

export default function PersonalMessages({ data }: PersonalMessagesProps) {
  return (
    <Card>
      <SectionHeader title="הודעות הדורשות מענה" description="צפה בצ'אט" />
      <View style={styles.list}>
        {data.map((message) => (
          <View key={message.id} style={styles.row}>
            <Text weight="medium">{message.sender}</Text>
            <Text color={colors.neutral600}>{message.preview}</Text>
            <Text variant="caption" color={colors.neutral500}>{formatTimeAgo(message.time)}</Text>
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
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
});