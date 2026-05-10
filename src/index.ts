// Core Hooks (PRIMARY API)
export { useCalendar, useMonthCalendar, useWeekCalendar } from './hooks';

// Types (for TypeScript consumers)
export type {
  CalendarDate,
  WeekConfig,
  DayData,
  WeekData,
  MonthData,
  UseCalendarOptions,
  UseCalendarReturn,
  UseMonthCalendarOptions,
  UseMonthCalendarReturn,
  UseWeekCalendarOptions,
  UseWeekCalendarReturn,
  CalendarState,
} from './types';

// Engine utilities (ADVANCED API - for custom implementations)
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
} from './engine/calendar-math';

// Generators (ADVANCED API)
export { generateMonthData, generateWeekData } from './engine';

// Store (EXPERT API - for custom state management)
export { createCalendarStore } from './store/calendar-store';
