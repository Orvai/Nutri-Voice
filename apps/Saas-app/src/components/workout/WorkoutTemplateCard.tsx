import { View, Text, Pressable } from "react-native";
import { mapTemplateLevel, type UIWorkoutTemplate } from "../../types/ui/workout-ui";

const palette = ["#4f46e5", "#0ea5e9", "#16a34a", "#f97316", "#06b6d4"];

type Props = {
  program: UIWorkoutTemplate;
  onSelect?: (program: UIWorkoutTemplate) => void;
};

export default function WorkoutTemplateCard({ program, onSelect }: Props) {
  const badge = program.name?.slice(0, 2) || "W";
  const accent = palette[Math.abs(hashString(program.id)) % palette.length];
  const muscleTags = Array.from(new Set(program.muscleGroups ?? [])).slice(0, 6);

  return (
    <Pressable
      onPress={() => onSelect?.(program)}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 14,
      }}
    >
      <View
        style={{ flexDirection: "row-reverse", alignItems: "center" }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            backgroundColor: `${accent}20`,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: accent,
              fontWeight: "800",
            }}
          >
            {badge}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "800" }}>{program.name}</Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            {program.workoutType || "תוכנית אימון"}
          </Text>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
            }}
          >
            <Chip label={translateLevel(mapTemplateLevel(program.level))} />
            {program.bodyType ? <Chip label={program.bodyType} /> : null}
            {program.gender ? <Chip label={program.gender} /> : null}
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 12,
        }}
      >
        {muscleTags.length === 0 ? (
          <Chip label="ללא שיוך שריר" />
        ) : (
          muscleTags.map((muscle) => <Chip key={muscle} label={muscle} />)
        )}
      </View>
    </Pressable>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 12,
        backgroundColor: "#f3f4f6",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        color: "#374151",
      }}
    >
      {label}
    </Text>
  );
}

function translateLevel(level: UIWorkoutProgram["level"]) {
  switch (level) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "ביניים";
    case "advanced":
      return "מתקדם";
    default:
      return "";
  }
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}