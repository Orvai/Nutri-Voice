// src/hooks/tracking/useDailyAnalytics.ts
//TODO- Split to builders
import { useMemo } from "react";
import { DailyState, DayType, EffortLevel } from "../../types/ui/tracking/daily-state.ui";
import {
  CoachAnalytics,
  ISODate,
  ConfidenceLevel,
  Severity,
  DisciplineBand,
  FatigueRisk,
  GoalType,
  StatSummary,
  HabitCorrelationItem,
  CorrelationDirection,
} from "../../types/ui/tracking/coach-analytics.ui";

const DEFAULT_GOAL: GoalType = "UNKNOWN";
const LOW_SLEEP_HOURS = 6.5;

function clampPercent(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function std(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const v = mean(xs.map((x) => (x - m) ** 2));
  return Math.sqrt(v);
}

function statSummary(xs: number[]): StatSummary {
  if (xs.length === 0) return { mean: 0, std: 0 };
  const sorted = [...xs].sort((a, b) => a - b);
  const m = mean(xs);
  const s = std(xs);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median =
    sorted.length % 2 === 1
      ? sorted[(sorted.length - 1) / 2]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

  const pick = (p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))))];

  return {
    mean: Number(m.toFixed(2)),
    std: Number(s.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    median: Number(median.toFixed(2)),
    p90: Number(pick(0.9).toFixed(2)),
    p95: Number(pick(0.95).toFixed(2)),
  };
}

function confidenceFromCoverage(coverageAvg: number, sampleDays: number): ConfidenceLevel {
  // Coverage dominates, sampleDays is a secondary penalty
  const adjusted = coverageAvg - (sampleDays < 7 ? 15 : sampleDays < 14 ? 8 : 0);
  if (adjusted >= 75) return "גבוהה";
  if (adjusted >= 45) return "בינונית";
  return "נמוכה";
}

function bandFromScore(score: number): DisciplineBand {
  if (score >= 85) return "מצוין";
  if (score >= 70) return "טוב";
  if (score >= 50) return "בינוני";
  return "נמוך";
}

function severityFromBand(band: DisciplineBand): Severity {
  if (band === "מצוין") return "success";
  if (band === "טוב") return "success";
  if (band === "בינוני") return "warning";
  return "critical";
}

function parseBestDate(day: DailyState, index: number): ISODate {
  // Prefer ISO date sources
  const iso =
    day.weight?.date ||
    day.meals?.[0]?.date ||
    day.workouts?.[0]?.date ||
    // fallback - still return ISODate typed (best effort)
    new Date(Date.now() - (Math.max(0, 999 - index) * 86400000)).toISOString().slice(0, 10);

  return iso.slice(0, 10) as ISODate;
}

function toRisk(level: "low" | "mid" | "high" | "critical"): { level: FatigueRisk; severity: Severity } {
  switch (level) {
    case "low":
      return { level: "נמוך", severity: "success" };
    case "mid":
      return { level: "בינוני", severity: "warning" };
    case "high":
      return { level: "גבוה", severity: "warning" };
    case "critical":
      return { level: "קריטי", severity: "critical" };
  }
}

export const useDailyAnalytics = (clientId: string, range: { startDate: string; endDate: string }, dailyStates?: DailyState[]) => {
  return useMemo<CoachAnalytics | null>(() => {
    if (!dailyStates || dailyStates.length === 0) return null;

    const totalDays = dailyStates.length;

    // -----------------------------
    // Coverage
    // -----------------------------
    let daysWithNutrition = 0;
    let daysWithWorkouts = 0;
    let daysWithSleep = 0;
    let daysWithSteps = 0;
    let daysWithWeight = 0;
    let daysWithHydration = 0;

    // -----------------------------
    // Discipline & Streaks
    // -----------------------------
    let loggedDays = 0;
    let adherenceDays = 0;
    let workoutDays = 0;

    let runningLoggingStreak = 0;
    let maxLoggingStreak = 0;
    let runningComplianceStreak = 0;
    let maxComplianceStreak = 0;

    // -----------------------------
    // Nutrition arrays for stats
    // -----------------------------
    const caloriesArr: number[] = [];
    const proteinArr: number[] = [];
    const carbsArr: number[] = [];
    const fatArr: number[] = [];

    // -----------------------------
    // Calorie Behavior (delta)
    // -----------------------------
    const timeline: { date: ISODate; dayType?: DayType; deltaKcal: number }[] = [];
    const trainingDeltas: number[] = [];
    const restDeltas: number[] = [];
    const allDeltas: number[] = [];
    let bingeDays = 0;
    let underEatDays = 0;
    let precisionDays = 0;

    // -----------------------------
    // Recovery
    // -----------------------------
    const effortDistribution: Record<EffortLevel, number> = { EASY: 0, NORMAL: 0, HARD: 0, FAILED: 0, SKIPPED: 0 };
    let consecutiveHardDays = 0;
    let maxConsecutiveHardDays = 0;
    let failedOrSkippedCount = 0;
    let lowSleepDays = 0;

    // -----------------------------
    // Strength
    // -----------------------------
    const byExercise: Record<
      string,
      {
        history: { date: ISODate; topSetKg: number }[];
      }
    > = {};

    // -----------------------------
    // Body metrics
    // -----------------------------
    const weightTrend: { date: ISODate; kg: number }[] = [];
    const stepsArr: number[] = [];
    const sleepArr: number[] = [];
    const waterArr: number[] = [];

    // -----------------------------
    // Correlations raw
    // -----------------------------
    // Sleep group → effort quality
    let lowSleepHardOrFail = 0;
    let lowSleepWorkouts = 0;
    let highSleepHardOrFail = 0;
    let highSleepWorkouts = 0;

    // -----------------------------
    // Main loop
    // -----------------------------
    for (let i = 0; i < dailyStates.length; i++) {
      const day = dailyStates[i];
      const date = parseBestDate(day, i);

      const hasNutrition = (day.meals?.length || 0) > 0 || day.consumedCalories > 0;
      const hasWorkouts = (day.workouts?.length || 0) > 0;
      const hasMetrics = !!day.metrics;
      const hasSleep = !!day.metrics?.sleepHours;
      const hasSteps = day.metrics?.steps != null;
      const hasWater = day.metrics?.waterLiters != null;
      const hasWeight = !!day.weight;

      if (hasNutrition) daysWithNutrition++;
      if (hasWorkouts) daysWithWorkouts++;
      if (hasSleep) daysWithSleep++;
      if (hasSteps) daysWithSteps++;
      if (hasWeight) daysWithWeight++;
      if (hasWater) daysWithHydration++;

      // Logged day definition (coach view)
      const isLogged = hasNutrition || hasWorkouts || hasMetrics || hasWeight;

      if (isLogged) {
        loggedDays++;
        runningLoggingStreak++;
        maxLoggingStreak = Math.max(maxLoggingStreak, runningLoggingStreak);
      } else {
        runningLoggingStreak = 0;
      }

      if (hasWorkouts) workoutDays++;

      // Nutrition totals per day
      let p = 0,
        c = 0,
        f = 0;
      for (const meal of day.meals || []) {
        p += meal.protein || 0;
        c += meal.carbs || 0;
        f += meal.fat || 0;
      }
      caloriesArr.push(day.consumedCalories || 0);
      proteinArr.push(p);
      carbsArr.push(c);
      fatArr.push(f);

      // Targets & delta engine
      const target =
        day.dayType === "TRAINING" ? day.calorieTargets?.trainingDay : day.dayType === "REST" ? day.calorieTargets?.restDay : null;

      if (target != null) {
        const delta = (day.consumedCalories || 0) - target;
        timeline.push({ date, dayType: day.dayType ?? undefined, deltaKcal: delta });
        allDeltas.push(delta);

        if (day.dayType === "TRAINING") trainingDeltas.push(delta);
        if (day.dayType === "REST") restDeltas.push(delta);

        if (delta > 500) bingeDays++;
        if (delta < -500) underEatDays++;
        if (Math.abs(delta) < 100) precisionDays++;

        const isCompliant = Math.abs(delta) <= 120; // tolerance policy (improve later: based on %)
        if (isCompliant) {
          adherenceDays++;
          runningComplianceStreak++;
          maxComplianceStreak = Math.max(maxComplianceStreak, runningComplianceStreak);
        } else {
          runningComplianceStreak = 0;
        }
      }

      // Recovery: effort distribution, consecutive hard days, failed/skipped
      let dayHasHard = false;
      for (const w of day.workouts || []) {
        effortDistribution[w.effortLevel]++;
        if (w.effortLevel === "HARD") dayHasHard = true;
        if (w.effortLevel === "FAILED" || w.effortLevel === "SKIPPED") failedOrSkippedCount++;

        // Correlation buckets
        const sh = day.metrics?.sleepHours;
        if (sh != null) {
          const hardOrFail = w.effortLevel === "HARD" || w.effortLevel === "FAILED";
          if (sh < LOW_SLEEP_HOURS) {
            lowSleepWorkouts++;
            if (hardOrFail) lowSleepHardOrFail++;
          } else {
            highSleepWorkouts++;
            if (hardOrFail) highSleepHardOrFail++;
          }
        }

        // Strength: per exercise, take top set weight
        for (const ex of w.exercises || []) {
          if (ex.weight == null) continue;
          const name = ex.exerciseName;
          if (!byExercise[name]) byExercise[name] = { history: [] };
          byExercise[name].history.push({ date: (w.date?.slice(0, 10) as ISODate) ?? date, topSetKg: ex.weight });
        }
      }

      if (day.metrics?.sleepHours != null && day.metrics.sleepHours < LOW_SLEEP_HOURS) lowSleepDays++;

      if (dayHasHard) {
        consecutiveHardDays++;
        maxConsecutiveHardDays = Math.max(maxConsecutiveHardDays, consecutiveHardDays);
      } else {
        consecutiveHardDays = 0;
      }

      // Body
      if (day.weight) weightTrend.push({ date, kg: day.weight.weightKg });
      if (day.metrics?.steps != null) stepsArr.push(day.metrics.steps);
      if (day.metrics?.sleepHours != null) sleepArr.push(day.metrics.sleepHours);
      if (day.metrics?.waterLiters != null) waterArr.push(day.metrics.waterLiters);
    }

    // -----------------------------
    // Coverage summary
    // -----------------------------
    const coverage = {
      nutrition: clampPercent((daysWithNutrition / totalDays) * 100),
      workouts: clampPercent((daysWithWorkouts / totalDays) * 100),
      sleep: clampPercent((daysWithSleep / totalDays) * 100),
      steps: clampPercent((daysWithSteps / totalDays) * 100),
      weight: clampPercent((daysWithWeight / totalDays) * 100),
      hydration: clampPercent((daysWithHydration / totalDays) * 100),
      confidence: "נמוכה" as ConfidenceLevel,
      notes: [] as string[],
    };

    const coverageAvg = mean([coverage.nutrition, coverage.workouts, coverage.sleep, coverage.steps, coverage.weight]);
    coverage.confidence = confidenceFromCoverage(coverageAvg, totalDays);
    if (coverage.confidence !== "גבוהה") {
      coverage.notes.push("חלק מהתובנות פחות חדות בגלל חוסר נתונים עקבי בתקופה.");
    }

    // -----------------------------
    // Discipline KPI
    // -----------------------------
    const loggingRate = clampPercent((loggedDays / totalDays) * 100);
    const adherenceRate = clampPercent((adherenceDays / totalDays) * 100);
    const workoutConsistency = clampPercent((workoutDays / totalDays) * 100);

    // Weighting: nutrition/logging dominates, workouts secondary
    const score = Math.round(loggingRate * 0.4 + adherenceRate * 0.4 + workoutConsistency * 0.2);
    const band = bandFromScore(score);

    const biggestLevers: CoachAnalytics["discipline"]["biggestLevers"] = [];
    if (loggingRate < 75) biggestLevers.push({ label: "חסרים ימי רישום", impact: "גבוה", hint: "להציב מינימום 5/7 ימי רישום בשבוע" });
    if (adherenceRate < 60) biggestLevers.push({ label: "סטייה מהיעד גבוהה", impact: "בינוני", hint: "לבנות תכנית התמודדות לסופ״ש/אכילה רגשית" });
    if (workoutConsistency < 40) biggestLevers.push({ label: "עקביות אימונים נמוכה", impact: "בינוני", hint: "לעבור ל-2 אימונים קבועים + בונוס אופציונלי" });

    const discipline: CoachAnalytics["discipline"] = {
      score,
      band,
      statusText:
        band === "מצוין"
          ? "עקביות מעולה"
          : band === "טוב"
          ? "עקביות טובה"
          : band === "בינוני"
          ? "צריך לייצב עקביות"
          : "יש פער רציני בעקביות",
      breakdown: {
        loggingRate: Math.round(loggingRate),
        adherenceRate: Math.round(adherenceRate),
        workoutConsistency: Math.round(workoutConsistency),
      },
      biggestLevers: biggestLevers.length ? biggestLevers : [{ label: "הכל נראה יציב", impact: "נמוך" }],
      confidence: coverage.confidence,
    };

    // -----------------------------
    // Nutrition
    // -----------------------------
    const nutrition: CoachAnalytics["nutrition"] = {
      dailyAverages: {
        caloriesKcal: Math.round(mean(caloriesArr)),
        proteinG: Math.round(mean(proteinArr)),
        carbsG: Math.round(mean(carbsArr)),
        fatG: Math.round(mean(fatArr)),
      },
      variability: {
        caloriesKcal: statSummary(caloriesArr),
        proteinG: statSummary(proteinArr),
        carbsG: statSummary(carbsArr),
        fatG: statSummary(fatArr),
      },
      adherence: {
        calories: {
          withinTargetDays: adherenceDays,
          totalLoggedDays: totalDays,
          rate: Math.round(adherenceRate),
          statusText: adherenceRate >= 75 ? "עמידה טובה" : adherenceRate >= 55 ? "בינוני" : "לא יציב",
          tolerance: { type: "absolute", value: 120 },
        },
      },
      confidence: coverage.confidence,
    };

    // -----------------------------
    // Calorie Behavior
    // -----------------------------
    const deltaStd = std(allDeltas);
    const volatilityLabel = deltaStd < 180 ? "יציב" : deltaStd < 320 ? "בינוני" : "תנודתי";

    const calorieBehavior: CoachAnalytics["calorieBehavior"] = {
      deltaStats: {
        overall: statSummary(allDeltas),
        trainingDays: statSummary(trainingDeltas),
        restDays: statSummary(restDeltas),
      },
      patterns: {
        bingeDays,
        underEatDays,
        precisionDays,
        volatilityLabel,
      },
      timeline,
      last7: timeline.slice(-7),
      confidence: coverage.confidence,
    };

    // -----------------------------
    // Streaks
    // -----------------------------
    const streaks: CoachAnalytics["streaks"] = {
      nutritionStreak: {
        currentDays: runningComplianceStreak,
        maxDays: maxComplianceStreak,
        quality: adherenceRate >= 75 ? "חזק" : adherenceRate >= 55 ? "בינוני" : "חלש",
      },
      loggingStreak: {
        currentDays: runningLoggingStreak,
        maxDays: maxLoggingStreak,
        completenessRate: Math.round(loggingRate),
      },
      confidence: coverage.confidence,
    };

    // -----------------------------
    // Recovery risk
    // -----------------------------
    const totalWorkouts = Object.values(effortDistribution).reduce((a, b) => a + b, 0);
    const hard = effortDistribution.HARD;
    const failed = effortDistribution.FAILED;
    const hardOrFailedRate = totalWorkouts ? ((hard + failed) / totalWorkouts) * 100 : 0;

    let riskLevel: "low" | "mid" | "high" | "critical" = "low";
    if (maxConsecutiveHardDays >= 4) riskLevel = "critical";
    else if (maxConsecutiveHardDays >= 3 || hardOrFailedRate >= 45) riskLevel = "high";
    else if (hardOrFailedRate >= 30 || lowSleepDays >= 3) riskLevel = "mid";

    const risk = toRisk(riskLevel);

    const recovery: CoachAnalytics["recovery"] = {
      effortDistribution,
      risk: {
        level: risk.level,
        severity: risk.severity,
        title:
          risk.level === "קריטי"
            ? "סיכון עומס קריטי"
            : risk.level === "גבוה"
            ? "סיכון עייפות גבוה"
            : risk.level === "בינוני"
            ? "שווה לשים לב להתאוששות"
            : "התאוששות טובה",
        explanation:
          risk.level === "נמוך"
            ? "עצימות מחולקת טוב ואין סימני עומס חריגים."
            : `רצף ימים קשים: ${maxConsecutiveHardDays} | אימונים קשים/כושלים: ${Math.round(hardOrFailedRate)}% | ימים עם שינה נמוכה: ${lowSleepDays}`,
      },
      signals: {
        consecutiveHardDays: maxConsecutiveHardDays,
        failedOrSkippedCount,
        lowSleepDays,
      },
      recommendedActions:
        risk.level === "נמוך"
          ? [{ label: "להמשיך באותה מתכונת", details: "לשמור איזון עצימות ולהקפיד על שינה." }]
          : risk.level === "בינוני"
          ? [
              { label: "להוריד עומס קל", details: "להוריד נפח 10–20% לשבוע הקרוב." },
              { label: "לחזק שינה", details: "מינימום יעד 7 שעות ב־3 לילות השבוע." },
            ]
          : risk.level === "גבוה"
          ? [
              { label: "דלואד שבוע", details: "להוריד נפח 20–30% ולהימנע מרצף HARD." },
              { label: "לנעול ימי מנוחה", details: "להבטיח לפחות 2 ימי REST." },
            ]
          : [
              { label: "עצירה/איפוס עומס", details: "3–5 ימים הורדת עצימות משמעותית + בדיקת שינה/תזונה." },
              { label: "לבדוק סימני שחיקה", details: "אם יש כאבים/ירידה בביצועים — לשנות תכנית." },
            ],
      confidence: coverage.confidence,
    };

    // -----------------------------
    // Correlations (simple, coach-friendly)
    // -----------------------------
    const lowRate = lowSleepWorkouts ? (lowSleepHardOrFail / lowSleepWorkouts) * 100 : 0;
    const highRate = highSleepWorkouts ? (highSleepHardOrFail / highSleepWorkouts) * 100 : 0;
    const delta = lowRate - highRate;

    const direction: CorrelationDirection =
      lowSleepWorkouts >= 3 && highSleepWorkouts >= 3 ? (delta > 8 ? "שלילי" : delta < -8 ? "חיובי" : "לא ברור") : "לא ברור";

    const corrItems: HabitCorrelationItem[] = [
      {
        id: "sleep-effort",
        icon: "😴",
        title: "שינה מול איכות אימון",
        subtitle: `מתחת ל-${LOW_SLEEP_HOURS} שעות`,
        direction,
        effect: {
          summary:
            lowSleepWorkouts < 3 || highSleepWorkouts < 3
              ? "אין מספיק דגימות כדי להסיק מסקנה חזקה."
              : `בימים עם שינה נמוכה יש ${Math.round(Math.abs(delta))}% ${
                  delta > 0 ? "יותר" : "פחות"
                } אימונים קשים/כושלים.`,
          deltaPercent: Number(delta.toFixed(1)),
        },
        sampleSize: lowSleepWorkouts + highSleepWorkouts,
        confidence: coverage.sleep >= 60 ? "בינונית" : "נמוכה",
      },
    ];

    const correlations: CoachAnalytics["correlations"] = {
      items: corrItems,
      confidence: coverage.sleep >= 60 ? "בינונית" : "נמוכה",
    };

    // -----------------------------
    // Strength cards (array for UI)
    // -----------------------------
    const days = totalDays;
    const weeks = Math.max(1, days / 7);

    const strengthCards = Object.entries(byExercise)
      .map(([name, v]) => {
        const history = v.history.sort((a, b) => (a.date > b.date ? 1 : -1));
        const freq = history.length;

        const maxWeightKg = history.reduce((m, x) => Math.max(m, x.topSetKg), 0);

        // Improvement: last - first (simple, stable)
        const first = history[0]?.topSetKg ?? 0;
        const last = history[history.length - 1]?.topSetKg ?? 0;
        const improvementKg = Number((last - first).toFixed(1));

        const statusText =
          freq < 2
            ? "לא מספיק דגימות"
            : improvementKg >= 2
            ? "שיפור יפה"
            : improvementKg <= -2
            ? "ירידה בביצוע"
            : "תקוע";

        return {
          name,
          frequency: freq,
          frequencyPerWeek: Number((freq / weeks).toFixed(1)),
          maxWeightKg: Number(maxWeightKg.toFixed(1)),
          improvementKg,
          statusText,
          trend: history.slice(-6).map((x) => ({ date: x.date, topSetKg: x.topSetKg })),
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    const strength: CoachAnalytics["strength"] = {
      exercises: strengthCards,
      overallIndex: strengthCards.length
        ? {
            value: Math.round(mean(strengthCards.map((x) => x.improvementKg))),
            trend: mean(strengthCards.map((x) => x.improvementKg)) > 1 ? "עולה" : mean(strengthCards.map((x) => x.improvementKg)) < -1 ? "יורד" : "יציב",
            summary: "מדד מגמה כללי (אינדיקציה בלבד)",
          }
        : undefined,
      confidence: strengthCards.length >= 3 ? "בינונית" : "נמוכה",
    };

    // -----------------------------
    // Body + habits
    // -----------------------------
    const avgSteps = Math.round(mean(stepsArr));
    const avgSleep = Number(mean(sleepArr).toFixed(1));
    const weightChange =
      weightTrend.length >= 2 ? Number((weightTrend[weightTrend.length - 1].kg - weightTrend[0].kg).toFixed(2)) : 0;

    const body: CoachAnalytics["body"] = {
      goal: DEFAULT_GOAL,
      steps: { avg: avgSteps, stats: statSummary(stepsArr) },
      sleep: { avgHours: avgSleep, stats: statSummary(sleepArr) },
      weight: {
        changeKg: weightChange,
        startKg: weightTrend[0]?.kg,
        endKg: weightTrend[weightTrend.length - 1]?.kg,
        statusText: weightChange < -0.5 ? "ירידה" : weightChange > 0.5 ? "עלייה" : "יציב",
      },
      confidence: coverage.weight >= 50 ? "בינונית" : "נמוכה",
    };

    // -----------------------------
    // Headline (coach story)
    // -----------------------------
    const headlineSeverity =
      recovery.risk.severity === "critical" ? "critical" : discipline.band === "נמוך" ? "critical" : discipline.band === "בינוני" ? "warning" : "success";

    const headlineTitle =
      headlineSeverity === "critical"
        ? "נדרש תיקון מסלול"
        : headlineSeverity === "warning"
        ? "יש נקודות לשיפור"
        : "התקדמות יציבה";

    const headlineSummary = `עקביות: ${discipline.band} | דלתא: ${calorieBehavior.patterns.volatilityLabel} | התאוששות: ${recovery.risk.level}`;

    const overallConfidence = confidenceFromCoverage(coverageAvg, totalDays);

    // -----------------------------
    // Insights (actionable)
    // -----------------------------
    const insights: CoachAnalytics["insights"] = [];

    if (discipline.score >= 85) {
      insights.push({
        id: "ins-consistency",
        severity: "success",
        title: "עקביות מצוינת",
        explanation: "הלקוח עומד יפה ברישום ובמסגרת הכללית.",
        actions: [{ label: "לשמור על אותו מבנה", details: "אפשר להעלות עומס/דיוק בהדרגה." }],
        confidence: overallConfidence,
      });
    }

    if (calorieBehavior.patterns.bingeDays >= 2) {
      insights.push({
        id: "ins-binge",
        severity: "warning",
        title: "חריגות קלוריות חוזרות",
        explanation: "נראה שיש ימים עם חריגה משמעותית מעל היעד.",
        actions: [
          { label: "אסטרטגיית סופ״ש", details: "לבנות מראש ארוחה גמישה + חלבון גבוה." },
          { label: "לזהות טריגר", details: "רעב? סטרס? חוסר שינה? להתאים פתרון." },
        ],
        evidence: [{ label: "ימי חריגה", value: String(calorieBehavior.patterns.bingeDays) }],
        confidence: overallConfidence,
      });
    }

    if (avgSleep > 0 && avgSleep < LOW_SLEEP_HOURS) {
      insights.push({
        id: "ins-sleep",
        severity: "warning",
        title: "שינה נמוכה פוגעת בביצועים",
        explanation: `ממוצע שינה ${avgSleep} שעות.`,
        actions: [{ label: "יעד שינה", details: "לכוון ל-7+ שעות לפחות 3–4 לילות בשבוע." }],
        confidence: coverage.sleep >= 60 ? "בינונית" : "נמוכה",
      });
    }

    // Keep only top 3 by severity priority
    const priority = (s: Severity) => (s === "critical" ? 3 : s === "warning" ? 2 : s === "success" ? 1 : 0);
    insights.sort((a, b) => priority(b.severity) - priority(a.severity));

    const analytics: CoachAnalytics = {
      version: "1.0",
      locale: "he-IL",
      clientId,
      period: {
        startDate: range.startDate.slice(0, 10) as ISODate,
        endDate: range.endDate.slice(0, 10) as ISODate,
        days: totalDays,
      },
      generatedAt: new Date().toISOString(),
      overallConfidence,
      coverage: {
        ...coverage,
        notes: coverage.notes.length ? coverage.notes : undefined,
      },
      headline: {
        severity: headlineSeverity,
        title: headlineTitle,
        summary: headlineSummary,
        quickActions: [
          ...(discipline.band === "בינוני" || discipline.band === "נמוך"
            ? [{ label: "לחזק רישום", reason: "זה הבסיס לכל דיוק" }]
            : []),
          ...(recovery.risk.level === "גבוה" || recovery.risk.level === "קריטי"
            ? [{ label: "להוריד עומס", reason: "ההתאוששות כרגע צוואר בקבוק" }]
            : []),
          ...(calorieBehavior.patterns.volatilityLabel === "תנודתי"
            ? [{ label: "לייצב קלוריות", reason: "תנודתיות הורסת התקדמות" }]
            : []),
        ],
        confidence: overallConfidence,
      },
      discipline,
      nutrition,
      calorieBehavior,
      streaks,
      recovery,
      correlations,
      strength,
      body,
      insights: insights.slice(0, 3),
    };

    return analytics;
  }, [clientId, range.startDate, range.endDate, dailyStates]);
};
