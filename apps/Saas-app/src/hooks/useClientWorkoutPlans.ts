import { useState } from "react";

export function useClientWorkoutPlans(clientId: string) {
  const [plans, setPlans] = useState([
    {
      id: "progA",
      name: "תוכנית A",
      muscleGroups: ["CHEST", "BACK", "SHOULDERS"],
      exercises: [
        {
          id: "w1",
          muscleGroup: "CHEST",
          name: "Bench Press",
          sets: 4,
          reps: "10-12",
          weight: 40,
        },
        {
          id: "w2",
          muscleGroup: "BACK",
          name: "Lat Pulldown",
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
      name: template.label ?? template.name,
      muscleGroups: template.muscles ?? [], 
      exercises: [],
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
