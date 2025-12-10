import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { UIExercise, UIWorkoutTemplate } from "../../types/ui/workout-ui";
import WorkoutTemplateCard from "./WorkoutTemplateCard";
import WorkoutTemplateForm from "./WorkoutTemplateForm";
import { SectionHeader } from "./common/SectionHeader";
import { theme } from "../../theme";

type Props = {
  templates: UIWorkoutTemplate[];
  exercises?: UIExercise[];
  onCreateNew?: () => void;
  onSelectTemplate?: (template: UIWorkoutTemplate) => void;
  onSubmitTemplate?: (payload: any) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function WorkoutTemplatesList({
  templates,
  exercises = [],
  onCreateNew,
  onSelectTemplate,
  onSubmitTemplate,
  isLoading = false,
  isError = false,
  onRetry,
}: Props) {
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UIWorkoutTemplate | null>(null);

  const skeletons = useMemo(() => Array.from({ length: 2 }), []);

  const handleStartCreate = () => {
    setIsCreatingTemplate(true);
    setEditingTemplate(null);
    onCreateNew?.();
  };

  const handleSelectTemplate = (template: UIWorkoutTemplate) => {
    onSelectTemplate?.(template);
    setEditingTemplate(template);
    setIsCreatingTemplate(true);
  };

  const renderState = () => {
    if (isLoading) {
      return (
        <View style={styles.skeletonRow}>
          {skeletons.map((_, index) => (
            <View key={index} style={styles.skeleton} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>לא הצלחנו לטעון תבניות אימון.</Text>
          <Pressable onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>נסה שוב</Text>
          </Pressable>
        </View>
      );
    }

    if (templates.length === 0 && !isCreatingTemplate) {
      return (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>אין עדיין תבניות אימון.</Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        <Pressable onPress={handleStartCreate} style={styles.addCard}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>צור תבנית חדשה</Text>
        </Pressable>

        {templates.map((template) => (
          <View key={template.id} style={styles.gridItem}>
            <WorkoutTemplateCard
              program={template}
              onSelect={handleSelectTemplate}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="תבניות אימון"
        subtitle="(Workout Templates)"
        action={
          <Pressable onPress={handleStartCreate} style={styles.ctaButton}>
            <Text style={styles.ctaText}>+ צור תבנית חדשה</Text>
          </Pressable>
        }
      />

      {isCreatingTemplate ? (
        <WorkoutTemplateForm
          initialTemplate={editingTemplate}
          exercises={exercises}
          onCancel={() => setIsCreatingTemplate(false)}
          onSubmit={(payload) => {
            onSubmitTemplate?.(payload);
            setIsCreatingTemplate(false);
          }}
        />
      ) : null}

      {renderState()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.card.bg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.card.border,
    marginBottom: 24,
    gap: 12,
  },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
  },
  addCard: {
    width: "48%",
    minHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.card.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  addIcon: {
    fontSize: 30,
    color: "#9ca3af",
  },
  addText: {
    color: theme.text.subtitle,
    fontSize: 13,
  },
  skeletonRow: {
    flexDirection: "row-reverse",
    gap: 12,
    marginTop: 8,
  },
  skeleton: {
    width: "48%",
    height: 120,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  errorBox: {
    borderWidth: 1,
    borderColor: "#fecdd3",
    backgroundColor: "#fff1f2",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    textAlign: "right",
    color: "#b91c1c",
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "700",
  },
  emptyBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  emptyText: {
    textAlign: "right",
    color: theme.text.subtitle,
  },
  ctaButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#2563eb",
    borderRadius: 999,
  },
  ctaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});