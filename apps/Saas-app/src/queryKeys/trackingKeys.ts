
export const trackingKeys = {
  all: ['tracking'] as const,
  dailyState: () => [...trackingKeys.all, 'daily-state'] as const,
  rangeState: (startDate: string, endDate: string) => 
    [...trackingKeys.all, 'daily-state', 'range', { startDate, endDate }] as const,
};