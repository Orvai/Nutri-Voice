import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./styles/BodyCompositionChart.styles";

export default function BodyCompositionChart() {
  const { data } = useClientProgress();
  const width = Dimensions.get("window").width - 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>אחוז שומן ומסת שריר</Text>

      <LineChart
        data={{
          labels: data.weightMonths,
          datasets: [
            { data: data.bodyFat, color: () => "#ef4444" },
            { data: data.muscleMass, color: () => "#10b981" },
          ],
          legend: ["אחוז שומן", "מסת שריר"],
        }}
        width={width}
        height={240}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#374151",
          labelColor: () => "#6b7280",
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}
