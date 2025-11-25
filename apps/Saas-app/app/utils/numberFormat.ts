export function numberFormat(value: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      ...options,
    }).format(value);
  }