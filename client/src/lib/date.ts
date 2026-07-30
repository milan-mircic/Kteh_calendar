function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long' });

// e.g. "11th of May"
export function formatOrdinalDate(iso: string): string {
  const date = new Date(iso);
  const day = date.getDate();
  return `${day}${ordinalSuffix(day)} of ${MONTH_FORMATTER.format(date)}`;
}

const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

// e.g. "20:00 - 21:45"
export function formatTimeRange(startIso: string, endIso: string): string {
  return `${TIME_FORMATTER.format(new Date(startIso))} - ${TIME_FORMATTER.format(new Date(endIso))}`;
}
