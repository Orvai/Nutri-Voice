// src/hooks/useTemplateMenus.ts
import { useState, useEffect } from "react";
import { api } from "../api/api";

export type TemplateMenuMealOption = {
  id: string;
  mealTemplateId: string;
  name?: string;
  orderIndex: number;
};

export type TemplateMenuMeal = {
  id: string;
  name: string;
  selectedOptionId?: string;
  options: TemplateMenuMealOption[];
};

export type TemplateMenuVitamin = {
  id: string;
  name: string;
  description?: string;
};

export type TemplateMenu = {
  id: string;
  coachId: string;
  name: string;
  dayType: "TRAINING" | "REST";
  notes?: string;
  totalCalories: number;
  meals: TemplateMenuMeal[];
  vitamins: TemplateMenuVitamin[];
};

// 🔥 ה-response האמיתי מה-gateway:
type TemplateMenusResponse = {
  data: TemplateMenu[];
};

export function useTemplateMenus() {
  const [menus, setMenus] = useState<TemplateMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get<TemplateMenusResponse>(
          "/api/menu/template-menus",
          {
            headers: {
              Authorization: `Bearer ${globalThis.ACCESS_TOKEN}`,
            }
          }
        );

        console.log("📦 RAW RESPONSE:", res.data);

        // ⬅⬅⬅ זה השינוי שמתקן את כל הבאג:
        const list = res.data.data ?? [];

        console.log("🔥 PARSED LIST:", list);

        setMenus(list);
      } catch (err: any) {
        console.log("❌ TEMPLATE MENUS ERROR:", err?.response?.data || err);
        setError("שגיאה בטעינת תבניות תפריט");
        setMenus([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { menus, loading, error };
}
