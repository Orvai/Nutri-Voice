import { useMemo } from "react";
import { useClients } from "./useClients";

export function useClientProfile(id: string) {
  const { clients } = useClients();

  // מוצא את הלקוח מתוך ה-List שכבר נטענו
  const base = useMemo(() => {
    return clients.find((c) => c.id === id) || null;
  }, [clients, id]);

  // אם עוד לא נטען הלקוח — נחזיר null
  if (!base) return { client: null, loading: true };

  // נתוני TODAY — עדיין MOCK
  const mock = {
    today: {
      calories: {
        consumed: 1850,
        target: 2200,
        carbs: { eaten: 185, target: 220 },
        protein: { eaten: 96, target: 110 },
        fat: { eaten: 44, target: 60 },
        lastUpdate: "19:45",
      },

      quickStats: [
        { icon: "scale", label: "משקל", value: "82.5 ק\"ג" },
        { icon: "water", label: "שתייה", value: "2.1 ליטר" },
        { icon: "walk", label: "צעדים", value: "8,420" },
        { icon: "moon", label: "שינה", value: "7.5 שעות" },
      ],

      meals: [
        {
          id: "b1",
          title: "ארוחת בוקר",
          icon: "cafe",
          time: "07:32",
          calories: 420,
          protein: 28,
          fat: 12,
          fromPlan: true,
          description:
            "שייק חלבון עם בננה, שיבולת שועל עם אגוזים וקינמון",
        },
      ],

      workout: {
        done: true,
        title: "אימון כוח - גוף עליון",
        time: "18:30 - 19:45",
        duration: "75 דק'",
        calories: 420,
      },

      messages: [
        {
          id: "m1",
          avatar:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
          text: "לא מרגיש טוב היום, אולי להוריד עומס?",
          time: "לפני שעתיים",
        },
        {
          id: "m2",
          avatar:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
          text: "שאלה לגבי תוסף — מתי לקחת קריאטין?",
          time: "לפני 4 שעות",
        },
      ],
    },
  };

  // מיזוג הלקוח האמיתי + נתוני היום
  const client = { ...base, ...mock };

  return {
    client,
    loading: false,
  };
}
