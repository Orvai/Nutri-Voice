const { PrismaClient, MuscleGroup, WorkoutType, Gender, BodyType } = require("@prisma/client");

const prisma = new PrismaClient();

const COACH_ID = "ba59ccee-bd43-4102-acb8-fd11184c2bad";

// סרטונים לדוגמה (פלייסהולדרים/יוטיוב/דמואים)
const VIDEO_URLS = [
  "https://cdn.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  "https://assets.server.com/videos/pushup-demo.mp4",
  "https://assets.server.com/videos/squat-tutorial.mp4",
  "https://assets.server.com/videos/benchpress-guide.mp4",
  "https://assets.server.com/videos/row-machine.mp4",
  "https://assets.server.com/videos/lat-pulldown.mp4",
  "https://assets.server.com/videos/bicep-curl.mp4",
  "https://assets.server.com/videos/tricep-extension.mp4",
];

// פונקציה לבחירת וידיאו רנדומלי
function randomVideo() {
  return VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)];
}

// -------------------------
//       EXERCISES
// -------------------------
const EXERCISES = [
  {
    name: "Bench Press",
    muscleGroup: MuscleGroup.CHEST,
    workoutTypes: [WorkoutType.A, WorkoutType.UPPER, WorkoutType.FBW],
    equipment: "Barbell",
    difficulty: "medium",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: MuscleGroup.CHEST,
    workoutTypes: [WorkoutType.A, WorkoutType.UPPER],
    equipment: "Dumbbell",
    difficulty: "medium",
  },
  {
    name: "Lat Pulldown",
    muscleGroup: MuscleGroup.BACK,
    workoutTypes: [WorkoutType.A, WorkoutType.FBW, WorkoutType.PULL],
    equipment: "Machine",
    difficulty: "easy",
  },
  {
    name: "Barbell Row",
    muscleGroup: MuscleGroup.BACK,
    workoutTypes: [WorkoutType.B, WorkoutType.PULL],
    equipment: "Barbell",
    difficulty: "hard",
  },
  {
    name: "Shoulder Press",
    muscleGroup: MuscleGroup.SHOULDERS,
    workoutTypes: [WorkoutType.A, WorkoutType.UPPER],
    equipment: "Dumbbell",
    difficulty: "medium",
  },
  {
    name: "Squat",
    muscleGroup: MuscleGroup.LEGS,
    workoutTypes: [WorkoutType.LEGS, WorkoutType.FBW, WorkoutType.A],
    equipment: "Barbell",
    difficulty: "hard",
  },
  {
    name: "Leg Press",
    muscleGroup: MuscleGroup.LEGS,
    workoutTypes: [WorkoutType.LEGS, WorkoutType.FBW],
    equipment: "Machine",
    difficulty: "easy",
  },
  {
    name: "Glute Bridge",
    muscleGroup: MuscleGroup.GLUTES,
    workoutTypes: [WorkoutType.GLUTES, WorkoutType.FBW],
    equipment: "Bodyweight",
    difficulty: "easy",
  },
  {
    name: "Bicep Curl",
    muscleGroup: MuscleGroup.BICEPS,
    workoutTypes: [WorkoutType.PULL, WorkoutType.A, WorkoutType.B],
    equipment: "Dumbbell",
    difficulty: "easy",
  },
  {
    name: "Tricep Rope Pushdown",
    muscleGroup: MuscleGroup.TRICEPS,
    workoutTypes: [WorkoutType.PUSH, WorkoutType.A],
    equipment: "Cable",
    difficulty: "easy",
  },
];

// -------------------------
//     WORKOUT TEMPLATES
// -------------------------
const WORKOUT_TEMPLATES = [
  {
    gender: Gender.MALE,
    level: 1,
    bodyType: BodyType.ECTO,
    workoutType: WorkoutType.FBW,
    muscleGroups: [
      MuscleGroup.CHEST,
      MuscleGroup.BACK,
      MuscleGroup.SHOULDERS,
      MuscleGroup.LEGS,
      MuscleGroup.BICEPS,
      MuscleGroup.TRICEPS,
    ],
    name: "FBW – Beginner Male ECTO",
  },
  {
    gender: Gender.MALE,
    level: 2,
    bodyType: BodyType.ENDO,
    workoutType: WorkoutType.A,
    muscleGroups: [
      MuscleGroup.CHEST,
      MuscleGroup.SHOULDERS,
      MuscleGroup.TRICEPS,
      MuscleGroup.ABS,
    ],
    name: "Workout A – Male ENDO Level 2",
  },
  {
    gender: Gender.FEMALE,
    level: 1,
    bodyType: BodyType.ECTO,
    workoutType: WorkoutType.LOWER,
    muscleGroups: [
      MuscleGroup.GLUTES,
      MuscleGroup.LEGS,
      MuscleGroup.ABS,
    ],
    name: "Lower Body – Female Beginner",
  },
];

// -------------------------
//           SEED
// -------------------------
async function main() {
  console.log("🌱 Seeding workout-service...");

  // Delete existing data
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutProgram.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workoutTemplate.deleteMany();

  // Create EXERCISES
  for (const ex of EXERCISES) {
    await prisma.exercise.create({
      data: {
        ...ex,
        description: "Automatically seeded exercise",
        notes: "Seed data",
        videoUrl: randomVideo(),
        createdByCoachId: COACH_ID,
      },
    });
  }

  // Create WORKOUT TEMPLATES
  for (const tmpl of WORKOUT_TEMPLATES) {
    await prisma.workoutTemplate.create({
      data: {
        ...tmpl,
        notes: "Seeded workout template",
      },
    });
  }

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
