import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

import type { WorkoutTemplateCreateRequestDto } from "@common/api/sdk/schemas";

import { useCreateWorkoutTemplate } from "@/hooks/workout/workoutTemplate/useCreateWorkoutTemplate";

import WorkoutTemplateCard from "./WorkoutTemplateCard";
import WorkoutTemplateModal from "./WorkoutTemplateModal";
import { SectionHeader } from "./common/SectionHeader";
import { theme } from "../../theme";
import { styles } from "./styles/WorkoutTemplatesList.styles";

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
          <Text style={styles.errorText}>לא הצלחנו לטעון תבניות אימון</Text>

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
          <Text style={[styles.emptyText, { color: theme.text.subtitle }]}>
            אין עדיין תבניות אימון
          </Text>

          <Pressable onPress={startCreate} style={styles.primaryCta}>
            <Text style={styles.primaryCtaText}>צור תבנית ראשונה</Text>
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card.bg,
          borderColor: theme.card.border,
        },
      ]}
    >
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
