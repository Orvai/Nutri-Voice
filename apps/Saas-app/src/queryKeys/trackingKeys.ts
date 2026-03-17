
export const trackingKeys = {
  all: ['tracking'] as const,
  dailyState: () => [...trackingKeys.all, 'daily-state'] as const,
  rangeState: (startDate: string, endDate: string, clientId?: string) =>
    [
      ...trackingKeys.all,
      'daily-state',
      'range',
      { startDate, endDate, ...(clientId ? { clientId } : {}) },
    ] as const,
};
