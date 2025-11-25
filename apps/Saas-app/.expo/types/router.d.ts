/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(analytics)` | `/(chat)` | `/(clients)` | `/(home)/home` | `/(plans)` | `/_sitemap` | `/components/home/DailyDietDeviations` | `/components/home/DailyKpis` | `/components/home/MissingReports` | `/components/home/PersonalMessages` | `/components/home/WeeklyRisk` | `/components/ui/Avatar` | `/components/ui/Badge` | `/components/ui/Button` | `/components/ui/Card` | `/components/ui/Chip` | `/components/ui/Divider` | `/components/ui/Input` | `/components/ui/ProgressRing` | `/components/ui/ScrollArea` | `/components/ui/SectionHeader` | `/components/ui/Spacer` | `/components/ui/Text` | `/home` | `/hooks/useDashboardData` | `/hooks/useScrollDirection` | `/hooks/useSidebar` | `/styles/colors` | `/styles/fonts` | `/styles/theme` | `/utils/cn` | `/utils/formatDate` | `/utils/formatTimeAgo` | `/utils/kcalColor` | `/utils/numberFormat` | `/utils/rtl`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
