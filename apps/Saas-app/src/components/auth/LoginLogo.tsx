import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/LoginLogo.styles";

export default function LoginLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="barbell-outline" size={24} color="#fff" />
      </View>

      <Text style={styles.title}>CoachPro</Text>
    </View>
  );
}
