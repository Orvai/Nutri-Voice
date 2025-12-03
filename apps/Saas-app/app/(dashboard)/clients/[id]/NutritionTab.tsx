import { ScrollView } from "react-native";
import NutritionPlansForClient from "../../../../src/components/client-profile/nutrition/ClientNutritionPlans";

export default function NutritionTab({ client }) {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <NutritionPlansForClient clientId={client.id} />
    </ScrollView>
  );
}
