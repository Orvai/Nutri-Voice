function pickHighestCalorieMeal(meals) {
    return meals.reduce(
      (max, m) => (m.calories > (max?.calories ?? 0) ? m : max),
      null
    );
  }
  
  function pickLastMeal(meals) {
    return meals.at(-1);
  }
  