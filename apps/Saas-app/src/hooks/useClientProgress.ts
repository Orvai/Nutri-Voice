import { useState } from "react";

export function useClientProgress(clientId?: string) {
  const [range, setRange] = useState(180);

  // אפשר להתעלם מ-clientId כרגע כי זה MOCK
  // בעתיד תשלוף מפה מה-API

  const data = {
    weightTrend: [87.5, 85.2, 83.1, 81.8, 79.5, 78.5, 75.0],
    weightMonths: ["מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר"],

    bodyFat: [24.5, 23.2, 21.8, 20.5, 19.1, 17.9, 16.3],
    muscleMass: [32.1, 32.5, 32.8, 33.2, 33.8, 34.5, 34.9],

    calorieDates: ["17/11", "16/11", "15/11", "14/11", "13/11", "12/11", "11/11"],
    calories: [450, -20, -450, 20, 320, -180, 250],

    workoutProgressMuscles: ["חזה", "גב", "רגליים", "כתפיים", "זרועות"],
    workoutProgressNow: [145, 165, 210, 95, 105],

    summary: {
      weightChange: "-12.5 ק\"ג",
      fatChange: "-8.2%",
      muscleChange: "+2.8 ק\"ג",
      stepsAvg: 7450,
      stepsPercent: 74,
      waterAvg: "2.6L",
      waterPercent: 87,
    },

    workoutWeights: [
      { muscle: "חזה", exercise: "לחיצת חזה", work: "52.5 ק\"ג", max: "60 ק\"ג", progress: "8%", date: "22/1" },
    ],

    measurements: [
      { date: "15/11/2024", weight: "75.0", fat: "16.3%", muscle: "34.9", waist: "82", chest: "98" },
    ],
  };

  return { range, setRange, data };
}
