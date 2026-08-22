// Ovde se definise nacin na koji se vreme i datumi prikazuju

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

export function formatOrdinalDate(iso: string): string {
  const date = new Date(iso);
  const day = date.getDate();
  return `${day}${ordinalSuffix(day)} of ${MONTH_FORMATTER.format(date)}`;
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

export function formatTodayHeading(date: Date): string {
  const day = date.getDate();
  return `Today, ${day}${ordinalSuffix(day)} ${MONTH_FORMATTER.format(date)}, ${WEEKDAY_FORMATTER.format(date)}`;
}

const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${TIME_FORMATTER.format(new Date(startIso))} - ${TIME_FORMATTER.format(new Date(endIso))}`;
}

export function formatClock(date: Date): string {
  return TIME_FORMATTER.format(date);
}
