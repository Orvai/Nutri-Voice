import { ScrollView, View } from "react-native";
import ProgressRangeSelector from "../../../../src/components/client-profile/progress/ProgressRangeSelector";
import ProgressSummaryCards from "../../../../src/components/client-profile/progress/ProgressSummaryCards";
import WeightTrendChart from "../../../../src/components/client-profile/progress/WeightTrendChart";
import BodyCompositionChart from "../../../../src/components/client-profile/progress/BodyCompositionChart";
import CalorieDeviations from "../../../../src/components/client-profile/progress/CalorieDeviations";
import WorkoutWeightsTable from "../../../../src/components/client-profile/progress/WorkoutWeightsTable";
import WorkoutProgressChart from "../../../../src/components/client-profile/progress/WorkoutProgressChart";
import MeasurementsTable from "../../../../src/components/client-profile/progress/MeasurementsTable";

export default function ProgressTab({ client }) {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <ProgressRangeSelector />
      <ProgressSummaryCards />
      <WeightTrendChart />
      <BodyCompositionChart />
      <CalorieDeviations />
      <WorkoutWeightsTable />
      <WorkoutProgressChart />
      <MeasurementsTable />
    </ScrollView>
  );
}
