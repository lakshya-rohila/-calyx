// Main exports
export { Calendar } from './Calendar';
export type {
  CalendarProps,
  CalendarMonthProps,
  CalendarWeekProps,
  CalendarDayProps,
  CalendarMode,
} from './Calendar';

// Primitives
export { DayCell, NavigationButton } from './primitives';

// Event components
export { EventDot } from './EventDot';
export { EventDots } from './EventDots';
export { EventBottomSheet } from './EventBottomSheet';

// Theme
export { ThemeProvider, useTheme, themes } from './theme';
export type { CalendarTheme, ThemeName } from './theme';
