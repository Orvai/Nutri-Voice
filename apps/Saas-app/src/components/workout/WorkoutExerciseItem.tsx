import { View, Text } from "react-native";
import type { UIWorkoutExercise } from "../../types/ui/workout-ui";

type Props = {
  item: UIWorkoutExercise;
};

export default function WorkoutExerciseItem({ item }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 8,
      }}
    >
      <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>
          {item.order}. {item.exercise.name}
        </Text>
        <Text style={{ color: "#6b7280" }}>
          {item.exercise.muscleGroup || "ללא שריר"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row-reverse",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 6,
        }}
      >
        <Badge label={`${item.sets} סטים`} />
        {item.reps ? <Badge label={`${item.reps} חזרות`} /> : null}
        {item.durationSeconds ? <Badge label={`${item.durationSeconds} שניות`} /> : null}
        {item.restSeconds ? <Badge label={`מנוחה ${item.restSeconds}s`} /> : null}
        {item.exercise.equipment ? <Badge label={item.exercise.equipment} /> : null}
      </View>

      {item.notes ? (
        <Text style={{ color: "#4b5563", marginTop: 6 }}>{item.notes}</Text>
      ) : null}
    </View>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: "#e0f2fe",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#bae6fd",
      }}
    >
      <Text style={{ fontSize: 12, color: "#0f172a" }}>{label}</Text>
    </View>
  );
}