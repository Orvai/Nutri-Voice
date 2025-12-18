// apps/Saas-app/src/components/client-profile/workout/WorkoutPlansList.tsx

import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import type { UIWorkoutProgram } 
  from "../../../types/ui/workout/workoutProgram.ui";
import type { UIWorkoutTemplate } 
  from "../../../types/ui/workout/workoutTemplate.ui";
import type { UIExercise } 
  from "../../../types/ui/workout/exercise.ui";

import WorkoutPlanCard from "./WorkoutPlanCard";
import WorkoutTemplateCard from "../../workout/WorkoutTemplateCard";

type Props = {
  plans: UIWorkoutProgram[];
  activeProgramId: string | null;
  onSelectPlan: (programId: string) => void;

  templates: UIWorkoutTemplate[];
  templatesLoading: boolean;
  templatesError: boolean;
  onReloadTemplates: () => void;
  onCreateFromTemplate: (template: UIWorkoutTemplate) => void | Promise<void>;

  allExercises: UIExercise[];
  onAddExercise: (
    programId: string,
    exercise: UIExercise,
    orderHint?: number
  ) => void | Promise<void>;
  onRemoveExercise: (
    programId: string,
    workoutExerciseId: string
  ) => void | Promise<void>;

  onDeleteProgram: (programId: string) => void | Promise<void>;
};

export default function WorkoutPlansList({
  plans,
  activeProgramId,
  onSelectPlan,
  templates,
  templatesLoading,
  templatesError,
  onReloadTemplates,
  onCreateFromTemplate,
  allExercises,
  onAddExercise,
  onRemoveExercise,
  onDeleteProgram,
}: Props) {
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);

  const activePlan =
    plans.find((p) => p.id === activeProgramId) ?? plans[0] ?? null;

  const renderTabs = () => {
    if (!plans.length) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row-reverse",
          paddingVertical: 8,
          gap: 8,
        }}
      >
        {plans.map((plan) => {
          const isActive = plan.id === activePlan?.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => onSelectPlan(plan.id)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: isActive ? "#2563eb" : "#e5e7eb",
                backgroundColor: isActive ? "#2563eb" : "#f3f4f6",
              }}
            >
              <Text
                style={{
                  color: isActive ? "#ffffff" : "#111827",
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                {plan.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  const renderEmptyState = () => (
    <View
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <Text
        style={{
          textAlign: "right",
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        אין עדיין תוכניות אימון ללקוח.
      </Text>
      <Pressable
        onPress={() => setTemplatesModalOpen(true)}
        style={{
          alignSelf: "flex-end",
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
          backgroundColor: "#2563eb",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
          + צור תוכנית מתבנית
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
          תוכניות אימון של הלקוח
        </Text>

        <Pressable
          onPress={() => setTemplatesModalOpen(true)}
          style={{
            backgroundColor: "#2563eb",
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 13 }}>
            + תוכנית מתבנית
          </Text>
        </Pressable>
      </View>

      {renderTabs()}

      {!plans.length ? (
        renderEmptyState()
      ) : activePlan ? (
        <WorkoutPlanCard
          plan={activePlan}
          allExercises={allExercises}
          onAddExercise={(exercise, orderHint) =>
            onAddExercise(activePlan.id, exercise, orderHint)
          }
          onRemoveExercise={(workoutExerciseId) =>
            onRemoveExercise(activePlan.id, workoutExerciseId)
          }
          onDelete={() => onDeleteProgram(activePlan.id)}
        />
      ) : null}

      <Modal
        visible={templatesModalOpen}
        animationType="slide"
        onRequestClose={() => setTemplatesModalOpen(false)}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#f3f4f6",
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>
              בחר תבנית אימון
            </Text>
            <Pressable onPress={() => setTemplatesModalOpen(false)}>
              <Text style={{ color: "#2563eb" }}>✕ סגור</Text>
            </Pressable>
          </View>

          {templatesError ? (
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ textAlign: "right", color: "#dc2626" }}>
                לא הצלחנו לטעון תבניות.
              </Text>
              <Pressable
                onPress={onReloadTemplates}
                style={{ marginTop: 8, alignSelf: "flex-end" }}
              >
                <Text style={{ color: "#2563eb" }}>נסה שוב</Text>
              </Pressable>
            </View>
          ) : null}

          {templatesLoading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
            >
              {templates.map((template) => (
                <WorkoutTemplateCard
                  key={template.id}
                  program={template}
                  onSelect={async () => {
                    await onCreateFromTemplate(template);
                    setTemplatesModalOpen(false);
                  }}
                />
              ))}

              {!templatesLoading &&
              templates.length === 0 &&
              !templatesError ? (
                <View style={{ paddingVertical: 20 }}>
                  <Text style={{ textAlign: "right", color: "#6b7280" }}>
                    אין תבניות זמינות.
                  </Text>
                </View>
              ) : null}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}
