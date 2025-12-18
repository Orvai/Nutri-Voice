import { View, Text } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./WorkoutWeightsTable.styles";

export default function WorkoutWeightsTable() {
  const { data } = useClientProgress();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>משקלי עבודה לפי תרגיל</Text>

      {data.workoutWeights.map((row, idx) => (
        <View
          key={idx}
          style={[
            styles.row,
            idx !== data.workoutWeights.length - 1 && styles.rowBorder,
          ]}
        >
          <Text style={styles.strong}>{row.exercise}</Text>
          <Text>קבוצת שריר: {row.muscle}</Text>
          <Text>עבודה: {row.work}</Text>
          <Text>מקסימום: {row.max}</Text>
          <Text style={styles.success}>שיפור: {row.progress}</Text>
          <Text style={styles.muted}>תאריך: {row.date}</Text>
        </View>
      ))}
    </View>
  );
}
