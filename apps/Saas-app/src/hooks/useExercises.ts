import { useState, useEffect } from "react";
import { Exercise } from "../types/workout";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setExercises([
      {
        id: "ex1",
        name: "לחיצת חזה כנגד מוט",
        muscleGroup: "חזה",
        difficulty: "בינוני",
        equipment: ["ספסל", "מוט"],
        updatedAt: "24/10/2023",
        thumbnail:
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070",
      },
      {
        id: "ex2",
        name: "סקוואט חופשי",
        muscleGroup: "רגליים",
        difficulty: "קשה",
        equipment: ["מוט", "כלוב"],
        updatedAt: "22/10/2023",
        thumbnail:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
      },
      {
        id: "ex3",
        name: "פשיטת מרפקים בכבל",
        muscleGroup: "יד אחורית",
        difficulty: "קל",
        equipment: ["מכונת כבלים"],
        updatedAt: "15/10/2023",
        thumbnail: null,
      },
    ]);
  }, []);

  return { exercises };
}
