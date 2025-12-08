import { View, Text, Pressable } from "react-native";

type Props = {
  selectedMuscle: string;
  onChangeMuscle: (value: string) => void;
  totalCount: number;
  muscleOptions?: string[];
};

const MUSCLE_OPTIONS = ["הכל", "חזה", "גב", "רגליים", "כתפיים", "יד קדמית", "יד אחורית"];

export default function WorkoutFilters({
  selectedMuscle,
  onChangeMuscle,
  totalCount,
  muscleOptions,
}: Props) {
  const options = muscleOptions?.length ? muscleOptions : MUSCLE_OPTIONS;

  return (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {/* פילטרים */}
      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {options.map((m) => {
          const active = selectedMuscle === m;
          return (
            <Pressable
              key={m}
              onPress={() => onChangeMuscle(m)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: active ? "#2563eb" : "#e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: active ? "#fff" : "#374151",
                  fontWeight: active ? "700" : "500",
                }}
              >
                {m}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* מונה תרגילים */}
      <Text style={{ fontSize: 12, color: "#6b7280" }}>
        נמצאו {totalCount} תרגילים
      </Text>
    </View>
  );
}
