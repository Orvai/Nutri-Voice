import { ScrollView } from "react-native";
import WorkoutPlansList from "./WorkoutPlansList";
import { useClientWorkoutPlans } from "../../../hooks/useClientWorkoutPlans";
import { useWorkoutTemplates } from "../../../hooks/workout/useWorkoutTemplates";

export default function ClientWorkoutPlans({ clientId }) {
  const { plans, createPlanFromTemplate, updatePlan, removePlan } =
    useClientWorkoutPlans(clientId);

  const {
    templates,
    isLoading: templatesLoading,
    isError: templatesError,
    refetch,
  } = useWorkoutTemplates();

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <WorkoutPlansList
        plans={plans}
        templates={templates}
        templatesLoading={templatesLoading}
        templatesError={templatesError}
        onReloadTemplates={refetch}
        onCreateFromTemplate={createPlanFromTemplate}
        onUpdate={updatePlan}
        onDelete={removePlan}
      />
    </ScrollView>
  );
}