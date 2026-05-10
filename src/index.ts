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

// Phase 2 exports (NEW)
export { Calendar } from './components';
export { DayCell, NavigationButton } from './components';
export { ThemeProvider, useTheme, themes } from './components';

export type {
  CalendarProps,
  CalendarMonthProps,
  CalendarWeekProps,
  CalendarDayProps,
  CalendarMode,
  CalendarTheme,
  ThemeName,
} from './components';

// Phase 3 exports - Event Management (NEW)
export { useEventStore } from './store/event-store';
export { EventDot, EventDots } from './components';

export type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from './types/events';
