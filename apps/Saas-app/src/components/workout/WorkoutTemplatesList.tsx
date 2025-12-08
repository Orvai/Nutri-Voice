import { View, Text, Pressable } from "react-native";
import type { UIWorkoutProgram } from "../../types/ui/workout-ui";
import WorkoutTemplateCard from "./WorkoutTemplateCard";

type Props = {
  templates: UIWorkoutProgram[];
  onCreateNew?: () => void;
  onSelectTemplate?: (template: UIWorkoutProgram) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function WorkoutTemplatesList({
  templates,
  onCreateNew,
  onSelectTemplate,
  isLoading = false,
  isError = false,
  onRetry,
}: Props) {
  const renderState = () => {
    if (isLoading) {
      return (
        <View style={{ flexDirection: "row-reverse", gap: 12, marginTop: 8 }}>
          {[1, 2].map((placeholder) => (
            <View
              key={placeholder}
              style={{
                width: "48%",
                height: 120,
                borderRadius: 14,
                backgroundColor: "#f3f4f6",
              }}
            />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#fecdd3",
            backgroundColor: "#fff1f2",
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
            gap: 8,
          }}
        >
          <Text style={{ textAlign: "right", color: "#b91c1c" }}>
            לא הצלחנו לטעון תבניות אימון.
          </Text>
          <Pressable
            onPress={onRetry}
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "#ef4444",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>נסה שוב</Text>
          </Pressable>
        </View>
      );
    }

    if (templates.length === 0) {
      return (
        <View
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ textAlign: "right", color: "#6b7280" }}>
            אין עדיין תבניות אימון.
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
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

        {templates.map((template) => (
          <View key={template.id} style={{ width: "48%" }}>
            <WorkoutTemplateCard
              program={template}
              onSelect={onSelectTemplate}
            />
          </View>
        ))}
      </View>
    );
  };

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

      {renderState()}
    </View>
  );
}
