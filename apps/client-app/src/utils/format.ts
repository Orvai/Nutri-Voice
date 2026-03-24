export const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
};

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("he-IL").format(Math.round(value));

export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

export const formatRelativeMinutes = (iso: string): string => {
  const now = Date.now();
  const deltaMs = now - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(deltaMs / 60000));

  if (minutes < 60) {
    return `לפני ${minutes} דק׳`;
  }

  const hours = Math.round(minutes / 60);
  return `לפני ${hours} ש׳`;
};

export const generateId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
