import { TextInput, View } from "react-native";
import { theme } from "../../theme";
import { styles } from "./styles/WorkoutSearchBar.styles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function WorkoutSearchBar({
  value,
  onChange,
  placeholder = "חיפוש תרגיל",
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.text.subtitle}
        style={[
          styles.input,
          {
            borderColor: theme.card.border,
            color: theme.text.title,
          },
        ]}
      />
    </View>
  );
}
