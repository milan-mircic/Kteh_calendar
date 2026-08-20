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

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

// e.g. "Today, 20th August, Thursday" — used above the home quote.
export function formatTodayHeading(date: Date): string {
  const day = date.getDate();
  return `Today, ${day}${ordinalSuffix(day)} ${MONTH_FORMATTER.format(date)}, ${WEEKDAY_FORMATTER.format(date)}`;
}

const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

// e.g. "20:00 - 21:45"
export function formatTimeRange(startIso: string, endIso: string): string {
  return `${TIME_FORMATTER.format(new Date(startIso))} - ${TIME_FORMATTER.format(new Date(endIso))}`;
}

// e.g. "21:51" — used by the top bar's live clock (Figma: Time_stamp, 44:2596)
export function formatClock(date: Date): string {
  return TIME_FORMATTER.format(date);
}
