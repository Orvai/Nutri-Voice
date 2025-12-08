import { View, Text, Pressable } from "react-native";
import type { UIExercise } from "../../types/ui/workout-ui";

type Props = {
  item: UIExercise;
  onPress?: () => void;
};

export default function WorkoutExerciseCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          padding: 14,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
          <AvatarBadge label={item.name} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "800", fontSize: 16 }}>{item.name}</Text>
            <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              {item.primaryMuscle || "ללא שריר ראשי"}
            </Text>
          </View>
          <Chip label={translateDifficulty(item.difficulty)} tone="blue" />
        </View>

        <View
          style={{
            flexDirection: "row-reverse",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {item.secondaryMuscles.length
            ? item.secondaryMuscles.map((muscle) => (
                <Chip key={muscle} label={muscle} />
              ))
            : null}
          {item.equipment ? <Chip label={item.equipment} tone="gray" /> : null}
        </View>

        {item.instructions ? (
          <Text style={{ fontSize: 13, color: "#4b5563" }} numberOfLines={2}>
            {item.instructions}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function Chip({ label, tone = "muted" }: { label: string; tone?: "muted" | "blue" | "gray" }) {
  const palette = {
    muted: { bg: "#f3f4f6", color: "#374151" },
    blue: { bg: "#e0f2fe", color: "#1d4ed8" },
    gray: { bg: "#f5f5f5", color: "#374151" },
  } as const;

  const colors = palette[tone];

  return (
    <Text
      style={{
        fontSize: 12,
        backgroundColor: colors.bg,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        color: colors.color,
      }}
    >
      {label}
    </Text>
  );
}

function AvatarBadge({ label }: { label: string }) {
  const initials = label?.slice(0, 2).toUpperCase() || "EX";
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
      }}
    >
      <Text style={{ color: "#4338ca", fontWeight: "800", fontSize: 15 }}>
        {initials}
      </Text>
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
