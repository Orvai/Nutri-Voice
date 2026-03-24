import { useMemo } from "react";
import { useClients } from "@/hooks/clients";
import { useDailyState } from "@/hooks/tracking/useDailyState";

export function useClientProfile(id: string) {
  const { data: clients, isLoading: isLoadingClients } = useClients({
    statusFilter: "all",
  });
  
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
        workouts: [],
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

      workouts: (dailyState.workouts || []).map((w) => ({
        id: w.id,
        date: w.date,
        workoutType: w.workoutType,
        effortLevel: w.effortLevel,
        notes: w.notes,
        exercises: (w.exercises || []).map((ex) => ({
          id: ex.id,
          exerciseName: ex.exerciseName,
          weight: ex.weight,
        })),
      })),
      workout: dailyState.workouts?.[0]
        ? {
            id: dailyState.workouts[0].id,
            date: dailyState.workouts[0].date,
            workoutType: dailyState.workouts[0].workoutType,
            effortLevel: dailyState.workouts[0].effortLevel,
            notes: dailyState.workouts[0].notes,
            exercises: (dailyState.workouts[0].exercises || []).map((ex) => ({
              id: ex.id,
              exerciseName: ex.exerciseName,
              weight: ex.weight,
            })),
          }
        : null,
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
