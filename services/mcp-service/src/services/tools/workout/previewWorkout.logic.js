// src/services/tools/previewWorkout.logic.js

function normalize(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  /**
   * Simple, robust matching:
   * - match if exercise name appears in clientText (after normalization)
   * - also accept partial token match (>= 2 tokens)
   */
  function scoreMatch(clientTextNorm, exerciseName) {
    const nameNorm = normalize(exerciseName);
    if (!nameNorm) return 0;
  
    if (clientTextNorm.includes(nameNorm)) return 1;
  
    const tokens = nameNorm.split(" ").filter(Boolean);
    const strongTokens = tokens.filter((t) => t.length >= 3);
  
    if (strongTokens.length === 0) return 0;
  
    const hits = strongTokens.filter((t) => clientTextNorm.includes(t)).length;
    const ratio = hits / strongTokens.length;
  
    // soft score
    if (ratio >= 0.8) return 0.85;
    if (ratio >= 0.5) return 0.6;
    if (ratio >= 0.34) return 0.4;
    return 0;
  }
  
  export function previewWorkout({ clientText, program }) {
    const textNorm = normalize(clientText);
  
    const matchedExercises = [];
    const missingFromText = [];
  
    for (const pe of program.exercises || []) {
      const name = pe.exercise?.name || "";
      const score = scoreMatch(textNorm, name);
  
      if (score >= 0.6) {
        matchedExercises.push({
          programExerciseId: pe.id,
          name,
          confidence: score,
        });
      } else {
        missingFromText.push({
          programExerciseId: pe.id,
          name,
        });
      }
    }
  
    // unknownInText: naive extraction – words not covered is tricky.
    // We'll keep it conservative: only flag if user explicitly lists something like "X, Y, Z"
    // For now: empty array (prevents false alarms).
    const unknownInText = [];
  
    const coverage = program.exercises?.length
      ? matchedExercises.length / program.exercises.length
      : 0;
  
    let matchLevel = "LOW";
    if (coverage >= 0.8) matchLevel = "FULL";
    else if (coverage >= 0.4) matchLevel = "PARTIAL";
  
    const warnings = [];
    let requiresCoachApproval = false;
  
    if (matchLevel === "LOW") {
      warnings.push("התיאור לא תואם מספיק לתכנית האימון — מומלץ אישור מאמן לפני דיווח.");
      requiresCoachApproval = true;
    }
  
    if (/(כאב|פציע|נקע|דימום|קרע|החמיר|לא מרגיש טוב)/.test(textNorm)) {
      warnings.push("זוהתה אינדיקציה לכאב/פציעה — להעביר למאמן.");
      requiresCoachApproval = true;
    }
  
    return {
      matchLevel,
      matchedExercises,
      missingFromText,
      unknownInText,
      warnings,
      requiresCoachApproval,
    };
  }
  