import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginLogo() {
  return (
    <View style={{ flexDirection: "row-reverse", alignItems: "center", marginBottom: 20 }}>
      <View
        style={{
          width: 48,
          height: 48,
          backgroundColor: "#2563eb",
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="barbell-outline" size={24} color="#fff" />
      </View>

      <Text style={{ fontSize: 24, fontWeight: "700", marginRight: 10 }}>
        CoachPro
      </Text>
    </View>
  );
}
