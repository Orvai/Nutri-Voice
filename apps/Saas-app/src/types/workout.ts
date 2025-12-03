export type WorkoutTemplate = {
    id: string;
    label: string;       // A / B / FB / PUSH וכו'
    name: string;        // תבנית A
    description: string; // Upper Body Focus
    color: string;       // hex color
    muscles: string[];   // ["חזה", "גב", ...]
  };
  
  export type Exercise = {
    id: string;
    name: string;
    muscleGroup: string;
    difficulty: "קל" | "בינוני" | "קשה";
    equipment: string[];
    updatedAt: string;
    thumbnail: string | null;
  };
  