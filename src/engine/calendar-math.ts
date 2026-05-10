/**
 * Calendar Math Utilities
 *
 * Wraps date-fns functions for date comparison, arithmetic, and boundary calculations.
 * Provides conversion helpers between Date and CalendarDate formats.
 */

import {
  isSameDay as dateFnsIsSameDay,
  isToday as dateFnsIsToday,
  isWeekend as dateFnsIsWeekend,
  isSameMonth as dateFnsIsSameMonth,
  isSameWeek as dateFnsIsSameWeek,
  addMonths as dateFnsAddMonths,
  addWeeks as dateFnsAddWeeks,
  addDays as dateFnsAddDays,
  startOfMonth as dateFnsStartOfMonth,
  endOfMonth as dateFnsEndOfMonth,
  startOfWeek as dateFnsStartOfWeek,
  endOfWeek as dateFnsEndOfWeek,
  startOfDay as dateFnsStartOfDay,
  endOfDay as dateFnsEndOfDay,
  getDaysInMonth as dateFnsGetDaysInMonth,
  getISOWeek,
  getDay,
} from 'date-fns';
import type { CalendarDate, WeekConfig } from './types';

/**
 * Check if two dates are the same day (ignoring time)
 * @param dateLeft - First date to compare
 * @param dateRight - Second date to compare
 * @returns true if dates are the same day
 */
export function isSameDay(dateLeft: Date, dateRight: Date): boolean {
  return dateFnsIsSameDay(dateLeft, dateRight);
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns true if date is today
 */
export function isToday(date: Date): boolean {
  return dateFnsIsToday(date);
}

/**
 * Check if a date falls on a weekend (Saturday or Sunday)
 * @param date - Date to check
 * @returns true if date is Saturday or Sunday
 */
export function isWeekend(date: Date): boolean {
  return dateFnsIsWeekend(date);
}

/**
 * Check if two dates are in the same month (and year)
 * @param dateLeft - First date to compare
 * @param dateRight - Second date to compare
 * @returns true if dates are in the same month and year
 */
export function isSameMonth(dateLeft: Date, dateRight: Date): boolean {
  return dateFnsIsSameMonth(dateLeft, dateRight);
}

/**
 * Check if two dates are in the same week
 * @param dateLeft - First date to compare
 * @param dateRight - Second date to compare
 * @param config - Week configuration for week start day
 * @returns true if dates are in the same week
 */
export function isSameWeek(dateLeft: Date, dateRight: Date, config?: WeekConfig): boolean {
  return dateFnsIsSameWeek(dateLeft, dateRight, {
    weekStartsOn: config?.weekStartsOn ?? 0,
  });
}

/**
 * Add months to a date
 * @param date - The date to add months to
 * @param amount - Number of months to add (can be negative)
 * @returns New date with months added
 */
export function addMonths(date: Date, amount: number): Date {
  return dateFnsAddMonths(date, amount);
}

/**
 * Add weeks to a date
 * @param date - The date to add weeks to
 * @param amount - Number of weeks to add (can be negative)
 * @returns New date with weeks added
 */
export function addWeeks(date: Date, amount: number): Date {
  return dateFnsAddWeeks(date, amount);
}

/**
 * Add days to a date
 * @param date - The date to add days to
 * @param amount - Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: Date, amount: number): Date {
  return dateFnsAddDays(date, amount);
}

/**
 * Subtract months from a date
 * @param date - The date to subtract months from
 * @param amount - Number of months to subtract
 * @returns New date with months subtracted
 */
export function subMonths(date: Date, amount: number): Date {
  return dateFnsAddMonths(date, -amount);
}

/**
 * Subtract weeks from a date
 * @param date - The date to subtract weeks from
 * @param amount - Number of weeks to subtract
 * @returns New date with weeks subtracted
 */
export function subWeeks(date: Date, amount: number): Date {
  return dateFnsAddWeeks(date, -amount);
}

/**
 * Subtract days from a date
 * @param date - The date to subtract days from
 * @param amount - Number of days to subtract
 * @returns New date with days subtracted
 */
export function subDays(date: Date, amount: number): Date {
  return dateFnsAddDays(date, -amount);
}

/**
 * Get the start of the month for a given date
 * @param date - The date to get the month start for
 * @returns Date representing the first day of the month at 00:00:00
 */
export function startOfMonth(date: Date): Date {
  return dateFnsStartOfMonth(date);
}

/**
 * Get the end of the month for a given date
 * @param date - The date to get the month end for
 * @returns Date representing the last day of the month at 23:59:59.999
 */
export function endOfMonth(date: Date): Date {
  return dateFnsEndOfMonth(date);
}

/**
 * Get the start of the week for a given date
 * @param date - The date to get the week start for
 * @param config - Week configuration for week start day
 * @returns Date representing the start of the week at 00:00:00
 */
export function startOfWeek(date: Date, config?: WeekConfig): Date {
  return dateFnsStartOfWeek(date, { weekStartsOn: config?.weekStartsOn ?? 0 });
}

/**
 * Get the end of the week for a given date
 * @param date - The date to get the week end for
 * @param config - Week configuration for week start day
 * @returns Date representing the end of the week at 23:59:59.999
 */
export function endOfWeek(date: Date, config?: WeekConfig): Date {
  return dateFnsEndOfWeek(date, { weekStartsOn: config?.weekStartsOn ?? 0 });
}

/**
 * Get the start of the day for a given date
 * @param date - The date to get the start of day for
 * @returns Date at 00:00:00.000
 */
export function startOfDay(date: Date): Date {
  return dateFnsStartOfDay(date);
}

/**
 * Get the end of the day for a given date
 * @param date - The date to get the end of day for
 * @returns Date at 23:59:59.999
 */
export function endOfDay(date: Date): Date {
  return dateFnsEndOfDay(date);
}

/**
 * Get the number of days in a month
 * Accepts either a Date or (year, month) pair
 * @param yearOrDate - Year number or Date object
 * @param month - Month (1-12), only used if first param is year
 * @returns Number of days in the month (28-31)
 */
export function getDaysInMonth(yearOrDate: number | Date, month?: number): number {
  if (yearOrDate instanceof Date) {
    return dateFnsGetDaysInMonth(yearOrDate);
  }
  // yearOrDate is a number (year), month is 1-indexed
  return dateFnsGetDaysInMonth(new Date(yearOrDate, (month ?? 1) - 1, 1));
}

/**
 * Get the ISO 8601 week number for a given date
 * @param date - The date to get the week number for
 * @returns ISO week number (1-53)
 */
export function getWeekNumber(date: Date): number {
  return getISOWeek(date);
}

/**
 * Get the day of the week for a given date
 * @param date - The date to get the day of week for
 * @returns Day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

/**
 * Convert a JavaScript Date to a CalendarDate object
 * @param date - JavaScript Date object
 * @returns CalendarDate with 1-based month (1-12)
 */
export function toCalendarDate(date: Date): CalendarDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Convert from 0-based to 1-based
    day: date.getDate(),
  };
}

/**
 * Convert a CalendarDate to a JavaScript Date
 * @param calendarDate - CalendarDate with 1-based month (1-12)
 * @returns JavaScript Date object at 00:00:00 local time
 */
export function fromCalendarDate(calendarDate: CalendarDate): Date {
  return new Date(
    calendarDate.year,
    calendarDate.month - 1, // Convert from 1-based to 0-based
    calendarDate.day,
    0,
    0,
    0,
    0
  );
}
