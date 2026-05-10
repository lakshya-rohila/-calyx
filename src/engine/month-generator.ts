import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDaysInMonth,
  isSameMonth,
  toCalendarDate,
  isToday,
  isWeekend,
  getDayOfWeek,
  getWeekNumber,
} from './calendar-math';
import type { MonthData, WeekConfig, WeekData, DayData } from './types';

/**
 * Generates a complete month data structure
 *
 * @param date - Any date within the target month
 * @param config - Week configuration (start day, locale)
 * @returns Complete month structure with weeks and overflow days
 */
export function generateMonthData(date: Date, config: WeekConfig): MonthData {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Convert to 1-indexed
  const totalDays = getDaysInMonth(year, month);

  // Find the calendar start (may be in previous month)
  const calendarStart = startOfWeek(monthStart, config);

  // Find the calendar end (may be in next month)
  const calendarEnd = endOfWeek(monthEnd, config);

  // Generate all days
  const weeks: WeekData[] = [];
  let currentWeekStart = calendarStart;

  while (currentWeekStart <= calendarEnd) {
    const days: DayData[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(currentWeekStart, i);

      days.push({
        date: currentDay,
        calendarDate: toCalendarDate(currentDay),
        isToday: isToday(currentDay),
        isWeekend: isWeekend(currentDay),
        isCurrentMonth: isSameMonth(currentDay, date),
        dayOfWeek: getDayOfWeek(currentDay),
      });
    }

    weeks.push({
      weekNumber: getWeekNumber(currentWeekStart),
      days,
    });

    currentWeekStart = addDays(currentWeekStart, 7);
  }

  return {
    year,
    month,
    weeks,
    totalDays,
  };
}
