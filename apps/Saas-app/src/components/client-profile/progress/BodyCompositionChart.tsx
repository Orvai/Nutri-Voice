import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function BodyCompositionChart() {
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
        אחוז שומן ומסת שריר
      </Text>

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
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}
