import type { Locale } from 'date-fns';

/**
 * Represents a calendar date without time component
 */
export type CalendarDate = {
  year: number;
  month: number;  // 1-12 (not zero-indexed)
  day: number;    // 1-31
};

/**
 * Week configuration for calendar rendering
 */
export type WeekConfig = {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday, 1 = Monday, etc.
  locale?: Locale;  // date-fns Locale object
};

/**
 * Rich metadata for a single day in the calendar
 */
export type DayData = {
  date: Date;                    // Full Date object
  calendarDate: CalendarDate;    // Decomposed date
  isToday: boolean;              // Is this today?
  isWeekend: boolean;            // Is this Sat/Sun
  isCurrentMonth: boolean;       // For month views - is this day in the displayed month?
  dayOfWeek: number;             // 0-6 (0 = Sunday)
};

/**
 * Represents a single week in the calendar
 */
export type WeekData = {
  weekNumber: number;  // ISO 8601 week number
  days: DayData[];     // Always 7 days
};

/**
 * Represents a complete month view
 */
export type MonthData = {
  year: number;
  month: number;         // 1-12
  weeks: WeekData[];     // 4-6 weeks (includes overflow days)
  totalDays: number;     // Days in this month (28-31)
};
