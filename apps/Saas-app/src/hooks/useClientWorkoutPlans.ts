import { useState } from "react";

export function useClientWorkoutPlans(clientId: string) {
  const [plans, setPlans] = useState([
    {
      id: "progA",
      name: "תוכנית A",
      muscleGroups: ["חזה", "גב", "כתפיים"],
      exercises: [
        {
          id: "w1",
          muscleGroup: "חזה",
          name: "לחיצת חזה",
          sets: 4,
          reps: "10-12",
          weight: 40,
        },
        {
          id: "w2",
          muscleGroup: "גב",
          name: "משיכה לטן",
          sets: 4,
          reps: "12",
          weight: 35,
        },
      ],
    },
  ]);

  function createPlanFromTemplate(template) {
    const newPlan = {
      id: "prog_" + Math.random().toString(36).slice(2),
      name: template.name,
      muscleGroups: template.exercises?.map((ex) => ex.exercise.primaryMuscle) ?? [],
      exercises:
        template.exercises?.map((ex) => ({
          id: ex.id,
          muscleGroup: ex.exercise.primaryMuscle,
          name: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps ?? "",
          weight: null,
        })) ?? [],
    };

    setPlans((prev) => [...prev, newPlan]);

    return newPlan;
  }
  

  function updatePlan(planId, updatedPlan) {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? updatedPlan : p))
    );
  }

  function removePlan(planId) {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }

  return {
    plans,
    createPlanFromTemplate,
    updatePlan,
    removePlan,
  };
}

