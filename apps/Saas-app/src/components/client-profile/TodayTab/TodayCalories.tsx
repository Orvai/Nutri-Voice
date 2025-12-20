import { View, Text } from "react-native";
import { styles } from "./styles/TodayCalories.styles";

export default function TodayCalories({ data }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>קלוריות יומיות</Text>

      <Text style={[styles.centerText, styles.mainValue]}>
        {data.consumed} קל'
      </Text>

      <Text style={[styles.centerText, styles.muted, { marginBottom: 12 }]}>
        יעד יומי: {data.target}
      </Text>

      <View style={{ gap: 6 }}>
        <MacroRow
          label="פחמימות"
          eaten={data.carbs.eaten}
          target={data.carbs.target}
          color="#2563eb"
        />
        <MacroRow
          label="חלבון"
          eaten={data.protein.eaten}
          target={data.protein.target}
          color="#22c55e"
        />
        <MacroRow
          label="שומן"
          eaten={data.fat.eaten}
          target={data.fat.target}
          color="#f97316"
        />
      </View>

      <Text
        style={[
          styles.centerText,
          styles.muted,
          styles.footer,
        ]}
      >
        עדכון אחרון: {data.lastUpdate}
      </Text>
    </View>
  );
}

function MacroRow({ label, eaten, target, color }) {
  return (
    <View
      style={[
        styles.macroRow,
        { backgroundColor: color + "20" },
      ]}
    >
      <Text style={{ color }}>{label}</Text>
      <Text style={{ color }}>
        {eaten}g / {target}g
      </Text>
    </View>
  );
}
