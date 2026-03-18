import { PendingActionToolInputDto } from "../../../../dtos/conversationState.dto.js";
import { patchConversationState } from "../../../state/conversationState.store.js";

export const setConversationStateTool = {
  name: "set_conversation_state",
  description:
    "Updates lightweight conversation memory for pending actions and short follow-ups. Use when you ask for confirmation or need to remember context for the next user turn.",
  parameters: {
    type: "object",
    properties: {
      pending_meal_candidate: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          calories: { type: "integer" },
          protein: { type: "integer" },
          carbs: { type: "integer" },
          fat: { type: "integer" },
          dayType: { type: "string", enum: ["TRAINING", "REST"] },
          description: { type: "string" },
          matchedMenuItemId: { type: "string" },
          source: { type: "string", enum: ["MENU_MATCH", "ESTIMATE", "USER_PROVIDED"] },
          confidence: { type: "number" },
          isEstimated: { type: "boolean" },
          outsideMenu: { type: "boolean" },
          portionText: { type: "string" },
        },
        required: ["calories", "protein", "carbs", "fat"],
      },
      pending_meal_update: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          logId: { type: "string" },
          calories: { type: "integer" },
          protein: { type: "integer" },
          carbs: { type: "integer" },
          fat: { type: "integer" },
          dayType: { type: "string", enum: ["TRAINING", "REST"] },
          description: { type: "string" },
          matchedMenuItemId: { type: ["string", "null"] },
        },
        required: ["logId"],
      },
      pending_workout_candidate: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          workoutType: { type: "string" },
          effortLevel: { type: "string", enum: ["EASY", "NORMAL", "HARD", "FAILED", "SKIPPED"] },
          exercises: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                exerciseName: { type: "string" },
                weight: { type: ["number", "null"] },
              },
              required: ["exerciseName"],
            },
            minItems: 1,
          },
          date: { type: "string" },
          notes: { type: "string" },
          durationMin: { type: "integer" },
          intensity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          performedAsPlanned: { type: "boolean" },
          caloriesBurnEstimate: { type: "integer" },
        },
        required: ["workoutType", "effortLevel", "exercises"],
      },
      pending_workout_update: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          toolName: { type: "string", enum: ["update_workout", "update_workout_exercise"] },
          payload: {
            type: "object",
            additionalProperties: true,
          },
        },
        required: ["toolName", "payload"],
      },
      awaiting_day_type: { type: "boolean" },
      awaiting_missing_fields: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          actionType: {
            type: "string",
            enum: [
              "report_meal",
              "update_meal",
              "report_workout",
              "update_workout",
              "update_workout_exercise",
            ],
          },
          missingFields: {
            type: "array",
            items: { type: "string" },
          },
          draftPayload: {
            type: "object",
            additionalProperties: true,
          },
        },
        required: ["actionType"],
      },
      last_menu_check: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          dayType: { type: "string", enum: ["TRAINING", "REST"] },
          inMenu: { type: ["boolean", "null"] },
          likelyMatch: { type: ["string", "null"] },
          mismatchReason: { type: ["string", "null"] },
          queryFoodText: { type: "string" },
        },
      },
      last_calorie_estimate: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          queryFoodText: { type: "string" },
          estimatedCalories: { type: ["integer", "null"] },
          portionAssumption: { type: ["string", "null"] },
          confidence: { type: ["number", "null"] },
          inMenu: { type: ["boolean", "null"] },
          matchedMenuItem: {
            type: "object",
            additionalProperties: false,
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
          },
          outsideMenu: { type: "boolean" },
        },
      },
      last_workout_context: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          programId: { type: "string" },
          programName: { type: "string" },
          workoutDay: { type: ["string", "null"] },
          completionStatus: {
            type: "string",
            enum: ["UNKNOWN", "NOT_REPORTED", "PARTIAL", "DONE"],
          },
          exerciseCount: { type: "integer" },
          expectedExercises: {
            type: "array",
            items: { type: "string" },
          },
          availablePrograms: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                name: { type: "string" },
              },
              required: ["id", "name"],
            },
          },
        },
      },
      resolved_day_type: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          dayType: { type: "string", enum: ["TRAINING", "REST"] },
          source: {
            type: "string",
            enum: ["TOOL_DAILY_STATE", "SET_DAY_TYPE", "USER_TEXT"],
          },
          capturedAt: { type: "string" },
        },
        required: ["dayType", "capturedAt"],
      },
      clearKeys: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "pending_meal_candidate",
            "pending_meal_update",
            "pending_workout_candidate",
            "pending_workout_update",
            "awaiting_missing_fields",
            "last_menu_check",
            "last_calorie_estimate",
            "last_workout_context",
            "resolved_day_type",
          ],
        },
      },
    },
    required: [],
    additionalProperties: false,
  },
  async execute(args, context) {
    const payload = PendingActionToolInputDto.parse(args);
    const state = await patchConversationState(context.conversationId, payload);
    context.conversationState = state;
    return {
      success: true,
      state,
    };
  },
};
