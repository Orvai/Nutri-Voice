import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./styles/WorkoutProgressChart.styles";

export default function WorkoutProgressChart() {
  const { data } = useClientProgress();
  const width = Dimensions.get("window").width - 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התקדמות תרגילי כוח לפי שריר</Text>

      <BarChart
        data={{
          labels: data.workoutProgressMuscles,
          datasets: [{ data: data.workoutProgressNow }],
        }}
        width={width}
        height={240}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#2563eb",
          labelColor: () => "#6b7280",
        }}
        style={styles.chart}
      />
    </View>
  );
}
