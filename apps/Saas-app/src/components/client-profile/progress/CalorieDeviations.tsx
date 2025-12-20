import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./styles/CalorieDeviations.styles";

export default function CalorieDeviations() {
  const { data } = useClientProgress();
  const width = Dimensions.get("window").width - 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>חריגות קלוריות</Text>

      <BarChart
        data={{
          labels: data.calorieDates,
          datasets: [{ data: data.calories }],
        }}
        width={width}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          labelColor: () => "#6b7280",
        }}
        fromZero
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </View>
  );
}
