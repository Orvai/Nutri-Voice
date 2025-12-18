import { TextInput, TextInputProps } from 'react-native';
import { colors } from '../../styles/colors';
import { styles } from './styles/Input.styles';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.neutral400}
      style={styles.input}
      {...props}
    />
  );
}
