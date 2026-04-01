/** Format Date to YYYY-MM-DD (local date). */
export function toDayString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD string to Date at local noon (avoids timezone shift). */
export function fromDayString(s: string): Date {
  return new Date(s + "T12:00:00");
}

/** Add days to a Date. Returns a new Date, never mutates the input. */
export function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Shorthand month labels (Jan, Feb, Mar, ...).
 * Uses the default locale; pass a locale string as second arg to override.
 */
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Convert a month number (1–12) to a shorthand month label (e.g. 3 → "Mar").
 */
export function monthShort(month: number, _locale?: string): string {
  const i = Math.floor(month);
  if (i < 1 || i > 12) return "";
  return MONTHS_SHORT[i - 1];
}

/** Convert a Date to a shorthand month label (Jan, Feb, ...). */
export function monthShortFromDate(date: Date, _locale?: string): string {
  if (Number.isNaN(date.getTime())) return "";
  return monthShort(date.getMonth() + 1);
}

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Uppercase month name (1–12) e.g. 12 → "DECEMBER" */
export function monthNameUpper(month: number): string {
  const i = Math.floor(month);
  if (i < 1 || i > 12) return "";
  return MONTHS_FULL[i - 1].toUpperCase();
}

/** Format skipped range for list: "DECEMBER 1 - DECEMBER 31" or "NOVEMBER 25 - DECEMBER 31" */
export function formatSkippedRange(startDate: Date, endDate: Date): string {
  const startMonth = monthNameUpper(startDate.getMonth() + 1);
  const endMonth = monthNameUpper(endDate.getMonth() + 1);
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

/** Format month + year: "Mar 2026" */
export function formatMonthYear(date: Date): string {
  return `${monthShort(date.getMonth() + 1)} ${date.getFullYear()}`;
}

/** Format full month + year for section header: "March 2026" */
export function formatMonthYearFull(date: Date): string {
  return `${MONTHS_FULL[date.getMonth()]} ${date.getFullYear()}`;
}

/** Format date for list header: "Friday, 5" */
export function formatDayHeader(date: Date): string {
  const weekday = WEEKDAYS_FULL[date.getDay()];
  const day = date.getDate();
  return `${weekday}, ${day}`;
}

/** Format time range from ISO strings: "10:00 AM – 11:15 AM" */
export function formatTimeRange(startIso: string, endIso: string): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (iso: string) => {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${pad(m)} ${ampm}`;
  };
  return `${fmt(startIso)} – ${fmt(endIso)}`;
}
