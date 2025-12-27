/**
 * Coach Analytics UI Types (Source of Truth)
 * ==========================================
//////////////////////////////
// Primitives
//////////////////////////////

/** ISO date without time: 2025-12-27 */
export type ISODate = `${number}-${number}-${number}`;

/** Percentage 0..100 (UI) */
export type Percent = number;

/** Generic confidence level for any derived metric/insight */
export type ConfidenceLevel = "גבוהה" | "בינונית" | "נמוכה";

/** Severity for insights / alerts */
export type Severity = "info" | "success" | "warning" | "critical";

/** Training vs Rest day */
export type DayType = "TRAINING" | "REST";

/** Effort levels as logged by client/coach */
export type EffortLevel = "EASY" | "NORMAL" | "HARD" | "FAILED" | "SKIPPED";

export interface DateRange {
  startDate: ISODate;
  endDate: ISODate;
  /** inclusive days count in range */
  days: number;
}

export interface StatSummary {
  /** average (mean) */
  mean: number;
  /** standard deviation (volatility / consistency) */
  std?: number;
  /** min in range */
  min?: number;
  /** max in range */
  max?: number;
  /** median */
  median?: number;
  /** p90 / p95 can be used for outlier detection */
  p90?: number;
  p95?: number;
}

/** Data coverage is crucial: coach must know if insights are trustworthy */
export interface DataCoverage {
  /** % days with any nutrition log */
  nutrition: Percent;
  /** % days with workout log */
  workouts: Percent;
  /** % days with sleep metric present */
  sleep: Percent;
  /** % days with steps metric present */
  steps: Percent;
  /** % days with weight log present */
  weight: Percent;
  /** optional hydration */
  hydration?: Percent;

  confidence: ConfidenceLevel;
  notes?: string[];
}

//////////////////////////////
// Top-Level Root Type
//////////////////////////////

export interface CoachAnalytics {
  version: "1.0";
  locale: "he-IL";

  clientId: string;
  period: DateRange;

  /** when analytics was computed */
  generatedAt: string; // ISO datetime

  /** overall confidence derived from DataCoverage + sample sizes */
  overallConfidence: ConfidenceLevel;

  coverage: DataCoverage;

  /** Top “story” for the coach — 10 second overview */
  headline: CoachHeadline;

  /** Core KPI */
  discipline: DisciplineAnalytics;

  /** Nutrition over period */
  nutrition: NutritionAnalytics;

  /** Behavioral nutrition stability (delta engine) */
  calorieBehavior: CalorieBehaviorAnalytics;

  /** Momentum / streaks */
  streaks: StreaksAnalytics;

  /** Recovery / burnout risk */
  recovery: RecoveryAnalytics;

  /** Correlations: habits → performance */
  correlations: HabitCorrelationsAnalytics;

  /** Strength progression */
  strength: StrengthAnalytics;

  /** Body + habits summary */
  body: BodyHabitsAnalytics;

  /** AI insights: actionable bullets */
  insights: CoachInsight[];
}

//////////////////////////////
// Headline
//////////////////////////////

export interface CoachHeadline {
  severity: Severity;

  title: string;

  /** short explanation for coach */
  summary: string;

  /** 1-2 immediate actions coach can take */
  quickActions: Array<{
    label: string;
    reason?: string;
  }>;

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Discipline (KPI)
//////////////////////////////

export type DisciplineBand = "נמוך" | "בינוני" | "טוב" | "מצוין";

export interface DisciplineAnalytics {
  score: Percent; // 0..100
  band: DisciplineBand;

  /** dynamic status string based on score + coverage */
  statusText: string;

  /** components behind the score (transparent to coach) */
  breakdown: {
    loggingRate: Percent; // % days with nutrition logs
    adherenceRate: Percent; // % days within target threshold
    workoutConsistency?: Percent; // optional
  };

  /** coach-friendly: what’s holding score back the most */
  biggestLevers: Array<{
    label: string;
    impact: "גבוה" | "בינוני" | "נמוך";
    hint?: string; 
  }>;

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Nutrition
//////////////////////////////

export interface NutritionAnalytics {
  dailyAverages: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };

  variability: {
    caloriesKcal: StatSummary;
    proteinG: StatSummary;
    carbsG: StatSummary;
    fatG: StatSummary;
  };

  /** adherence vs targets (if targets known) */
  adherence?: {
    calories: AdherenceMetric;
    protein?: AdherenceMetric;
    carbs?: AdherenceMetric;
    fat?: AdherenceMetric;
  };

  confidence: ConfidenceLevel;
}

export interface AdherenceMetric {
  withinTargetDays: number;
  totalLoggedDays: number;
  rate: Percent;
  statusText: string;

  /**
   * Tolerance policy used for adherence (transparent):
   * e.g., ±8% or ±120kcal
   */
  tolerance: {
    type: "relative_percent" | "absolute";
    value: number;
  };
}

//////////////////////////////
// Calorie Behavior (Delta Engine)
//////////////////////////////

export interface CalorieBehaviorAnalytics {
  /**
   * Delta = consumed - target
   * positive => over target
   * negative => under target
   */
  deltaStats: {
    overall: StatSummary;
    trainingDays?: StatSummary;
    restDays?: StatSummary;
  };

  /** behavior classification */
  patterns: {
    bingeDays: number; // large over-target
    underEatDays: number; // large under-target
    precisionDays: number; // close to target
    volatilityLabel: "יציב" | "בינוני" | "תנודתי";
  };

  /** UI chart data (already clipped/scaled by your renderer if needed) */
  timeline: Array<{
    date: ISODate;
    dayType?: DayType;
    deltaKcal: number;
  }>;

  /** last 7 entries for mini chart */
  last7: Array<{
    date: ISODate;
    dayType?: DayType;
    deltaKcal: number;
  }>;

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Streaks
//////////////////////////////

export interface StreaksAnalytics {
  nutritionStreak: {
    currentDays: number;
    maxDays: number;
    /** quality, not just quantity */
    quality: "חלש" | "בינוני" | "חזק";
  };

  loggingStreak: {
    currentDays: number;
    maxDays: number;
    /** % completeness across days in streak */
    completenessRate?: Percent;
  };

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Recovery / Burnout
//////////////////////////////

export type FatigueRisk = "נמוך" | "בינוני" | "גבוה" | "קריטי";

export interface RecoveryAnalytics {
  effortDistribution: Record<EffortLevel, number>;

  risk: {
    level: FatigueRisk;
    severity: Severity; // aligns with UI colors
    title: string;
    explanation: string;
  };

  /** consecutive hard days, failed sessions, etc. */
  signals: {
    consecutiveHardDays: number;
    failedOrSkippedCount: number;
    lowSleepDays?: number;
  };

  recommendedActions: Array<{
    label: string; 
    details?: string; 
  }>;

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Correlations (Habits → Performance)
//////////////////////////////

export type CorrelationDirection = "חיובי" | "שלילי" | "לא ברור";

export interface HabitCorrelationsAnalytics {
  items: HabitCorrelationItem[];
  confidence: ConfidenceLevel;
}

export interface HabitCorrelationItem {
  id: string;

  icon: string;
  title: string; 
  subtitle?: string; 

  direction: CorrelationDirection;

  /** simple effect size, UI-friendly */
  effect: {
    summary: string;
    /** numeric for future charts */
    deltaPercent?: number;
  };

  sampleSize: number; // logs included

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Strength Progression
//////////////////////////////

export interface StrengthAnalytics {
  /** key exercises (top N) */
  exercises: StrengthExerciseCard[];

  /** optional: overall strength trend index */
  overallIndex?: {
    value: number;
    trend: "עולה" | "יציב" | "יורד";
    summary: string;
  };

  confidence: ConfidenceLevel;
}

export interface StrengthExerciseCard {
  exerciseId?: string;
  name: string;

  /** frequency in selected period */
  frequency: number;
  /** optional normalized weekly */
  frequencyPerWeek?: number;

  /** best in range */
  maxWeightKg?: number;

  /**
   * Improvement compared to previous period or first half vs second half
   * Positive => improvement
   */
  improvementKg: number;

  statusText: string;

  /** optional micro trend, last 3-6 entries */
  trend?: Array<{
    date: ISODate;
    topSetKg?: number;
    volume?: number;
  }>;
}

//////////////////////////////
// Body & Habits Summary
//////////////////////////////

export type GoalType = "CUT" | "MAINTAIN" | "BULK" | "UNKNOWN";

export interface BodyHabitsAnalytics {
  goal: GoalType;

  steps: {
    avg: number;
    stats?: StatSummary;
  };

  sleep: {
    avgHours: number;
    stats?: StatSummary;
  };

  weight: {
    /** positive => up, negative => down */
    changeKg: number;
    /** optional: start/end */
    startKg?: number;
    endKg?: number;
    statusText: string;
  };

  confidence: ConfidenceLevel;
}

//////////////////////////////
// AI Insights
//////////////////////////////

export interface CoachInsight {
  id: string;

  severity: Severity;

  /** short label */
  title: string;

  /** 1-2 lines */
  explanation: string;

  /** what coach should do */
  actions: Array<{
    label: string; 
    details?: string;
  }>;

  /** optional evidence references (UI can show "למה" tooltip) */
  evidence?: Array<{
    label: string; 
    value: string; 
  }>;

  confidence: ConfidenceLevel;
}

//////////////////////////////
// Utility Types (optional)
//////////////////////////////

/** Generic helper for UI sections to show loading/empty states safely */
export type WithMeta<T> = T & {
  isEmpty?: boolean;
  emptyReason?: string;
};
