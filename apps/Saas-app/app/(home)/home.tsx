import React from 'react';
import DailyKpis from '../components/home/DailyKpis';
import DailyDietDeviations from '../components/home/DailyDietDeviations';
import MissingReports from '../components/home/MissingReports';
import PersonalMessages from '../components/home/PersonalMessages';
import WeeklyRisk from '../components/home/WeeklyRisk';
import { useDashboardData } from '../hooks/useDashboardData';
import Spacer from '../components/ui/Spacer';

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