// src/services/tools/menu-meal/previewMeal.service.js

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(textNorm, foodName) {
  const nameNorm = normalize(foodName);
  if (!nameNorm) return 0;

  if (textNorm.includes(nameNorm)) return 1;

  const tokens = nameNorm.split(" ").filter(Boolean);
  const strongTokens = tokens.filter((t) => t.length >= 3);
  if (!strongTokens.length) return 0;

  const hits = strongTokens.filter((t) => textNorm.includes(t)).length;
  const ratio = hits / strongTokens.length;

  if (ratio >= 0.8) return 0.85;
  if (ratio >= 0.5) return 0.6;
  if (ratio >= 0.34) return 0.4;
  return 0;
}

/**
 * Preview meal vs menu context
 * NO side effects
 * NO gateway calls
 */
export async function previewMeal(args = {}, context) {
  const description = args.description;
  const menuContext = args.menuContext ?? context?.menuContext;

  if (!description) throw new Error("Missing args.description");
  if (!menuContext) throw new Error("Missing menuContext (args.menuContext or context.menuContext)");

  const textNorm = normalize(description);

  const matchedItems = [];
  const missingFromText = [];

  for (const meal of menuContext.meals || []) {
    for (const option of meal.options || []) {
      for (const item of option.items || []) {
        const name = item.foodName || "";
        const score = scoreMatch(textNorm, name);

        if (score >= 0.6) {
          matchedItems.push({
            foodItemId: item.foodItemId,
            name,
            confidence: score,
          });
        } else {
          missingFromText.push({
            foodItemId: item.foodItemId,
            name,
          });
        }
      }
    }
  }

  const coverage =
    menuContext?.meals?.length && matchedItems.length
      ? matchedItems.length /
        menuContext.meals.reduce((sum, m) => sum + (m.options?.length || 0), 0)
      : 0;

  let matchLevel = "LOW";
  if (coverage >= 0.8) matchLevel = "FULL";
  else if (coverage >= 0.4) matchLevel = "PARTIAL";

  const warnings = [];
  let requiresCoachApproval = false;

  if (matchLevel === "LOW") {
    warnings.push("התיאור לא תואם מספיק לתפריט — מומלץ אישור מאמן לפני דיווח.");
    requiresCoachApproval = true;
  }

  if (/(כאב|פציע|נקע|דימום|קרע|החמיר|לא מרגיש טוב)/.test(textNorm)) {
    warnings.push("זוהתה אינדיקציה לבעיה רפואית — להעביר למאמן.");
    requiresCoachApproval = true;
  }

  return {
    matchLevel,
    matchedItems,
    missingFromText,
    warnings,
    requiresCoachApproval,
  };
}
