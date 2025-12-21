// llm/tools/previewMeal.tool.js

function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/)
      .filter(Boolean);
  }
  
  function scoreFoodMatch(tokens, foodName) {
    const foodTokens = normalize(foodName);
    const matches = foodTokens.filter(t => tokens.includes(t)).length;
  
    if (matches === 0) return 0;
    return matches / foodTokens.length;
  }
  
  export const previewMealTool = {
    name: "preview_meal",
    description:
      "Analyzes whether a described food matches the user's nutrition menu, using food items, menu notes and vitamins",
    execute: async ({ description, menuContext }) => {
      const tokens = normalize(description);
  
      let bestMatches = [];
      let bestScore = 0;
  
      for (const meal of menuContext.meals) {
        for (const option of meal.options) {
          for (const item of option.items) {
            const score = scoreFoodMatch(tokens, item.foodName);
  
            if (score > 0) {
              bestMatches.push({
                foodItemId: item.foodItemId,
                foodName: item.foodName,
                mealName: meal.name,
                score,
              });
            }
  
            if (score > bestScore) {
              bestScore = score;
            }
          }
        }
      }
  
      bestMatches.sort((a, b) => b.score - a.score);
  
      const notesText =
        [menuContext.notes, ...menuContext.meals.map(m => m.notes)]
          .filter(Boolean)
          .join(" ");
  
      const notesTokens = normalize(notesText);
  
      const notesConflict = notesTokens.some(t =>
        tokens.includes(t)
      );
  
      const vitaminMentions = menuContext.vitamins.filter(v =>
        normalize(v.name).some(t => tokens.includes(t))
      );
  
      let matchType = "NONE";
  
      if (bestScore >= 0.8) matchType = "FULL";
      else if (bestScore >= 0.3) matchType = "PARTIAL";
  
      const confidence = Math.min(
        1,
        bestScore +
          (vitaminMentions.length ? 0.1 : 0) -
          (notesConflict ? 0.2 : 0)
      );
  
      return {
        matchType,
        confidence: Number(confidence.toFixed(2)),
        matchedItems: bestMatches.slice(0, 3),
        consideredMenuNotes: Boolean(menuContext.notes),
        consideredVitamins: menuContext.vitamins.length > 0,
        warnings: [
          ...(matchType === "NONE"
            ? ["הארוחה לא נמצאה בתפריט"]
            : []),
          ...(notesConflict
            ? ["ייתכן סתירה להערות התפריט"]
            : []),
        ],
      };
    },
  };
  