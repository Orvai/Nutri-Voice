import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function CalorieDeviations() {
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
        חריגות קלוריות
      </Text>

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
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}
