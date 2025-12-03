import { View, ScrollView } from "react-native";
import { useClientNutritionPlans } from "../../../hooks/useClientNutritionPlans";
import PlansList from "./PlansList";
import EmptyState from "./EmptyState";

export default function ClientNutritionPlans({ clientId }) {
  const { plans, createPlan } = useClientNutritionPlans(clientId);

  if (!plans || plans.length === 0) {
    return <EmptyState onCreate={createPlan} />;
  }

  return <PlansList plans={plans} onCreate={createPlan} />;
}

