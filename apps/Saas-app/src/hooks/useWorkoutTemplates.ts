import { useEffect, useState } from "react";
import { WorkoutTemplate } from "../types/workout";

export function useWorkoutTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    setTemplates([
      {
        id: "tempA",
        label: "A",
        name: "תבנית A",
        description: "Upper Body Focus",
        color: "#4f46e5",
        muscles: ["חזה", "גב", "כתפיים"],
      },
      {
        id: "tempB",
        label: "B",
        name: "תבנית B",
        description: "Lower Body Focus",
        color: "#ea580c",
        muscles: ["רגליים", "יד קדמית", "יד אחורית"],
      },
      {
        id: "tempFB",
        label: "FB",
        name: "תבנית FBW",
        description: "Full Body",
        color: "#0d9488",
        muscles: ["Full Body", "Core"],
      },
    ]);
  }, []);

  return { templates };
}
