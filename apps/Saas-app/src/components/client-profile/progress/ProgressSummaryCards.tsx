import { View, Text } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./ProgressSummaryCards.styles";

export default function ProgressSummaryCards() {
  const { data } = useClientProgress();

  const cards = [
    { title: "ירידה במשקל", value: data.summary.weightChange, color: "#10B981" },
    { title: "אחוז שומן", value: data.summary.fatChange, color: "#3B82F6" },
    { title: "מסת שריר", value: data.summary.muscleChange, color: "#8B5CF6" },
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
    <View style={styles.container}>
      {cards.map((card, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={[styles.value, { color: card.color }]}>
            {card.value}
          </Text>

          {card.percent !== undefined && (
            <View style={styles.barWrapper}>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${card.percent}%`,
                      backgroundColor: card.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.percent, { color: card.color }]}>
                {card.percent}%
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
