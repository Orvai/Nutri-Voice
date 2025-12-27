import { useEffect, useState } from "react";

export function useDashboardData() {
  const [data, setData] = useState({
    dailyKpis: {
      dailyReports: 87,
      calorieTarget: 74,
      workoutCompletion: 81,
      atRisk: 12,
    },

    attentionMessages: [
      {
        name: "דוד כהן",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        time: "לפני 15 דק׳",
        message: "לא מרגיש טוב, רוצה לשנות תוכנית",
        severity: "red" as const, // ← תואם לקומפוננטה
      },
      {
        name: "שרה לוי",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        time: "לפני 42 דק׳",
        message: "שאלה לגבי תחליף לחלב",
        severity: "yellow" as const,
      },
    ],

    nutritionDeviations: [
      {
        name: "דוד כהן",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        meal: "ארוחת ערב",
        calories: +450,
        color: "red" as const,
      },
      {
        name: "שרה לוי",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        meal: "ארוחת צהריים",
        calories: -120,
        color: "green" as const,
      },
    ],

    missingReports: [
      {
        name: "אליה רוזן",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
        days: 3,
        risk: "high" as const, // ← חייב להיות הערכים האלו בלבד
      },
      {
        name: "רחל גולדברג",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
        days: 1,
        risk: "medium" as const,
      },
    ],

    atRiskClients: [
      {
        name: "דוד כהן",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        lastReportDays: 3,
        calorieStatus: -35,
        lastWorkout: "כוח - לפני 5 ימים",
      },
      {
        name: "מיכאל אברהם",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        lastReportDays: 2,
        calorieStatus: +5,
        lastWorkout: "כוח - לפני שבוע",
      },
    ],
  });

  useEffect(() => {
    // בעתיד יוחלף ב-fetch אמיתי
  }, []);

  return data;
}
