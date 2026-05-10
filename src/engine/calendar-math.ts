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
  addMonths as dateFnsAddMonths,
  startOfMonth as dateFnsStartOfMonth,
  endOfMonth as dateFnsEndOfMonth,
  startOfWeek as dateFnsStartOfWeek,
  getDaysInMonth as dateFnsGetDaysInMonth,
} from 'date-fns';
import type { CalendarDate } from './types';

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
 * Add months to a date
 * @param date - The date to add months to
 * @param amount - Number of months to add (can be negative)
 * @returns New date with months added
 */
export function addMonths(date: Date, amount: number): Date {
  return dateFnsAddMonths(date, amount);
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
 * @returns Date representing Sunday of the week at 00:00:00
 */
export function startOfWeek(date: Date): Date {
  return dateFnsStartOfWeek(date, { weekStartsOn: 0 }); // Sunday
}

/**
 * Get the number of days in the month for a given date
 * @param date - The date to get the days count for
 * @returns Number of days in the month
 */
export function getDaysInMonth(date: Date): number {
  return dateFnsGetDaysInMonth(date);
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
