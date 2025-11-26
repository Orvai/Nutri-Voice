import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import Text from './Text';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ label, variant = 'primary', style, ...rest }: ButtonProps) {
  return (
    <Pressable style={[styles.base, styles[variant], style as ViewStyle]} {...rest}>
      <Text weight="bold" color={variant === 'ghost' ? colors.neutral800 : colors.white}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.neutral800,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
});