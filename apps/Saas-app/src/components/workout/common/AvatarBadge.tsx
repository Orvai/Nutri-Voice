import { Text, View, ViewStyle } from "react-native";
import { styles } from "../styles/AvatarBadge.styles";

type Props = {
  label: string;
  style?: ViewStyle;
};

export function AvatarBadge({ label, style }: Props) {
  const initials = label?.slice(0, 2).toUpperCase() || "EX";
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}
