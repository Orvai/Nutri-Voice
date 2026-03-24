export function isWorkoutReportStart(text) {
  return /(אני\s+)?(רוצה|מעוניי?ן|בא לי)\s+לדווח\s+על\s+אימון|לדווח על אימון|דיווח אימון/i.test(
    String(text || "").trim()
  );
}

export function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\u0590-\u05FFa-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ");
}

export function resolveProgramSelectionFromText(userText, programs = []) {
  const text = String(userText || "").trim();
  if (!text) return null;

  const asNumber = Number.parseInt(text, 10);
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= programs.length) {
    return programs[asNumber - 1];
  }

  const normalizedText = normalizeToken(text);
  return (
    programs.find((program) => normalizeToken(program.name) === normalizedText) ||
    programs.find((program) => normalizedText.includes(normalizeToken(program.name))) ||
    null
  );
}

export function formatWorkoutProgramsReply(programs = []) {
  const lines = programs.map((program, index) => `${index + 1}. ${program.name}`);
  return [
    "מעולה, איזה אימון מהתוכניות שלך ביצעת?",
    ...lines,
    "אחרי שתבחר, נאסוף רמת מאמץ, הערות, ומשקל לכל תרגיל שביצעת ואז אדווח את האימון.",
  ].join("\n");
}

export function mergeWorkoutReportDraftArgs(args, state) {
  const awaiting = state?.awaiting_missing_fields;
  if (awaiting?.actionType !== "report_workout" || !awaiting?.draftPayload) {
    return args;
  }

  const draft = awaiting.draftPayload || {};
  const merged = {
    ...draft,
    ...args,
  };

  const draftExercises = Array.isArray(draft.exercises) ? draft.exercises : [];
  const argExercises = Array.isArray(args.exercises) ? args.exercises : [];

  if (draftExercises.length || argExercises.length) {
    const byName = new Map();

    for (const exercise of draftExercises) {
      const key = normalizeToken(exercise.exerciseName || exercise.id || "");
      if (!key) continue;
      byName.set(key, { ...exercise });
    }

    for (const exercise of argExercises) {
      const key = normalizeToken(exercise.exerciseName || exercise.id || "");
      if (!key) continue;
      const prev = byName.get(key) || {};
      byName.set(key, { ...prev, ...exercise });
    }

    merged.exercises = [...byName.values()];
  }

  return merged;
}

export function validateWorkoutReportPayload(args) {
  const missing = [];
  if (!args?.workoutType) missing.push("workoutType");
  if (!args?.effortLevel) missing.push("effortLevel");
  if (typeof args?.notes !== "string") missing.push("notes");

  if (!Array.isArray(args?.exercises) || args.exercises.length === 0) {
    missing.push("exercises");
  } else {
    const missingWeights = args.exercises.filter(
      (exercise) => !Object.prototype.hasOwnProperty.call(exercise || {}, "weight")
    );
    if (missingWeights.length > 0) {
      missing.push("exerciseWeights");
    }
  }

  if (missing.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    missingFields: [...new Set(missing)],
    message:
      "לפני הדיווח חסר לי מידע: רמת מאמץ, הערות, ומשקל לכל תרגיל שביצעת.",
  };
}
