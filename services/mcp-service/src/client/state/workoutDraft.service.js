export function pickPendingAction(state) {
  if (state.pending_meal_candidate) {
    return {
      stateKey: "pending_meal_candidate",
      toolName: "report_meal",
      payload: state.pending_meal_candidate,
      successText: "מעולה, דיווחתי את הארוחה.",
    };
  }

  if (state.pending_meal_update) {
    return {
      stateKey: "pending_meal_update",
      toolName: "update_meal",
      payload: state.pending_meal_update,
      successText: "סגור, עדכנתי את הארוחה.",
    };
  }

  if (state.pending_workout_candidate) {
    return {
      stateKey: "pending_workout_candidate",
      toolName: "report_workout",
      payload: state.pending_workout_candidate,
      successText: "מעולה, האימון דווח.",
    };
  }

  if (state.pending_workout_update) {
    return {
      stateKey: "pending_workout_update",
      toolName: state.pending_workout_update.toolName,
      payload: state.pending_workout_update.payload,
      successText: "סגור, עדכנתי את האימון.",
    };
  }

  return null;
}
