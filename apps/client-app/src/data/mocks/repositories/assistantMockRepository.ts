import { getMockState, updateMockState } from "@/data/mocks/mockStore";
import { mockRequest } from "@/data/mocks/mockRequest";
import { nutritionTotals } from "@/data/mocks/repositories/nutrition.helpers";
import type {
  AssistantQuickActionDto,
  AssistantStateDto
} from "@/types/assistant/assistant.dto";
import { generateId } from "@/utils/format";

const assistantMessage = (
  text: string,
  kind: "text" | "confirmation" | "suggestion" | "escalation" = "text"
) => ({
  id: generateId("assistant"),
  role: "assistant" as const,
  text,
  kind,
  createdAtIso: new Date().toISOString()
});

const userMessage = (text: string) => ({
  id: generateId("user"),
  role: "user" as const,
  text,
  kind: "text" as const,
  createdAtIso: new Date().toISOString()
});

const remainingCaloriesText = () => {
  const state = getMockState();
  const dayType = state.nutrition.selectedDayType;
  const plan = state.nutrition.plans[dayType];
  const totals = nutritionTotals(plan);
  const remaining = Math.max(0, plan.calorieTarget - totals.calories);
  return `נותרו לך ${remaining} קלוריות להיום (${plan.title}).`;
};

const workoutSuggestionText = () => {
  const state = getMockState();
  const todayWorkout = state.workout.programs.find((program) => program.isToday);

  if (!todayWorkout) {
    return "אין אימון מתוכנן להיום. אפשר לבקש מהמאמן עדכון תוכנית.";
  }

  const hasSummary = Boolean(state.workout.summaries[todayWorkout.id]);
  if (hasSummary) {
    return "האימון של היום כבר דווח. הצעד הבא: דיווח ארוחה ושחזור נוזלים.";
  }

  return `האימון הבא שלך הוא ${todayWorkout.title}. לחץ על 'אימון' כדי להתחיל.`;
};

const append = (draft: AssistantStateDto, ...messages: AssistantStateDto["messages"]) => {
  draft.messages.push(...messages);
  if (draft.messages.length > 80) {
    draft.messages = draft.messages.slice(-80);
  }
};

export async function getAssistantState(): Promise<AssistantStateDto> {
  return mockRequest("assistant", () => getMockState().assistant);
}

export async function sendAssistantMessage(text: string): Promise<AssistantStateDto> {
  return mockRequest("assistant", () => {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error("לא ניתן לשלוח הודעה ריקה");
    }

    updateMockState((draft) => {
      append(draft.assistant, userMessage(trimmed));

      const normalized = trimmed.toLowerCase();

      if (
        normalized.includes("כאב") ||
        normalized.includes("מאמן") ||
        normalized.includes("עזרה")
      ) {
        draft.assistant.pendingCoachReply = true;
        append(
          draft.assistant,
          assistantMessage(
            "העברתי את ההודעה למאמן. תקבל תשובה בהקדם.",
            "escalation"
          )
        );
        return;
      }

      if (normalized.includes("מים")) {
        draft.nutrition.plans.training.waterMl += 250;
        draft.nutrition.plans.rest.waterMl += 250;
        draft.assistant.lastAction = "water";
        append(
          draft.assistant,
          assistantMessage("עודכנו 250 מ״ל מים. עבודה מעולה על ההתמדה.", "confirmation")
        );
        return;
      }

      if (normalized.includes("קלור")) {
        draft.assistant.lastAction = "calories";
        append(draft.assistant, assistantMessage(remainingCaloriesText(), "suggestion"));
        return;
      }

      if (normalized.includes("אימון")) {
        draft.assistant.lastAction = "workout";
        append(draft.assistant, assistantMessage(workoutSuggestionText(), "suggestion"));
        return;
      }

      if (normalized.includes("ארוחה") || normalized.includes("תזונה")) {
        draft.assistant.lastAction = "meal";
        append(
          draft.assistant,
          assistantMessage(
            "מעולה. כדאי לדווח עכשיו את הארוחה הבאה מתוך הרשימה המוגדרת.",
            "suggestion"
          )
        );
        return;
      }

      append(
        draft.assistant,
        assistantMessage(
          "הבנתי. הצעד הבא שאני ממליץ עליו: אימון, מים או דיווח ארוחה. מה נריץ?",
          "suggestion"
        )
      );
    });

    return getMockState().assistant;
  });
}

export async function runAssistantQuickAction(
  action: AssistantQuickActionDto
): Promise<AssistantStateDto> {
  return mockRequest("assistant", () => {
    updateMockState((draft) => {
      draft.assistant.lastAction = action;
      draft.assistant.pendingCoachReply = false;

      switch (action) {
        case "meal":
          append(
            draft.assistant,
            assistantMessage(
              "נפתח לך מסלול דיווח ארוחה. בחר ארוחה, מוצר וכמות.",
              "suggestion"
            )
          );
          break;
        case "workout":
          append(draft.assistant, assistantMessage(workoutSuggestionText(), "suggestion"));
          break;
        case "water":
          draft.nutrition.plans.training.waterMl += 300;
          draft.nutrition.plans.rest.waterMl += 300;
          append(
            draft.assistant,
            assistantMessage("עודכננו 300 מ״ל מים. תמשיך ככה.", "confirmation")
          );
          break;
        case "calories":
          append(draft.assistant, assistantMessage(remainingCaloriesText(), "suggestion"));
          break;
      }
    });

    return getMockState().assistant;
  });
}

export async function escalateAssistantToCoach(
  reason: string
): Promise<AssistantStateDto> {
  return mockRequest("assistant", () => {
    updateMockState((draft) => {
      draft.assistant.pendingCoachReply = true;
      append(
        draft.assistant,
        assistantMessage(`העברתי למאמן: ${reason || "נדרשת התערבות מאמן"}`, "escalation")
      );
    });

    return getMockState().assistant;
  });
}
