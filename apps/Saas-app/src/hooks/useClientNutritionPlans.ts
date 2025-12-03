import { useState, useEffect } from "react";

// ---- MOCK DATA ---- //
const MOCK_PLANS = [
  {
    id: "plan_001",
    createdAt: "2025-02-10",
    trainingDay: {
      dayType: "training",
      totalCalories: 2100,
      notes: "תפריט יום אימון בסיסי",
      supplements: [
        { id: "sup1", name: "ויטמין D", dosage: "2000IU", timing: "בוקר" },
        { id: "sup2", name: "אומגה 3", dosage: "1 כפסולה", timing: "ערב" },
      ],
      meals: [
        {
          id: "m1",
          title: "ארוחת בוקר",
          timeRange: "08:00-09:00",
          notes: "אופציה לגלוטן חופשי",
          options: [
            {
              id: "opt1",
              title: "חלבון",
              color: "#2563eb",
              foods: [
                {
                  id: "f1",
                  name: "ביצה קשה",
                  grams: 60,
                  calories: 78,
                  color: "#93c5fd",
                },
                {
                  id: "f2",
                  name: "גבינה לבנה 5%",
                  grams: 100,
                  calories: 99,
                  color: "#60a5fa",
                },
              ],
            },
            {
              id: "opt2",
              title: "פחמימה",
              color: "#ca8a04",
              foods: [
                {
                  id: "f3",
                  name: "לחם מלא",
                  grams: 60,
                  calories: 220,
                  color: "#facc15",
                },
              ],
            },
          ],
        },
      ],
    },

    restDay: {
      dayType: "rest",
      totalCalories: 1800,
      notes: "תפריט יום מנוחה, פחות פחמימה",
      supplements: [],
      meals: [
        {
          id: "m2",
          title: "ארוחת צהריים",
          timeRange: "12:00-13:00",
          notes: "",
          options: [
            {
              id: "opt3",
              title: "חלבון",
              color: "#10b981",
              foods: [
                {
                  id: "f4",
                  name: "עוף בתנור",
                  grams: 150,
                  calories: 250,
                  color: "#6ee7b7",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // תכנית שנייה (ריקה יותר כדי לראות וריאציה)
  {
    id: "plan_002",
    createdAt: "2025-02-12",
    trainingDay: {
      dayType: "training",
      totalCalories: 2300,
      notes: "",
      supplements: [],
      meals: [],
    },
    restDay: {
      dayType: "rest",
      totalCalories: 1900,
      notes: "",
      supplements: [],
      meals: [],
    },
  },
];

export function useClientNutritionPlans(clientId: string) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // נטען את התכניות המזוייפות
    setPlans(MOCK_PLANS);
  }, [clientId]);

  function createPlan() {
    const newPlan = {
      id: "plan_" + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString().slice(0, 10),
      trainingDay: {
        dayType: "training",
        totalCalories: 2000,
        notes: "",
        supplements: [],
        meals: [],
      },
      restDay: {
        dayType: "rest",
        totalCalories: 1800,
        notes: "",
        supplements: [],
        meals: [],
      },
    };

    setPlans((prev) => [...prev, newPlan]);
  }

  return { plans, createPlan };
}
