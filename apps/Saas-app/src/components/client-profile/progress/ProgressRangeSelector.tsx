import { View, Text, Pressable } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./styles/ProgressRangeSelector.styles";

export default function ProgressRangeSelector() {
  const { range, setRange } = useClientProgress();

  const ranges = [
    { label: "7 ימים", value: 7 },
    { label: "14 ימים", value: 14 },
    { label: "30 ימים", value: 30 },
    { label: "90 ימים", value: 90 },
    { label: "6 חודשים", value: 180 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התקדמות לטווח ארוך</Text>

      <View style={styles.row}>
        {ranges.map((r) => {
          const isActive = range === r.value;
          return (
            <Pressable
              key={r.value}
              onPress={() => setRange(r.value)}
              style={[
                styles.button,
                isActive ? styles.buttonActive : styles.buttonInactive,
              ]}
            >
              <Text
                style={isActive ? styles.textActive : styles.textInactive}
              >
                {r.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
