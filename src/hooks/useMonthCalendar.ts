import { useCallback, useMemo, useEffect } from 'react';
import { useCalendar } from './useCalendar';
import { generateMonthData } from '../engine/month-generator';
import { addMonths } from '../engine/calendar-math';
import { createCalendarStore, useCalendarStore } from '../store/calendar-store';
import type { UseCalendarOptions, UseCalendarReturn } from './useCalendar';
import type { MonthData } from '../engine/types';
import type { CalendarState } from '../store/calendar-store';

export type UseMonthCalendarOptions = UseCalendarOptions & {
  onMonthChange?: (year: number, month: number) => void;
};

export type UseMonthCalendarReturn = UseCalendarReturn & {
  // Month-specific state
  monthData: MonthData;
  year: number;
  month: number;

  // Month navigation
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToMonth: (year: number, month: number) => void;

  // Virtualization helpers
  getMonthKey: (offset: number) => string;
  generateMonthAtOffset: (offset: number) => MonthData;
};

export function useMonthCalendar(options: UseMonthCalendarOptions = {}): UseMonthCalendarReturn {
  const { onMonthChange, store = useCalendarStore, ...calendarOptions } = options;

  // Base calendar hook
  const calendar = useCalendar({ ...calendarOptions, store });

  // Store actions
  const goToNextMonthAction = store((state: CalendarState) => state.goToNextMonth);
  const goToPreviousMonthAction = store((state: CalendarState) => state.goToPreviousMonth);

  // Generate month data (memoized)
  const monthData = useMemo(() => {
    return generateMonthData(calendar.currentDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);

  // Extract year and month
  const year = monthData.year;
  const month = monthData.month;

  // Call onMonthChange when month changes
  useEffect(() => {
    onMonthChange?.(year, month);
  }, [year, month, onMonthChange]);

  // Month navigation
  const goToNextMonth = useCallback(() => {
    goToNextMonthAction();
  }, [goToNextMonthAction]);

  const goToPreviousMonth = useCallback(() => {
    goToPreviousMonthAction();
  }, [goToPreviousMonthAction]);

  const goToMonth = useCallback((targetYear: number, targetMonth: number) => {
    const targetDate = new Date(targetYear, targetMonth - 1, 1);
    calendar.setCurrentDate(targetDate);
  }, [calendar]);

  // Virtualization helpers
  const generateMonthAtOffset = useCallback((offset: number): MonthData => {
    const targetDate = addMonths(calendar.currentDate, offset);
    return generateMonthData(targetDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);

  const getMonthKey = useCallback((offset: number): string => {
    const targetDate = addMonths(calendar.currentDate, offset);
    return `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}`;
  }, [calendar.currentDate]);

  return {
    ...calendar,
    monthData,
    year,
    month,
    goToNextMonth,
    goToPreviousMonth,
    goToMonth,
    generateMonthAtOffset,
    getMonthKey,
  };
}
