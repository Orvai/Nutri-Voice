import { useMemo } from 'react';

export function useDashboardData() {
  return useMemo(
    () => ({
      dailyKpis: [
        { title: 'אחוז דיווחים היום', value: 87, change: 4.2, unit: '%' },
        { title: 'עמידה ביעד קלוריות', value: 92, change: -1.3, unit: '%' },
        { title: 'מספר לקוחות פעילים', value: 26, change: 2.1, unit: 'לקוחות' },
      ],
      messages: [
        { id: '1', sender: 'נועה לוי', preview: 'איך אני מעדכנת את ארוחת הערב?', time: '2024-04-12T08:20:00Z' },
        { id: '2', sender: 'איתי כהן', preview: 'סיימתי את האימון של היום', time: '2024-04-12T07:05:00Z' },
      ],
      missingReports: [
        { id: '1', name: 'דנה רוזן', daysMissed: 2 },
        { id: '2', name: 'יואב שמש', daysMissed: 1 },
        { id: '3', name: 'ענבר שלו', daysMissed: 3 },
      ],
      deviations: [
        { id: '1', meal: 'ארוחת בוקר', delta: 120 },
        { id: '2', meal: 'ארוחת צהריים', delta: -80 },
        { id: '3', meal: 'ארוחת ערב', delta: 40 },
      ],
      weeklyRisk: {
        hydration: 0.68,
        sleep: 0.74,
        recovery: 0.55,
      },
    }),
    [],
  );
}