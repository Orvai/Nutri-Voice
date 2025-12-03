import { View, Text } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function ProgressSummaryCards() {
  const { data } = useClientProgress();

  const cards = [
    {
      title: "ירידה במשקל",
      value: data.summary.weightChange,
      color: "#10B981",
    },
    {
      title: "אחוז שומן",
      value: data.summary.fatChange,
      color: "#3B82F6",
    },
    {
      title: "מסת שריר",
      value: data.summary.muscleChange,
      color: "#8B5CF6",
    },
    {
      title: "צעדים יומיים",
      value: data.summary.stepsAvg,
      color: "#0EA5E9",
      percent: data.summary.stepsPercent,
    },
    {
      title: "שתיית מים",
      value: data.summary.waterAvg,
      color: "#14B8A6",
      percent: data.summary.waterPercent,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      {cards.map((card, idx) => (
        <View
          key={idx}
          style={{
            width: "48%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 6 }}>
            {card.title}
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "900",
              color: card.color,
              marginBottom: 4,
            }}
          >
            {card.value}
          </Text>

          {card.percent !== undefined && (
            <View style={{ marginTop: 8 }}>
              <View
                style={{
                  height: 6,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${card.percent}%`,
                    backgroundColor: card.color,
                    height: "100%",
                  }}
                />
              </View>
              <Text style={{ marginTop: 4, textAlign: "left", color: card.color }}>
                {card.percent}%
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
