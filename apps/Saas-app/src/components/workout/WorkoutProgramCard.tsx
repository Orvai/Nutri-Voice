import { View, Text, Pressable } from "react-native";
import type { UIWorkoutProgram } from "../../types/ui/workout-ui";

type Props = {
  program: UIWorkoutProgram;
  onPress?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export default function WorkoutProgramCard({ program, onPress, onEdit }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(program.id)}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "800" }}>{program.name}</Text>
        {onEdit ? (
          <Pressable
            onPress={() => onEdit?.(program.id)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: "#eef2ff",
              borderRadius: 8,
              borderColor: "#c7d2fe",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "#4338ca", fontWeight: "700" }}>עריכה</Text>
          </Pressable>
        ) : null}
      </View>

      {program.goal ? (
        <Text style={{ color: "#4b5563", marginBottom: 6 }}>{program.goal}</Text>
      ) : null}

      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Tag label={program.level === "beginner" ? "מתחיל" : program.level === "intermediate" ? "ביניים" : "מתקדם"} />
        {program.durationWeeks ? <Tag label={`${program.durationWeeks} שבועות`} /> : null}
        {program.sessionsPerWeek ? <Tag label={`${program.sessionsPerWeek} אימונים בשבוע`} /> : null}
        <Tag label={`${program.exercises.length} תרגילים`} />
      </View>

      {program.notes ? (
        <Text style={{ fontSize: 12, color: "#6b7280" }}>{program.notes}</Text>
      ) : null}
    </Pressable>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderColor: "#e5e7eb",
        borderWidth: 1,
      }}
    >
      <Text style={{ fontSize: 12, color: "#111827", fontWeight: "600" }}>{label}</Text>
    </View>
  );
}