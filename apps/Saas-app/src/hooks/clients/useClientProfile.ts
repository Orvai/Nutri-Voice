import { useMemo } from "react";
import { useClients } from "@/hooks/clients";
import { useDailyState } from "@/hooks/tracking/useDailyState";

export function useClientProfile(id: string) {
  const { data: clients, isLoading: isLoadingClients } = useClients();
  
  const { data: dailyState, isLoading: isLoadingState } = useDailyState(id);

  const base = useMemo(() => {
    return (clients ?? []).find((c) => c.id === id) || null;
  }, [clients, id]);

  const todayStats = useMemo(() => {
    if (!dailyState) {
      return {
        calories: {
          consumed: 0,
          target: 0,
          carbs: { eaten: 0, target: 0 },
          protein: { eaten: 0, target: 0 },
          fat: { eaten: 0, target: 0 },
          lastUpdate: "טוען נתונים...",
        },
        quickStats: [],
        meals: [],
        workout: null,
      };
    }
    

    const totals = (dailyState.meals || []).reduce((acc, meal) => ({
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }), { protein: 0, carbs: 0, fat: 0 });

    const currentTarget = dailyState.activeCaloriesAllowed || 0;

    return {
      calories: {
        consumed: dailyState.consumedCalories || 0,
        target: currentTarget,
        carbs: { eaten: totals.carbs, target: 0 },
        protein: { eaten: totals.protein, target: 0 },
        fat: { eaten: totals.fat, target: 0 },
        lastUpdate: dailyState.meals?.length > 0 ? "עודכן כעת" : "לא הוזנו ארוחות",
      },

      quickStats: [
        { 
          icon: "scale", 
          label: "משקל", 
          value: dailyState.weight ? `${dailyState.weight.weightKg} ק"ג` : "לא דווח" 
        },
        { 
          icon: "water", 
          label: "שתייה", 
          value: `${dailyState.metrics?.waterLiters || 0} ליטר` 
        },
        { 
          icon: "walk", 
          label: "צעדים", 
          value: (dailyState.metrics?.steps || 0).toLocaleString() 
        },
        { 
          icon: "moon", 
          label: "שינה", 
          value: dailyState.metrics?.sleepHours ? `${dailyState.metrics.sleepHours} שעות` : "0 שעות" 
        },
      ],

      meals: (dailyState.meals || []).map(m => ({
        id: m.id,
        title: m.description || "ארוחה",
        icon: "restaurant",
        time: new Date(m.date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        calories: m.calories,
        protein: m.protein,
        description: m.description,
      })),

      workout: dailyState.workouts?.[0] ? {
        done: true,
        title: dailyState.workouts[0].workoutType,
        effort: dailyState.workouts[0].effortLevel,
        exercisesCount: dailyState.workouts[0].exercises?.length || 0
      } : null
    };
  }, [dailyState]);

  if (isLoadingClients || !base) {
    return { client: null, loading: true };
  }

  const client = {
    ...base,
    today: todayStats,
  };

  return {
    client,
    loading: false,
  };
}