import type { ViewStyle } from 'react-native';
import type { DayData, WeekConfig } from '../../types';
import type { CalendarTheme } from '../theme/types';
import type { ThemeName } from '../theme/themes';

export type CalendarMode = 'month' | 'week' | 'day';

export type CalendarProps = {
  // Mode
  mode?: CalendarMode;

  // Controlled state (viewing date)
  value?: Date;
  onChange?: (date: Date) => void;

  // Uncontrolled state
  defaultValue?: Date;

  // Selection (separate from viewing)
  selected?: Date;
  onSelect?: (date: Date) => void;
  defaultSelected?: Date;

  // Configuration
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  theme?: CalendarTheme | ThemeName;

  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabled?: boolean;

  // Customization
  renderDay?: (day: DayData) => React.ReactNode;

  // Behavior
  showWeekNumbers?: boolean;
  highlightToday?: boolean;

  // Callbacks
  onMonthChange?: (year: number, month: number) => void;
  onWeekChange?: (weekNumber: number, year: number) => void;

  // Style
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};

export type CalendarMonthProps = {
  // Controlled/uncontrolled
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;

  // Selection
  selected?: Date;
  onSelect?: (date: Date) => void;
  defaultSelected?: Date;

  // Config
  weekStartsOn?: 0 | 1;
  theme?: CalendarTheme | ThemeName;

  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabled?: boolean;

  // Customization
  renderDay?: (day: DayData) => React.ReactNode;

  // Callbacks
  onMonthChange?: (year: number, month: number) => void;

  // Style
  style?: ViewStyle;
};

export type CalendarWeekProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;

  selected?: Date;
  onSelect?: (date: Date) => void;
  defaultSelected?: Date;

  weekStartsOn?: 0 | 1;
  theme?: CalendarTheme | ThemeName;

  showWeekNumber?: boolean;

  renderDay?: (day: DayData) => React.ReactNode;

  onWeekChange?: (weekNumber: number, year: number) => void;

  style?: ViewStyle;
};

export type CalendarDayProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;

  theme?: CalendarTheme | ThemeName;

  style?: ViewStyle;
};

export type CalendarHeaderProps = {
  year: number;
  month?: number;
  weekNumber?: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday?: () => void;
  theme: CalendarTheme;
};

export type CalendarWeekDaysProps = {
  weekStartsOn: 0 | 1;
  theme: CalendarTheme;
};

export type CalendarDaysProps = {
  monthData: import('../../types').MonthData;
  selected?: Date;
  onSelectDate?: (date: Date) => void;
  renderDay?: (day: DayData) => React.ReactNode;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabled?: boolean;
  theme: CalendarTheme;
};
