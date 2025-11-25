export function formatTimeAgo(date: Date | string) {
    const value = typeof date === 'string' ? new Date(date) : date;
    const diff = Date.now() - value.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `לפני ${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
  }