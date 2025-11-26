import React from 'react';
import DailyKpis from '../../src/components/home/DailyKpis';
import DailyDietDeviations from '../../src/components/home/DailyDietDeviations';
import MissingReports from '../../src/components/home/MissingReports';
import PersonalMessages from '../../src/components/home/PersonalMessages';
import WeeklyRisk from '../../src/components/home/WeeklyRisk';
import { useDashboardData } from '../../src/hooks/useDashboardData';
import Spacer from '../../src/components/ui/Spacer';

export default function HomeScreen() {
  const data = useDashboardData();

  return (
    <>
      <DailyKpis data={data.dailyKpis} />
      <Spacer size={12} />
      <PersonalMessages data={data.messages} />
      <Spacer size={12} />
      <MissingReports data={data.missingReports} />
      <Spacer size={12} />
      <DailyDietDeviations data={data.deviations} />
      <Spacer size={12} />
      <WeeklyRisk data={data.weeklyRisk} />
    </>
  );
}