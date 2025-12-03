import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function WorkoutProgressChart() {
  const { data } = useClientProgress();
  const width = Dimensions.get("window").width - 40;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        התקדמות תרגילי כוח לפי שריר
      </Text>

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
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}
