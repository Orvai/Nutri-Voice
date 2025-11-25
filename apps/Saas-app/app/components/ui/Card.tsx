import { PropsWithChildren } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';

export default function Card({ children, style, ...rest }: PropsWithChildren<ViewProps>) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
});