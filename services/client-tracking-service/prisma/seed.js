const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Target IDs provided for the specific client and coach
 */
const CLIENT_ID = "c148d51a-9910-4c10-94c6-7fc5bd662e2d";

async function main() {
  console.log("🚀 Starting comprehensive 3-month seed process (JavaScript version)...");

  // --- Step 1: Cleanup existing data for this client ---
  console.log("🧹 Cleaning up old data for client...");
  await prisma.workoutExerciseLog.deleteMany({ where: { workoutLog: { clientId: CLIENT_ID } } });
  await prisma.workoutLog.deleteMany({ where: { clientId: CLIENT_ID } });
  await prisma.mealLog.deleteMany({ where: { clientId: CLIENT_ID } });
  await prisma.metricsLog.deleteMany({ where: { clientId: CLIENT_ID } });
  await prisma.weightLog.deleteMany({ where: { clientId: CLIENT_ID } });
  await prisma.daySelection.deleteMany({ where: { clientId: CLIENT_ID } });

  const daysToSeed = 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToSeed);

  // --- Step 2: Main Seeding Loop ---
  for (let i = 0; i < daysToSeed; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0); // Normalize to midnight

    const dayOfWeek = currentDate.getDay(); // 0=Sun, 1=Mon...
    const isTrainingDay = [1, 3, 5].includes(dayOfWeek); // Monday, Wednesday, Friday
    const dayType = isTrainingDay ? 'TRAINING' : 'REST';

    // 1. Day Selection
    await prisma.daySelection.create({
      data: { clientId: CLIENT_ID, date: currentDate, dayType }
    });

    // 2. Weight Progress (Simulating ~8.5kg loss over 90 days)
    // Every Sunday (0) and Thursday (4)
    if (dayOfWeek === 0 || dayOfWeek === 4) {
      const weightTrend = 95 - (i * 0.094);
      await prisma.weightLog.create({
        data: {
          clientId: CLIENT_ID,
          date: currentDate,
          weightKg: weightTrend + (Math.random() * 0.5 - 0.25),
          notes: i % 30 === 0 ? "Monthly checkpoint" : null
        }
      });
    }

    // 3. Metrics (Sleep, Steps, Water)
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const sleep = isWeekend ? 5.5 + Math.random() : 7.2 + Math.random();
    const steps = isWeekend ? 12000 + Math.floor(Math.random() * 5000) : 6000 + Math.floor(Math.random() * 4000);
    
    await prisma.metricsLog.create({
      data: {
        clientId: CLIENT_ID,
        date: currentDate,
        steps: steps,
        waterLiters: 2 + Math.random() * 2,
        sleepHours: sleep,
        notes: sleep < 6 ? "Feeling tired today" : "Great recovery"
      }
    });

    // 4. Nutrition (Target vs Consumed)
    const isBingeDay = dayOfWeek === 6 && i % 14 === 0; // Saturday "Cheat" every 2 weeks
    const targetCals = isTrainingDay ? 2600 : 2100;
    const consumedCals = isBingeDay ? targetCals + 1300 : targetCals + (Math.random() * 150 - 75);

    await prisma.mealLog.create({
      data: {
        clientId: CLIENT_ID,
        date: currentDate,
        dayType,
        calories: Math.round(consumedCals),
        protein: isTrainingDay ? 190 : 165,
        carbs: Math.round(consumedCals * 0.45 / 4),
        fat: Math.round(consumedCals * 0.25 / 9),
        description: isBingeDay ? "Social event / Binge eating" : "Meals as planned",
        matchedMenuItemId: !isBingeDay ? "menu_item_standard" : null
      }
    });

    // 5. Workouts & Progressive Overload
    if (isTrainingDay) {
      const strengthGain = Math.floor(i / 21) * 2.5;

      const workout = await prisma.workoutLog.create({
        data: {
          clientId: CLIENT_ID,
          date: currentDate,
          workoutType: dayOfWeek === 1 ? "Upper Body" : dayOfWeek === 3 ? "Lower Body" : "Full Body",
          notes: sleep < 6 ? "Low energy due to sleep" : "Strong session"
        }
      });

      const exercises = [
        { name: "Bench Press", weight: 70 + strengthGain },
        { name: "Squat", weight: 90 + (strengthGain * 1.5) },
        { name: "Deadlift", weight: 110 + (strengthGain * 2) }
      ];

      for (const ex of exercises) {
        await prisma.workoutExerciseLog.create({
          data: {
            workoutLogId: workout.id,
            exerciseName: ex.name,
            weight: ex.weight,
            notes: "Focused on form"
          }
        });
      }
    }
  }

  console.log("✅ Seed completed successfully for client: " + CLIENT_ID);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });