import * as date_fns from 'date-fns';
import { Locale } from 'date-fns';
import * as zustand from 'zustand';
import React$1 from 'react';
import { ViewStyle } from 'react-native';

/**
 * Represents a calendar date without time component
 */
type CalendarDate = {
    year: number;
    month: number;
    day: number;
};
/**
 * Week configuration for calendar rendering
 */
type WeekConfig = {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    locale?: Locale;
};
/**
 * Rich metadata for a single day in the calendar
 */
type DayData = {
    date: Date;
    calendarDate: CalendarDate;
    isToday: boolean;
    isWeekend: boolean;
    isCurrentMonth: boolean;
    dayOfWeek: number;
};
/**
 * Represents a single week in the calendar
 */
type WeekData = {
    weekNumber: number;
    days: DayData[];
};
/**
 * Represents a complete month view
 */
type MonthData = {
    year: number;
    month: number;
    weeks: WeekData[];
    totalDays: number;
};

type CalendarState = {
    currentDate: Date;
    selectedDate: Date | null;
    weekConfig: WeekConfig;
    setCurrentDate: (date: Date) => void;
    goToToday: () => void;
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
    goToNextWeek: () => void;
    goToPreviousWeek: () => void;
    goToDate: (date: Date) => void;
    setSelectedDate: (date: Date | null) => void;
    clearSelection: () => void;
    setWeekConfig: (config: WeekConfig) => void;
    setWeekStartsOn: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
};
/**
 * Creates a new calendar store instance
 * Supports multiple independent calendars in the same app
 */
declare const createCalendarStore: (initialConfig?: Partial<WeekConfig>) => zustand.UseBoundStore<Omit<zustand.StoreApi<CalendarState>, "setState"> & {
    setState(nextStateOrUpdater: CalendarState | Partial<CalendarState> | ((state: {
        currentDate: Date;
        selectedDate: Date | null;
        weekConfig: {
            weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
            locale?: {
                code: string;
                formatDistance: date_fns.FormatDistanceFn;
                formatRelative: date_fns.FormatRelativeFn;
                localize: {
                    ordinalNumber: date_fns.LocalizeFn<number>;
                    era: date_fns.LocalizeFn<date_fns.Era>;
                    quarter: date_fns.LocalizeFn<date_fns.Quarter>;
                    month: date_fns.LocalizeFn<date_fns.Month>;
                    day: date_fns.LocalizeFn<date_fns.Day>;
                    dayPeriod: date_fns.LocalizeFn<date_fns.LocaleDayPeriod>;
                    preprocessor?: (<DateType extends Date>(date: DateType, parts: date_fns.FormatPart[]) => date_fns.FormatPart[]) | undefined;
                };
                formatLong: {
                    date: date_fns.FormatLongFn;
                    time: date_fns.FormatLongFn;
                    dateTime: date_fns.FormatLongFn;
                };
                match: {
                    ordinalNumber: date_fns.MatchFn<number, {
                        unit: date_fns.LocaleUnit;
                    }>;
                    era: date_fns.MatchFn<date_fns.Era>;
                    quarter: date_fns.MatchFn<date_fns.Quarter>;
                    month: date_fns.MatchFn<date_fns.Month>;
                    day: date_fns.MatchFn<date_fns.Day>;
                    dayPeriod: date_fns.MatchFn<date_fns.LocaleDayPeriod>;
                };
                options?: {
                    weekStartsOn?: date_fns.Day | undefined;
                    firstWeekContainsDate?: date_fns.FirstWeekContainsDate | undefined;
                } | undefined;
            } | undefined;
        };
        setCurrentDate: (date: Date) => void;
        goToToday: () => void;
        goToNextMonth: () => void;
        goToPreviousMonth: () => void;
        goToNextWeek: () => void;
        goToPreviousWeek: () => void;
        goToDate: (date: Date) => void;
        setSelectedDate: (date: Date | null) => void;
        clearSelection: () => void;
        setWeekConfig: (config: WeekConfig) => void;
        setWeekStartsOn: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
    }) => void), shouldReplace?: false): void;
    setState(nextStateOrUpdater: CalendarState | ((state: {
        currentDate: Date;
        selectedDate: Date | null;
        weekConfig: {
            weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
            locale?: {
                code: string;
                formatDistance: date_fns.FormatDistanceFn;
                formatRelative: date_fns.FormatRelativeFn;
                localize: {
                    ordinalNumber: date_fns.LocalizeFn<number>;
                    era: date_fns.LocalizeFn<date_fns.Era>;
                    quarter: date_fns.LocalizeFn<date_fns.Quarter>;
                    month: date_fns.LocalizeFn<date_fns.Month>;
                    day: date_fns.LocalizeFn<date_fns.Day>;
                    dayPeriod: date_fns.LocalizeFn<date_fns.LocaleDayPeriod>;
                    preprocessor?: (<DateType extends Date>(date: DateType, parts: date_fns.FormatPart[]) => date_fns.FormatPart[]) | undefined;
                };
                formatLong: {
                    date: date_fns.FormatLongFn;
                    time: date_fns.FormatLongFn;
                    dateTime: date_fns.FormatLongFn;
                };
                match: {
                    ordinalNumber: date_fns.MatchFn<number, {
                        unit: date_fns.LocaleUnit;
                    }>;
                    era: date_fns.MatchFn<date_fns.Era>;
                    quarter: date_fns.MatchFn<date_fns.Quarter>;
                    month: date_fns.MatchFn<date_fns.Month>;
                    day: date_fns.MatchFn<date_fns.Day>;
                    dayPeriod: date_fns.MatchFn<date_fns.LocaleDayPeriod>;
                };
                options?: {
                    weekStartsOn?: date_fns.Day | undefined;
                    firstWeekContainsDate?: date_fns.FirstWeekContainsDate | undefined;
                } | undefined;
            } | undefined;
        };
        setCurrentDate: (date: Date) => void;
        goToToday: () => void;
        goToNextMonth: () => void;
        goToPreviousMonth: () => void;
        goToNextWeek: () => void;
        goToPreviousWeek: () => void;
        goToDate: (date: Date) => void;
        setSelectedDate: (date: Date | null) => void;
        clearSelection: () => void;
        setWeekConfig: (config: WeekConfig) => void;
        setWeekStartsOn: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
    }) => void), shouldReplace: true): void;
}>;

type UseCalendarOptions = {
    initialDate?: Date;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    onDateChange?: (date: Date) => void;
    onDateSelect?: (date: Date | null) => void;
    store?: ReturnType<typeof createCalendarStore>;
};
type UseCalendarReturn = {
    currentDate: Date;
    selectedDate: Date | null;
    weekConfig: WeekConfig;
    setCurrentDate: (date: Date) => void;
    selectDate: (date: Date | null) => void;
    clearSelection: () => void;
    goToToday: () => void;
    goToDate: (date: Date) => void;
    isDateSelected: (date: Date) => boolean;
    isDateCurrent: (date: Date) => boolean;
};
declare function useCalendar(options?: UseCalendarOptions): UseCalendarReturn;

type UseMonthCalendarOptions = UseCalendarOptions & {
    onMonthChange?: (year: number, month: number) => void;
};
type UseMonthCalendarReturn = UseCalendarReturn & {
    monthData: MonthData;
    year: number;
    month: number;
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
    goToMonth: (year: number, month: number) => void;
    getMonthKey: (offset: number) => string;
    generateMonthAtOffset: (offset: number) => MonthData;
};
declare function useMonthCalendar(options?: UseMonthCalendarOptions): UseMonthCalendarReturn;

type UseWeekCalendarOptions = UseCalendarOptions & {
    onWeekChange?: (weekNumber: number, year: number) => void;
};
type UseWeekCalendarReturn = UseCalendarReturn & {
    weekData: WeekData;
    weekNumber: number;
    year: number;
    goToNextWeek: () => void;
    goToPreviousWeek: () => void;
    goToWeek: (weekNumber: number, year: number) => void;
    getWeekKey: (offset: number) => string;
    generateWeekAtOffset: (offset: number) => WeekData;
};
declare function useWeekCalendar(options?: UseWeekCalendarOptions): UseWeekCalendarReturn;

/**
 * Calendar Math Utilities
 *
 * Wraps date-fns functions for date comparison, arithmetic, and boundary calculations.
 * Provides conversion helpers between Date and CalendarDate formats.
 */

/**
 * Check if two dates are the same day (ignoring time)
 * @param dateLeft - First date to compare
 * @param dateRight - Second date to compare
 * @returns true if dates are the same day
 */
declare function isSameDay(dateLeft: Date, dateRight: Date): boolean;
/**
 * Check if a date is today
 * @param date - Date to check
 * @returns true if date is today
 */
declare function isToday(date: Date): boolean;
/**
 * Check if a date falls on a weekend (Saturday or Sunday)
 * @param date - Date to check
 * @returns true if date is Saturday or Sunday
 */
declare function isWeekend(date: Date): boolean;
/**
 * Check if two dates are in the same month (and year)
 * @param dateLeft - First date to compare
 * @param dateRight - Second date to compare
 * @returns true if dates are in the same month and year
 */
declare function isSameMonth(dateLeft: Date, dateRight: Date): boolean;
/**
 * Check if two dates are in the same week
 * @param dateLeft - First date to compare
 * @param dateRight - Second date to compare
 * @param config - Week configuration for week start day
 * @returns true if dates are in the same week
 */
declare function isSameWeek(dateLeft: Date, dateRight: Date, config?: WeekConfig): boolean;
/**
 * Add months to a date
 * @param date - The date to add months to
 * @param amount - Number of months to add (can be negative)
 * @returns New date with months added
 */
declare function addMonths(date: Date, amount: number): Date;
/**
 * Add weeks to a date
 * @param date - The date to add weeks to
 * @param amount - Number of weeks to add (can be negative)
 * @returns New date with weeks added
 */
declare function addWeeks(date: Date, amount: number): Date;
/**
 * Add days to a date
 * @param date - The date to add days to
 * @param amount - Number of days to add (can be negative)
 * @returns New date with days added
 */
declare function addDays(date: Date, amount: number): Date;
/**
 * Subtract months from a date
 * @param date - The date to subtract months from
 * @param amount - Number of months to subtract
 * @returns New date with months subtracted
 */
declare function subMonths(date: Date, amount: number): Date;
/**
 * Subtract weeks from a date
 * @param date - The date to subtract weeks from
 * @param amount - Number of weeks to subtract
 * @returns New date with weeks subtracted
 */
declare function subWeeks(date: Date, amount: number): Date;
/**
 * Subtract days from a date
 * @param date - The date to subtract days from
 * @param amount - Number of days to subtract
 * @returns New date with days subtracted
 */
declare function subDays(date: Date, amount: number): Date;
/**
 * Get the start of the month for a given date
 * @param date - The date to get the month start for
 * @returns Date representing the first day of the month at 00:00:00
 */
declare function startOfMonth(date: Date): Date;
/**
 * Get the end of the month for a given date
 * @param date - The date to get the month end for
 * @returns Date representing the last day of the month at 23:59:59.999
 */
declare function endOfMonth(date: Date): Date;
/**
 * Get the start of the week for a given date
 * @param date - The date to get the week start for
 * @param config - Week configuration for week start day
 * @returns Date representing the start of the week at 00:00:00
 */
declare function startOfWeek(date: Date, config?: WeekConfig): Date;
/**
 * Get the end of the week for a given date
 * @param date - The date to get the week end for
 * @param config - Week configuration for week start day
 * @returns Date representing the end of the week at 23:59:59.999
 */
declare function endOfWeek(date: Date, config?: WeekConfig): Date;
/**
 * Get the start of the day for a given date
 * @param date - The date to get the start of day for
 * @returns Date at 00:00:00.000
 */
declare function startOfDay(date: Date): Date;
/**
 * Get the end of the day for a given date
 * @param date - The date to get the end of day for
 * @returns Date at 23:59:59.999
 */
declare function endOfDay(date: Date): Date;
/**
 * Get the number of days in a month
 * Accepts either a Date or (year, month) pair
 * @param yearOrDate - Year number or Date object
 * @param month - Month (1-12), only used if first param is year
 * @returns Number of days in the month (28-31)
 */
declare function getDaysInMonth(yearOrDate: number | Date, month?: number): number;
/**
 * Get the ISO 8601 week number for a given date
 * @param date - The date to get the week number for
 * @returns ISO week number (1-53)
 */
declare function getWeekNumber(date: Date): number;
/**
 * Get the day of the week for a given date
 * @param date - The date to get the day of week for
 * @returns Day of week (0 = Sunday, 6 = Saturday)
 */
declare function getDayOfWeek(date: Date): number;
/**
 * Convert a JavaScript Date to a CalendarDate object
 * @param date - JavaScript Date object
 * @returns CalendarDate with 1-based month (1-12)
 */
declare function toCalendarDate(date: Date): CalendarDate;
/**
 * Convert a CalendarDate to a JavaScript Date
 * @param calendarDate - CalendarDate with 1-based month (1-12)
 * @returns JavaScript Date object at 00:00:00 local time
 */
declare function fromCalendarDate(calendarDate: CalendarDate): Date;

/**
 * Generates a complete month data structure
 *
 * @param date - Any date within the target month
 * @param config - Week configuration (start day, locale)
 * @returns Complete month structure with weeks and overflow days
 */
declare function generateMonthData(date: Date, config: WeekConfig): MonthData;

/**
 * Generates a single week data structure
 *
 * @param date - Any date within the target week
 * @param config - Week configuration (start day, locale)
 * @returns Complete week structure with 7 days
 */
declare function generateWeekData(date: Date, config: WeekConfig): WeekData;

type CalendarTheme = {
    colors: {
        background: string;
        foreground: string;
        border: string;
        primary: string;
        primaryForeground: string;
        selected: string;
        selectedForeground: string;
        today: string;
        todayForeground: string;
        disabled: string;
        weekend: string;
        overflow: string;
        hover: string;
        pressed: string;
    };
    spacing: {
        cellSize: number;
        cellGap: number;
        padding: number;
        headerSpacing: number;
    };
    borderRadius: {
        cell: number;
        container: number;
    };
    fontSize: {
        day: number;
        weekday: number;
        header: number;
    };
    fontWeight: {
        regular: '400' | '500' | '600';
        bold: '600' | '700' | '800';
    };
};

declare const themes: {
    light: CalendarTheme;
    dark: CalendarTheme;
    ocean: CalendarTheme;
    forest: CalendarTheme;
    sunset: CalendarTheme;
    minimal: CalendarTheme;
};
type ThemeName = keyof typeof themes;

type CalendarMode = 'month' | 'week' | 'day';
type CalendarProps = {
    mode?: CalendarMode;
    value?: Date;
    onChange?: (date: Date) => void;
    defaultValue?: Date;
    selected?: Date;
    onSelect?: (date: Date) => void;
    defaultSelected?: Date;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    theme?: CalendarTheme | ThemeName;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabled?: boolean;
    renderDay?: (day: DayData) => React.ReactNode;
    showWeekNumbers?: boolean;
    highlightToday?: boolean;
    onMonthChange?: (year: number, month: number) => void;
    onWeekChange?: (weekNumber: number, year: number) => void;
    style?: ViewStyle;
    containerStyle?: ViewStyle;
};
type CalendarMonthProps = {
    value?: Date;
    onChange?: (date: Date) => void;
    defaultValue?: Date;
    selected?: Date;
    onSelect?: (date: Date) => void;
    defaultSelected?: Date;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    theme?: CalendarTheme | ThemeName;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabled?: boolean;
    renderDay?: (day: DayData) => React.ReactNode;
    onMonthChange?: (year: number, month: number) => void;
    style?: ViewStyle;
};
type CalendarWeekProps = {
    value?: Date;
    onChange?: (date: Date) => void;
    defaultValue?: Date;
    selected?: Date;
    onSelect?: (date: Date) => void;
    defaultSelected?: Date;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    theme?: CalendarTheme | ThemeName;
    showWeekNumber?: boolean;
    renderDay?: (day: DayData) => React.ReactNode;
    onWeekChange?: (weekNumber: number, year: number) => void;
    style?: ViewStyle;
};
type CalendarDayProps = {
    value?: Date;
    onChange?: (date: Date) => void;
    defaultValue?: Date;
    theme?: CalendarTheme | ThemeName;
    style?: ViewStyle;
};
type CalendarHeaderProps = {
    year: number;
    month?: number;
    weekNumber?: number;
    onPrevious: () => void;
    onNext: () => void;
    onToday?: () => void;
    theme: CalendarTheme;
};
type CalendarWeekDaysProps = {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    theme: CalendarTheme;
};
type CalendarDaysProps = {
    monthData: MonthData;
    selected?: Date;
    onSelectDate?: (date: Date) => void;
    renderDay?: (day: DayData) => React.ReactNode;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabled?: boolean;
    theme: CalendarTheme;
};

declare function CalendarMonth({ value, onChange, defaultValue, selected, onSelect, defaultSelected, weekStartsOn, theme: themeProp, minDate, maxDate, disabledDates, disabled, renderDay, onMonthChange, style, }: CalendarMonthProps): React$1.JSX.Element;

declare function CalendarWeek({ value, onChange, defaultValue, selected, onSelect, defaultSelected, weekStartsOn, theme: themeProp, showWeekNumber, renderDay, onWeekChange, style, }: CalendarWeekProps): React$1.JSX.Element;

declare function CalendarDay({ value, onChange, defaultValue, theme: themeProp, style, }: CalendarDayProps): React$1.JSX.Element;

declare function CalendarHeader({ year, month, weekNumber, onPrevious, onNext, onToday, theme, }: CalendarHeaderProps): React$1.JSX.Element;

declare function CalendarWeekDays({ weekStartsOn, theme }: CalendarWeekDaysProps): React$1.JSX.Element;

declare function CalendarDays({ monthData, selected, onSelectDate, renderDay, minDate, maxDate, disabledDates, disabled, theme, }: CalendarDaysProps): React$1.JSX.Element;

declare function Calendar(props: CalendarProps): React$1.JSX.Element;
declare namespace Calendar {
    var Month: typeof CalendarMonth;
    var Week: typeof CalendarWeek;
    var Day: typeof CalendarDay;
    var Header: typeof CalendarHeader;
    var WeekDays: typeof CalendarWeekDays;
    var Days: typeof CalendarDays;
}

type DayCellProps = {
    day: DayData;
    selected?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    theme: CalendarTheme;
};
declare function DayCell({ day, selected, disabled, onPress, onLongPress, theme, }: DayCellProps): React$1.JSX.Element;

type NavigationButtonProps = {
    direction: 'left' | 'right';
    onPress: () => void;
    theme: CalendarTheme;
    disabled?: boolean;
};
declare function NavigationButton({ direction, onPress, theme, disabled, }: NavigationButtonProps): React$1.JSX.Element;

type ThemeProviderProps = {
    theme: CalendarTheme | ThemeName;
    children: React$1.ReactNode;
};
declare function ThemeProvider({ theme, children }: ThemeProviderProps): React$1.JSX.Element;
declare function useTheme(): CalendarTheme;

export { Calendar, type CalendarDate, type CalendarDayProps, type CalendarMode, type CalendarMonthProps, type CalendarProps, type CalendarState, type CalendarTheme, type CalendarWeekProps, DayCell, type DayData, type MonthData, NavigationButton, type ThemeName, ThemeProvider, type UseCalendarOptions, type UseCalendarReturn, type UseMonthCalendarOptions, type UseMonthCalendarReturn, type UseWeekCalendarOptions, type UseWeekCalendarReturn, type WeekConfig, type WeekData, addDays, addMonths, addWeeks, createCalendarStore, endOfDay, endOfMonth, endOfWeek, fromCalendarDate, generateMonthData, generateWeekData, getDayOfWeek, getDaysInMonth, getWeekNumber, isSameDay, isSameMonth, isSameWeek, isToday, isWeekend, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, themes, toCalendarDate, useCalendar, useMonthCalendar, useTheme, useWeekCalendar };
