import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function WeightTrendChart() {
  const { data } = useClientProgress();
  const screenWidth = Dimensions.get("window").width - 40;

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
        מגמת ירידה במשקל
      </Text>

      <LineChart
        data={{
          labels: data.weightMonths,
          datasets: [{ data: data.weightTrend }],
        }}
        width={screenWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#2563eb",
          labelColor: () => "#6b7280",
          propsForDots: {
            r: "5",
            stroke: "#2563eb",
            strokeWidth: "2",
          },
        }}
        bezier
        style={{
          borderRadius: 12,
        }}
      />
    </View>
  );
}
