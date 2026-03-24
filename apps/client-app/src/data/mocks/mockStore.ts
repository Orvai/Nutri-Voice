import type { AssistantStateDto } from "@/types/assistant/assistant.dto";
import type { AuthUserDto } from "@/types/auth/auth.dto";
import type { CommunityStateDto } from "@/types/community/community.dto";
import type { HomeCoachTipDto } from "@/types/home/home.dto";
import type {
  NutritionDayTypeDto,
  NutritionPlanDto,
  NutritionProductDto
} from "@/types/nutrition/nutrition.dto";
import type {
  ActiveWorkoutSessionDto,
  WorkoutProgramDto,
  WorkoutSummaryDto
} from "@/types/workout/workout.dto";

export type MockDomain =
  | "auth"
  | "home"
  | "nutrition"
  | "workout"
  | "community"
  | "assistant";

type MockState = {
  auth: {
    users: AuthUserDto[];
    passwordsByEmail: Record<string, string>;
    resetRequests: string[];
  };
  home: {
    coachTip: HomeCoachTipDto;
    steps: number;
  };
  nutrition: {
    selectedDayType: NutritionDayTypeDto;
    plans: Record<NutritionDayTypeDto, NutritionPlanDto>;
  };
  workout: {
    programs: WorkoutProgramDto[];
    activeSessions: Record<string, ActiveWorkoutSessionDto | undefined>;
    summaries: Record<string, WorkoutSummaryDto | undefined>;
  };
  community: CommunityStateDto;
  assistant: AssistantStateDto;
  failures: Partial<Record<MockDomain, string>>;
};

const createProduct = (
  id: string,
  name: string,
  caloriesPer100g: number,
  proteinPer100g: number,
  carbsPer100g: number,
  fatPer100g: number
): NutritionProductDto => ({
  id,
  name,
  caloriesPer100g,
  proteinPer100g,
  carbsPer100g,
  fatPer100g
});

const trainingMeals: NutritionPlanDto["meals"] = [
  {
    id: "breakfast",
    name: "ארוחת בוקר",
    icon: "sunny-outline",
    targetCalories: 550,
    options: [
      createProduct("oats", "שיבולת שועל", 389, 16, 66, 7),
      createProduct("yogurt", "יוגורט חלבון", 88, 10, 6, 3),
      createProduct("banana", "בננה", 89, 1, 23, 0)
    ],
    logged: {
      productId: "oats",
      grams: 80,
      loggedAtIso: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    }
  },
  {
    id: "lunch",
    name: "ארוחת צהריים",
    icon: "restaurant-outline",
    targetCalories: 800,
    options: [
      createProduct("chicken", "חזה עוף", 165, 31, 0, 4),
      createProduct("rice", "אורז בסמטי", 130, 3, 28, 0),
      createProduct("salad", "סלט קצוץ", 40, 2, 6, 1)
    ],
    logged: null
  },
  {
    id: "dinner",
    name: "ארוחת ערב",
    icon: "moon-outline",
    targetCalories: 650,
    options: [
      createProduct("salmon", "סלמון", 208, 20, 0, 13),
      createProduct("sweet-potato", "בטטה", 86, 2, 20, 0),
      createProduct("cottage", "קוטג׳ 5%", 98, 11, 3, 5)
    ],
    logged: null
  }
];

const restMeals: NutritionPlanDto["meals"] = [
  {
    id: "breakfast-rest",
    name: "ארוחת בוקר",
    icon: "sunny-outline",
    targetCalories: 450,
    options: [
      createProduct("eggs", "ביצים", 155, 13, 1, 11),
      createProduct("avocado", "אבוקדו", 160, 2, 9, 15),
      createProduct("bread", "לחם מחמצת", 260, 9, 49, 3)
    ],
    logged: null
  },
  {
    id: "lunch-rest",
    name: "ארוחת צהריים",
    icon: "restaurant-outline",
    targetCalories: 700,
    options: [
      createProduct("turkey", "הודו", 150, 29, 0, 3),
      createProduct("quinoa", "קינואה", 120, 4, 21, 2),
      createProduct("broccoli", "ברוקולי", 35, 3, 7, 0)
    ],
    logged: null
  },
  {
    id: "dinner-rest",
    name: "ארוחת ערב",
    icon: "moon-outline",
    targetCalories: 550,
    options: [
      createProduct("tuna", "טונה", 132, 28, 0, 1),
      createProduct("potato", "תפוח אדמה", 77, 2, 17, 0),
      createProduct("labaneh", "לאבנה", 167, 9, 4, 13)
    ],
    logged: null
  }
];

const initialState: MockState = {
  auth: {
    users: [
      {
        id: "client-1",
        email: "alex@nutri.app",
        firstName: "אלכס",
        lastName: "כהן",
        role: "client",
        avatarUrl:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/c2fcca9002-74f58ee8808b4f15b2b0.png"
      }
    ],
    passwordsByEmail: {
      "alex@nutri.app": "12345678"
    },
    resetRequests: []
  },
  home: {
    coachTip: {
      coachName: "מרקוס תורן",
      coachAvatarUrl:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/e557af036d-fe92c8a752bc133ad7b5.png",
      message:
        "עבודה מעולה על יעדי המאקרו אתמול. היום נתמקד בסקוואטים כבדים ונשמור על שתייה קבועה."
    },
    steps: 8432
  },
  nutrition: {
    selectedDayType: "training",
    plans: {
      training: {
        dayType: "training",
        title: "יום העמסה",
        calorieTarget: 2600,
        manualCalories: 180,
        waterMl: 2400,
        meals: trainingMeals
      },
      rest: {
        dayType: "rest",
        title: "יום ללא העמסה",
        calorieTarget: 2200,
        manualCalories: 0,
        waterMl: 2100,
        meals: restMeals
      }
    }
  },
  workout: {
    programs: [
      {
        id: "legs-v2",
        title: "כוח רגליים V.2",
        category: "פלג גוף תחתון",
        durationMinutes: 45,
        intensity: "high",
        isToday: true,
        thumbnailUrl:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/86706798a0-a4304b9be2d15ceb151e.png",
        exercises: [
          {
            id: "back-squat",
            name: "Back Squat",
            sets: 4,
            reps: 6,
            suggestedWeightKg: 80,
            restSeconds: 120
          },
          {
            id: "rdl",
            name: "Romanian Deadlift",
            sets: 3,
            reps: 8,
            suggestedWeightKg: 70,
            restSeconds: 90
          },
          {
            id: "walking-lunge",
            name: "Walking Lunges",
            sets: 3,
            reps: 12,
            suggestedWeightKg: 18,
            restSeconds: 75
          }
        ]
      },
      {
        id: "upper-pump",
        title: "Upper Pump",
        category: "פלג גוף עליון",
        durationMinutes: 40,
        intensity: "medium",
        isToday: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80",
        exercises: [
          {
            id: "bench-press",
            name: "Bench Press",
            sets: 4,
            reps: 8,
            suggestedWeightKg: 60,
            restSeconds: 90
          },
          {
            id: "lat-pulldown",
            name: "Lat Pulldown",
            sets: 4,
            reps: 10,
            suggestedWeightKg: 52,
            restSeconds: 75
          }
        ]
      }
    ],
    activeSessions: {},
    summaries: {}
  },
  community: {
    stories: [
      {
        id: "story-coach",
        authorName: "המאמן מרקוס",
        avatarUrl:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/e557af036d-fe92c8a752bc133ad7b5.png",
        isCoach: true,
        headline: "דגש השבוע: איכות תנועה",
        seen: false
      },
      {
        id: "story-1",
        authorName: "דניאל",
        avatarUrl:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=300&q=80",
        isCoach: false,
        headline: "סיימתי את אימון הרגליים",
        seen: true
      },
      {
        id: "story-2",
        authorName: "מאיה",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
        isCoach: false,
        headline: "עמדתי ביעד המים",
        seen: false
      }
    ],
    posts: [
      {
        id: "post-1",
        authorName: "המאמן מרקוס",
        avatarUrl:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/e557af036d-fe92c8a752bc133ad7b5.png",
        isCoach: true,
        text: "זכרו: עקביות חשובה יותר ממושלמות. אימון קצר עדיף מלא כלום.",
        createdAtIso: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        likes: 19,
        comments: 4
      },
      {
        id: "post-2",
        authorName: "אלכס",
        avatarUrl:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/c2fcca9002-74f58ee8808b4f15b2b0.png",
        isCoach: false,
        text: "היום סיימתי 2.4 ליטר מים, עוד מעט אימון 🫡",
        createdAtIso: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        likes: 7,
        comments: 2
      }
    ]
  },
  assistant: {
    pendingCoachReply: false,
    lastAction: null,
    messages: [
      {
        id: "assistant-init",
        role: "assistant",
        text: "שלום אלכס, אני איתך להיום. רוצה להתחיל אימון או לדווח ארוחה?",
        kind: "suggestion",
        createdAtIso: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      }
    ]
  },
  failures: {}
};

let state: MockState = initialState;

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const getMockState = (): MockState => clone(state);

export const updateMockState = (mutator: (draft: MockState) => void): MockState => {
  const draft = clone(state);
  mutator(draft);
  state = draft;
  return clone(state);
};

export const setMockFailure = (domain: MockDomain, message: string | null): void => {
  updateMockState((draft) => {
    if (!message) {
      delete draft.failures[domain];
      return;
    }
    draft.failures[domain] = message;
  });
};

export const consumeMockFailure = (domain: MockDomain): string | null => {
  const failure = state.failures[domain];
  if (!failure) {
    return null;
  }

  updateMockState((draft) => {
    delete draft.failures[domain];
  });

  return failure;
};
