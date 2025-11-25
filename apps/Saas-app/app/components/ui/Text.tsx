import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
}

export default function Text({
  children,
  variant = 'body',
  weight = 'regular',
  color = colors.neutral800,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText style={[styles.base, styles[variant], styles[weight], { color }, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    writingDirection: 'rtl',
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  regular: {
    fontFamily: theme.fonts.regular,
    fontWeight: '400',
  },
  medium: {
    fontFamily: theme.fonts.medium,
    fontWeight: '600',
  },
  bold: {
    fontFamily: theme.fonts.bold,
    fontWeight: '700',
  },
});