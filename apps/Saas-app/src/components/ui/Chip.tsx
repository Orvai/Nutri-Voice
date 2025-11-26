import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import Text from './Text';

interface ChipProps extends ViewProps {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

export default function Chip({ label, tone = 'default', style, ...rest }: ChipProps) {
  return (
    <View style={[styles.base, styles[tone], style]} {...rest}>
      <Text variant="caption" weight="medium" color={tone === 'default' ? colors.neutral700 : colors.white}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: colors.neutral100,
  },
  default: {},
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.danger,
  },
});