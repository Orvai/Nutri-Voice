import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./styles/WeightTrendChart.styles";

export default function WeightTrendChart() {
  const { data } = useClientProgress();
  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מגמת ירידה במשקל</Text>

      <LineChart
        data={{
          labels: data.weightMonths,
          datasets: [{ data: data.weightTrend }],
        }}
        width={screenWidth}
        height={220}
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
        style={styles.chart}
      />
    </View>
  );
}
