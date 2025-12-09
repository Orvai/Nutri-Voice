import { FlatList, Pressable, Text, View } from "react-native";
import type { UIExercise } from "../../types/ui/workout-ui";

interface Props {
  exercises: UIExercise[];
  selectedIds?: string[];
  onSelect?: (exercise: UIExercise) => void;
}

export default function ExerciseList({ exercises, selectedIds = [], onSelect }: Props) {
  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => {
        const isSelected = selectedIds.includes(item.id);
        return (
          <Pressable
            onPress={() => onSelect?.(item)}
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isSelected ? "#22c55e" : "#e5e7eb",
              backgroundColor: isSelected ? "#dcfce7" : "#fff",
            }}
          >
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>{item.name}</Text>
              <Text style={{ color: "#6b7280" }}>
                {item.muscleGroup || "ללא שריר"}
              </Text>
            </View>
            <View style={{ flexDirection: "row-reverse", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {(item.secondaryMuscles ?? []).map((muscle) => (
                <Tag key={muscle} label={muscle} />
              ))}
              {item.equipment ? <Tag label={item.equipment} /> : null}
              <Tag label={translateDifficulty(item.difficulty)} />
            </View>
            {item.instructions ? (
              <Text style={{ marginTop: 6, color: "#4b5563" }} numberOfLines={2}>
                {item.instructions}
              </Text>
            ) : null}
          </Pressable>
        );
      }}
    />
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Text style={{ fontSize: 12, color: "#111827" }}>{label}</Text>
    </View>
  );
}

function translateDifficulty(value: UIExercise["difficulty"]) {
  switch (value) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "ביניים";
    case "advanced":
      return "מתקדם";
    default:
      return value;
  }
}