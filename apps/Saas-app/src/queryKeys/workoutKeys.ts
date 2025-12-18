// src/queryKeys/workoutKeys.ts

export const workoutKeys = {
    root: () => ["workout"] as const,
  
    // Programs
    programs: () => [...workoutKeys.root(), "programs"] as const,
    program: (programId: string) =>
      [...workoutKeys.programs(), programId] as const,
  
    // Client programs
    clientPrograms: (clientId: string) =>
      [...workoutKeys.root(), "clients", clientId, "programs"] as const,
    clientProgram: (clientId: string, programId: string) =>
      [...workoutKeys.clientPrograms(clientId), programId] as const,
  
    // Templates
    templates: () => [...workoutKeys.root(), "templates"] as const,
    template: (templateId: string) =>
      [...workoutKeys.templates(), templateId] as const,
  
    // Exercises
    exercises: () => [...workoutKeys.root(), "exercises"] as const,
    exercise: (exerciseId: string) =>
      [...workoutKeys.exercises(), exerciseId] as const,
  };
  