import {
  startOfWeek,
  addDays,
  getWeekNumber,
  getDayOfWeek,
  isToday,
  isWeekend,
  toCalendarDate,
} from './calendar-math';
import type { WeekData, WeekConfig, DayData } from './types';

/**
 * Generates a single week data structure
 *
 * @param date - Any date within the target week
 * @param config - Week configuration (start day, locale)
 * @returns Complete week structure with 7 days
 */
export function generateWeekData(date: Date, config: WeekConfig): WeekData {
  const weekStart = startOfWeek(date, config);
  const weekNum = getWeekNumber(date);

  const days: DayData[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);

    days.push({
      date: currentDay,
      calendarDate: toCalendarDate(currentDay),
      isToday: isToday(currentDay),
      isWeekend: isWeekend(currentDay),
      isCurrentMonth: true, // Week view doesn't distinguish months
      dayOfWeek: getDayOfWeek(currentDay),
    });
  }

  return {
    weekNumber: weekNum,
    days,
  };
}
