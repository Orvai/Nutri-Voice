import { View, Text } from "react-native";

export default function LoginHeader() {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: "800", textAlign: "right" }}>
        כניסה למערכת
      </Text>
      <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "right" }}>
        היכנס עם פרטי המאמן שלך
      </Text>
    </View>
  );
}
