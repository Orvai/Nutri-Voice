import { View, Text, Image, Pressable } from "react-native";

type Props = {
  item: any;
  onPress?: () => void; // ← אופציונלי!
};

export default function WorkoutExerciseCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        {/* תמונה / אין וידאו */}
        <View style={{ height: 150, backgroundColor: "#f3f4f6" }}>
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
              }}
            >
              <Text style={{ color: "#9ca3af" }}>אין וידאו</Text>
            </View>
          )}
        </View>

        {/* מידע על התרגיל */}
        <View style={{ padding: 14 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 6 }}>
            {item.name}
          </Text>

          <Text style={{ fontSize: 13, color: "#6b7280" }}>
            {item.muscleGroup}
          </Text>

          {/* ציוד */}
          {Array.isArray(item.equipment) && (
            <Text style={{ fontSize: 13, color: "#6b7280" }}>
              {item.equipment.join(", ")}
            </Text>
          )}

          <Text style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
            עודכן: {item.updatedAt}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
