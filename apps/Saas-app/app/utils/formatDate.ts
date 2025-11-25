export function formatDate(date: Date | string) {
    const value = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('ar-EG', {
      month: 'short',
      day: 'numeric',
    }).format(value);
  }