import ClientWorkoutPlans from "../../../../src/components/client-profile/workout/ClientWorkoutPlans";

export default function WorkoutTab({ client }) {
  return (
    <ClientWorkoutPlans clientId={client.id} />
  );
}