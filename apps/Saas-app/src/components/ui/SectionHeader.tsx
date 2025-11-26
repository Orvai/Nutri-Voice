import { View, StyleSheet } from 'react-native';
import React from 'react';
import Text from './Text';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  description?: string;
}

export default function SectionHeader({ title, action, description }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text variant="title" weight="bold">{title}</Text>
        {description && <Text variant="caption" color={colors.neutral600}>{description}</Text>}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
});