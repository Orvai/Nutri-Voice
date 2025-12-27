import { useMemo } from 'react';
import { DailyState, DayType, EffortLevel } from '../../types/ui/tracking/daily-state.ui';

export const useDailyAnalytics = (dailyStates: DailyState[] | undefined) => {
  return useMemo(() => {
    if (!dailyStates || dailyStates.length === 0) return null;

    const totalDays = dailyStates.length;

    // --- 1. Initialize Results Object ---
    const results = {
      discipline: {
        logCompleteness: 0,
        adherenceDays: 0,
        plannedWorkouts: 0,
        actualWorkouts: 0,
        score: 0
      },
      calorieBehavior: {
        deltas: [] as { date: string, delta: number, dayType: DayType | null }[],
        averageDelta: 0,
        bingeCount: 0, 
        precisionCount: 0, 
        split: { TRAINING: { sum: 0, count: 0 }, REST: { sum: 0, count: 0 } }
      },
      strength: {
        exercises: {} as Record<string, { 
          history: { date: string, weight: number }[],
          maxWeight: number,
          totalVolume: number,
          frequency: number
        }>,
        volumeTrend: [] as { date: string, totalVolume: number }[]
      },
      recovery: {
        effortDistribution: { EASY: 0, NORMAL: 0, HARD: 0, FAILED: 0, SKIPPED: 0 } as Record<EffortLevel, number>,
        burnoutAlert: false,
        efficiencyScore: 0 
      },
      correlations: {
        sleepVsEffort: [] as { sleep: number, effort: EffortLevel }[],
        waterVsWeight: [] as { water: number, weightChange: number }[],
        stepsVsCalories: [] as { steps: number, calories: number }[]
      },
      streaks: {
        currentCompliance: 0,
        maxCompliance: 0,
        currentLogging: 0,
        maxLogging: 0
      },
      nutritionReport: {
        total: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        avg: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        daysCount: 0
      },
      bodyMetrics: {
        weightTrend: [] as { date: string, kg: number }[],
        avgSteps: 0,
        avgSleep: 0,
        avgWater: 0,
        weightChange: 0
      },
      // IMPORTANT: Added insights array here
      insights: [] as string[]
    };

    let runningComplianceStreak = 0;
    let runningLoggingStreak = 0;

    // --- 2. Processing Loop ---
    dailyStates.forEach((day, index) => {
      const date = day.weight?.date || `Day ${index + 1}`;
      const target = day.dayType === 'TRAINING' ? day.calorieTargets.trainingDay : day.calorieTargets.restDay;
      const isLogged = !!(day.weight || day.meals.length > 0 || day.metrics);

      // Discipline & Streaks
      if (isLogged) {
        results.discipline.logCompleteness++;
        runningLoggingStreak++;
        results.streaks.maxLogging = Math.max(results.streaks.maxLogging, runningLoggingStreak);
      } else {
        runningLoggingStreak = 0;
      }

      if (target) {
        const isCompliant = day.consumedCalories <= target + 100; 
        if (isCompliant) {
          results.discipline.adherenceDays++;
          runningComplianceStreak++;
          results.streaks.maxCompliance = Math.max(results.streaks.maxCompliance, runningComplianceStreak);
        } else {
          runningComplianceStreak = 0;
        }
      }

      // Calorie Behavior
      if (target) {
        const delta = day.consumedCalories - target;
        results.calorieBehavior.deltas.push({ date, delta, dayType: day.dayType });
        if (delta > 500) results.calorieBehavior.bingeCount++;
        if (Math.abs(delta) < 100) results.calorieBehavior.precisionCount++;
        
        if (day.dayType) {
          results.calorieBehavior.split[day.dayType].sum += delta;
          results.calorieBehavior.split[day.dayType].count++;
        }
      }

      // Strength Progression
      let dailyVolume = 0;
      day.workouts.forEach(workout => {
        results.discipline.actualWorkouts++;
        results.recovery.effortDistribution[workout.effortLevel]++;

        workout.exercises.forEach(ex => {
          if (ex.weight) {
            dailyVolume += ex.weight;
            if (!results.strength.exercises[ex.exerciseName]) {
              results.strength.exercises[ex.exerciseName] = { history: [], maxWeight: 0, totalVolume: 0, frequency: 0 };
            }
            const entry = results.strength.exercises[ex.exerciseName];
            entry.history.push({ date: workout.date, weight: ex.weight });
            entry.maxWeight = Math.max(entry.maxWeight, ex.weight);
            entry.totalVolume += ex.weight;
            entry.frequency++;
          }
        });

        // Correlation: Sleep vs Effort
        if (day.metrics?.sleepHours) {
          results.correlations.sleepVsEffort.push({ sleep: day.metrics.sleepHours, effort: workout.effortLevel });
        }
      });
      results.strength.volumeTrend.push({ date, totalVolume: dailyVolume });

      // Nutrition
      results.nutritionReport.total.calories += day.consumedCalories;
      day.meals.forEach(meal => {
        results.nutritionReport.total.protein += meal.protein;
        results.nutritionReport.total.carbs += meal.carbs;
        results.nutritionReport.total.fat += meal.fat;
      });

      // Metrics
      if (day.weight) results.bodyMetrics.weightTrend.push({ date, kg: day.weight.weightKg });
      if (day.metrics) {
        results.bodyMetrics.avgSteps += day.metrics.steps || 0;
        results.bodyMetrics.avgSleep += day.metrics.sleepHours || 0;
        results.bodyMetrics.avgWater += day.metrics.waterLiters || 0;
      }
    });

    // --- 3. Final Calculations ---
    results.discipline.score = Math.round(
      ((results.discipline.logCompleteness / totalDays) * 0.3 +
      (results.discipline.adherenceDays / totalDays) * 0.5 +
      (results.discipline.actualWorkouts / (totalDays * 0.4 || 1)) * 0.2) * 100
    );

    results.nutritionReport.avg = {
      calories: Math.round(results.nutritionReport.total.calories / totalDays),
      protein: Math.round(results.nutritionReport.total.protein / totalDays),
      carbs: Math.round(results.nutritionReport.total.carbs / totalDays),
      fat: Math.round(results.nutritionReport.total.fat / totalDays),
    };

    results.bodyMetrics.weightChange = results.bodyMetrics.weightTrend.length > 1 
      ? Number((results.bodyMetrics.weightTrend[results.bodyMetrics.weightTrend.length - 1].kg - results.bodyMetrics.weightTrend[0].kg).toFixed(2))
      : 0;
    
    // Finalize averages (avoiding division by zero)
    results.bodyMetrics.avgSleep = Number((results.bodyMetrics.avgSleep / totalDays).toFixed(1));
    results.bodyMetrics.avgSteps = Math.round(results.bodyMetrics.avgSteps / totalDays);
    results.bodyMetrics.avgWater = Number((results.bodyMetrics.avgWater / totalDays).toFixed(1));

    results.streaks.currentCompliance = runningComplianceStreak;
    results.streaks.currentLogging = runningLoggingStreak;

    // --- 4. Generate AI Insights ---
    const insights: string[] = [];
    if (results.discipline.score > 85) insights.push("מדהים! רמת העקביות שלך גבוהה מאוד.");
    if (results.calorieBehavior.bingeCount > 2) insights.push("זוהו מספר חריגות קלוריות משמעותיות השבוע.");
    if (results.bodyMetrics.avgSleep < 6.5) insights.push("מחסור בשינה עלול לפגוע בהתאוששות ובמשקלי העבודה.");
    
    results.insights = insights;

    return results;
  }, [dailyStates]);
};