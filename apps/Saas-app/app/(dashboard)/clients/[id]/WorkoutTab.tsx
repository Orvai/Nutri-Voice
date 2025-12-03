import { ScrollView } from "react-native";
import ClientWorkoutPlans from "../../../../src/components/client-profile/workout/ClientWorkoutPlans";

export default function WorkoutTab({ client }) {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <ClientWorkoutPlans clientId={client.id} />
    </ScrollView>
  );
}
