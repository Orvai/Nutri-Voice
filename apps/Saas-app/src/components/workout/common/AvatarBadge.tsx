import { Text, View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../../theme";

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

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  text: {
    color: "#4338ca",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
  },
});