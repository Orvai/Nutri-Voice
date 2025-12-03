import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.neutral400}
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: colors.white,
    textAlign: 'right',
  },
});