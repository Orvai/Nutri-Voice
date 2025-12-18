import { View, Text } from "react-native";
import { styles } from "./styles/LoginHeader.styles";

export default function LoginHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>כניסה למערכת</Text>
      <Text style={styles.text}>היכנס עם פרטי המאמן שלך</Text>
    </View>
  );
}