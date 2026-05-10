// Types
export type {
  CalendarDate,
  WeekConfig,
  DayData,
  WeekData,
  MonthData,
} from './types';

// Calendar math utilities
export {
  isSameDay,
  isToday,
  isWeekend,
  isSameMonth,
  isSameWeek,
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  subWeeks,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  getDaysInMonth,
  getWeekNumber,
  getDayOfWeek,
  toCalendarDate,
  fromCalendarDate,
} from './calendar-math';

// Generators
export { generateMonthData } from './month-generator';
export { generateWeekData } from './week-generator';
