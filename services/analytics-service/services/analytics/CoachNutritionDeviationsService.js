const ClientTodayService = require("./clientToday.service");
const ClientsService = require("../clients.service");

const THRESHOLD = 300;

async function getCoachNutritionDeviations(coachId) {
  const clients = await ClientsService.getClientsForCoach(coachId);

  const results = [];

  for (const client of clients) {
    const today = await ClientTodayService.getClientToday(client.id);

    const consumed = today.calories.consumed;
    const target = today.calories.target;

    if (!target) continue;

    const diff = consumed - target;

    if (Math.abs(diff) < THRESHOLD) continue;

    const meal =
      diff > 0
        ? pickHighestCalorieMeal(today.meals)
        : pickLastMeal(today.meals);

    results.push({
      clientId: client.id,
      name: client.name,
      meal: meal?.title ?? "—",
      caloriesDiff: diff,
      color: diff > 0 ? "red" : "green"
    });
  }

  return results;
}
