import { ScrollView, View } from "react-native";
import DailyKpis from "../../../src/components/dashboard/DailyKpis";
import AttentionMessages from "../../../src/components/dashboard/AttentionMessages";
import NutritionDeviations from "../../../src/components/dashboard/NutritionDeviations";
import MissingReports from "../../../src/components/dashboard/MissingReports";
import AtRiskClients from "../../../src/components/dashboard/AtRiskClients";
import Spacer from "../../../src/components/ui/Spacer";
import { useDashboardData } from "../../../src/hooks/useDashboardData";

export default function DashboardScreen() {
  const data = useDashboardData();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      contentContainerStyle={{
        padding: 20,
        flexDirection: "column",
        gap: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* KPI עליונים */}
      <DailyKpis data={data.dailyKpis} />

      {/* הודעות הדורשות מענה */}
      <AttentionMessages data={data.attentionMessages} />

      {/* חריגות תזונה */}
      <NutritionDeviations data={data.nutritionDeviations} />

      {/* לקוחות שלא דיווחו */}
      <MissingReports data={data.missingReports} />

      {/* לקוחות בסיכון */}
      <AtRiskClients data={data.atRiskClients} />

      <Spacer h={30} />
    </ScrollView>
  );
}
