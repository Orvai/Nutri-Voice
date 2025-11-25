import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import Text from './Text';

interface BadgeProps extends ViewProps {
  label: string;
}

export default function Badge({ label, style, ...rest }: BadgeProps) {
  return (
    <View style={[styles.badge, style]} {...rest}>
      <Text variant="caption" weight="bold" color={colors.primary}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.neutral100,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
});