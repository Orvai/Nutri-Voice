import { View, Text, Pressable } from "react-native";
import WorkoutTemplateCard from "./WorkoutTemplateCard";

export default function WorkoutTemplatesList({
  templates,
  onCreateNew,
}: {
  templates: any[];
  onCreateNew?: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 24,
      }}
    >
      {/* כותרת */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            תבניות אימון
          </Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            (Workout Templates)
          </Text>
        </View>

        <Pressable
          onPress={onCreateNew}
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 14,
            backgroundColor: "#2563eb",
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            + צור תבנית חדשה
          </Text>
        </Pressable>
      </View>

      {/* כרטיס "צור חדש" + הרשימה */}
      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* כרטיס הוספה */}
        <Pressable
          onPress={onCreateNew}
          style={{
            width: "48%",
            minHeight: 100,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderStyle: "dashed",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <Text style={{ fontSize: 30, color: "#9ca3af" }}>+</Text>
          <Text style={{ color: "#6b7280", fontSize: 13 }}>
            צור תבנית חדשה
          </Text>
        </Pressable>

        {/* שאר התבניות */}
        {templates.map((t) => (
          <View key={t.id} style={{ width: "48%" }}>
            <WorkoutTemplateCard item={t} />
          </View>
        ))}
      </View>
    </View>
  );
}
