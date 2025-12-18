import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

import type {
  WorkoutTemplateCreateRequestDto,
} from "@common/api/sdk/schemas";

import { useCreateWorkoutTemplate } from
  "@/hooks/workout/workoutTemplate/useCreateWorkoutTemplate";

import WorkoutTemplateCard from "./WorkoutTemplateCard";
import WorkoutTemplateModal from "./WorkoutTemplateModal";
import { SectionHeader } from "./common/SectionHeader";
import { theme } from "../../theme";

type Props = {
  templates: UIWorkoutTemplate[];
  exercises?: UIExercise[];

  onCreateNew?: () => void;
  onSelectTemplate?: (template: UIWorkoutTemplate) => void;

  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function WorkoutTemplatesList({
  templates,
  exercises = [],
  onCreateNew,
  onSelectTemplate,
  isLoading = false,
  isError = false,
  onRetry,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<UIWorkoutTemplate | null>(null);

  const skeletons = useMemo(() => Array.from({ length: 2 }), []);
  const createTemplate = useCreateWorkoutTemplate();

  const startCreate = () => {
    setEditingTemplate(null);
    setModalOpen(true);
    onCreateNew?.();
  };

  const selectTemplate = (template: UIWorkoutTemplate) => {
    setEditingTemplate(template);
    setModalOpen(true);
    onSelectTemplate?.(template);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.grid}>
          {skeletons.map((_, i) => (
            <View key={i} style={styles.skeleton} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            לא הצלחנו לטעון תבניות אימון
          </Text>

          {onRetry && (
            <Pressable onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>נסה שוב</Text>
            </Pressable>
          )}
        </View>
      );
    }

    if (templates.length === 0 && !modalOpen) {
      return (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>אין עדיין תבניות אימון</Text>

          <Pressable onPress={startCreate} style={styles.primaryCta}>
            <Text style={styles.primaryCtaText}>
              צור תבנית ראשונה
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {templates.map((template) => (
          <WorkoutTemplateCard
            key={template.id}
            program={template}
            onSelect={selectTemplate}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="תבניות אימון"
        subtitle="Workout Templates"
        action={
          !modalOpen && (
            <Pressable onPress={startCreate} style={styles.headerCta}>
              <Text style={styles.headerCtaText}>＋ חדש</Text>
            </Pressable>
          )
        }
      />

      <WorkoutTemplateModal
        visible={modalOpen}
        initialTemplate={editingTemplate}
        exercises={exercises}
        onClose={() => setModalOpen(false)}
        onSubmit={async (payload: WorkoutTemplateCreateRequestDto) => {
          await createTemplate.mutateAsync(payload);
          setModalOpen(false);
        }}
      />

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.card.bg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.card.border,
    marginBottom: 28,
    gap: 14,
  },

  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 14,
  },

  addCard: {
    width: "48%",
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.card.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    gap: 6,
  },

  addIcon: {
    fontSize: 32,
    color: "#64748b",
  },

  addText: {
    fontSize: 13,
    color: theme.text.subtitle,
  },

  skeleton: {
    width: "48%",
    height: 120,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
  },

  emptyBox: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 24,
  },

  emptyText: {
    color: theme.text.subtitle,
    fontSize: 14,
  },

  primaryCta: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  primaryCtaText: {
    color: "#fff",
    fontWeight: "700",
  },

  errorBox: {
    backgroundColor: "#fff1f2",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fecdd3",
    gap: 8,
  },

  errorText: {
    textAlign: "right",
    color: "#b91c1c",
  },

  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },

  headerCta: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  headerCtaText: {
    color: "#fff",
    fontWeight: "600",
  },
});
