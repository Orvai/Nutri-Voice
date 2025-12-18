import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/AiStatsCard.styles";

export default function AiStatsCard({ data }) {
  return (
    <View
      style={styles.container}
    >
      {data.map((row, i) => (
        <View
          key={i}
          style={styles.row}
        >
          <Text style={styles.text}>{row.label}</Text>

          <View
            style={styles.valueContainer}
          >
            <View
              style={[styles.badge, { backgroundColor: row.color }]}
            >
              <Text style={[styles.valueText, { color: row.textColor }]}>
                {row.value}
              </Text>
            </View>

            <Ionicons
              name={row.icon}
              size={16}
              color={row.textColor}
            />
          </View>
        </View>
      ))}
    </View>
  );
}