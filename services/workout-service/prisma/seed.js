const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.exercise.createMany({
    data: [
      {
        name: 'Barbell Squat',
        description: 'Compound lower-body exercise focusing on quads and glutes',
        muscleGroup: 'LEGS',
        workoutTypes: ['A', 'LOWER', 'FBW', 'LEGS'],
        equipment: 'Barbell',
        difficulty: 'medium',
      },
      {
        name: 'Bench Press',
        description: 'Horizontal press for chest and triceps',
        muscleGroup: 'CHEST',
        workoutTypes: ['A', 'UPPER', 'PUSH'],
        equipment: 'Barbell',
        difficulty: 'medium',
      },
      {
        name: 'Lat Pulldown',
        description: 'Vertical pull for lats and biceps',
        muscleGroup: 'BACK',
        workoutTypes: ['B', 'UPPER', 'PULL'],
        equipment: 'Machine',
        difficulty: 'easy',
      },
      {
        name: 'Glute Bridge',
        description: 'Hip hinge to target glutes and hamstrings',
        muscleGroup: 'GLUTES',
        workoutTypes: ['GLUTES', 'LOWER'],
        equipment: 'Bodyweight',
        difficulty: 'easy',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.workoutTemplate.createMany({
    data: [
      {
        gender: 'MALE',
        level: 1,
        bodyType: 'ECTO',
        workoutType: 'FBW',
        muscleGroups: ['CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS'],
        name: 'Beginner FBW',
        notes: '3x per week full body routine',
      },
      {
        gender: 'FEMALE',
        level: 1,
        bodyType: 'ENDO',
        workoutType: 'GLUTES',
        muscleGroups: ['GLUTES', 'LEGS', 'ABS'],
        name: 'Glute Focus Level 1',
        notes: 'Emphasize posterior chain activation',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });