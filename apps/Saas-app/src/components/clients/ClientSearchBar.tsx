import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/ClientSearchBar.styles";

export default function ClientsSearchBar({ query, onChange }) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={18}
        color="#9ca3af"
        style={styles.icon}
      />

      <TextInput
        placeholder="חיפוש לקוח..."
        value={query}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}