import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ClientsSearchBar({ query, onChange }) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <Ionicons
        name="search"
        size={18}
        color="#9ca3af"
        style={{ marginLeft: 8 }}
      />

      <TextInput
        placeholder="חיפוש לקוח..."
        value={query}
        onChangeText={onChange}
        style={{
          flex: 1,
          textAlign: "right",
          fontSize: 14,
        }}
      />
    </View>
  );
}
