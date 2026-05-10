import { useCallback, useMemo, useEffect } from 'react';
import { useCalendar } from './useCalendar';
import { generateWeekData } from '../engine/week-generator';
import { addWeeks, getWeekNumber } from '../engine/calendar-math';
import { createCalendarStore, useCalendarStore } from '../store/calendar-store';
import type { UseCalendarOptions, UseCalendarReturn } from './useCalendar';
import type { WeekData } from '../engine/types';
import type { CalendarState } from '../store/calendar-store';

export type UseWeekCalendarOptions = UseCalendarOptions & {
  onWeekChange?: (weekNumber: number, year: number) => void;
};

export type UseWeekCalendarReturn = UseCalendarReturn & {
  // Week-specific state
  weekData: WeekData;
  weekNumber: number;
  year: number;

  // Week navigation
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToWeek: (weekNumber: number, year: number) => void;

  // Virtualization helpers
  getWeekKey: (offset: number) => string;
  generateWeekAtOffset: (offset: number) => WeekData;
};

export function useWeekCalendar(options: UseWeekCalendarOptions = {}): UseWeekCalendarReturn {
  const { onWeekChange, store = useCalendarStore, ...calendarOptions } = options;

  // Base calendar hook
  const calendar = useCalendar({ ...calendarOptions, store });

  // Store actions
  const goToNextWeekAction = store((state: CalendarState) => state.goToNextWeek);
  const goToPreviousWeekAction = store((state: CalendarState) => state.goToPreviousWeek);

  // Generate week data (memoized)
  const weekData = useMemo(() => {
    return generateWeekData(calendar.currentDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);

  // Extract week number and year
  const weekNumber = weekData.weekNumber;
  const year = calendar.currentDate.getFullYear();

  // Call onWeekChange when week changes
  useEffect(() => {
    onWeekChange?.(weekNumber, year);
  }, [weekNumber, year, onWeekChange]);

  // Week navigation
  const goToNextWeek = useCallback(() => {
    goToNextWeekAction();
  }, [goToNextWeekAction]);

  const goToPreviousWeek = useCallback(() => {
    goToPreviousWeekAction();
  }, [goToPreviousWeekAction]);

  const goToWeek = useCallback((targetWeekNumber: number, targetYear: number) => {
    // Find a date in the target week
    // Simple approach: use Jan 4 of target year (always in week 1) then add weeks
    const jan4 = new Date(targetYear, 0, 4);
    const weeksToAdd = targetWeekNumber - getWeekNumber(jan4);
    const targetDate = addWeeks(jan4, weeksToAdd);
    calendar.setCurrentDate(targetDate);
  }, [calendar]);

  // Virtualization helpers
  const generateWeekAtOffset = useCallback((offset: number): WeekData => {
    const targetDate = addWeeks(calendar.currentDate, offset);
    return generateWeekData(targetDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);

  const getWeekKey = useCallback((offset: number): string => {
    const targetDate = addWeeks(calendar.currentDate, offset);
    return `${targetDate.getFullYear()}-W${getWeekNumber(targetDate)}`;
  }, [calendar.currentDate]);

  return {
    ...calendar,
    weekData,
    weekNumber,
    year,
    goToNextWeek,
    goToPreviousWeek,
    goToWeek,
    generateWeekAtOffset,
    getWeekKey,
  };
}
