import { useEffect, useCallback, useMemo } from 'react';
import { createCalendarStore } from '../store/calendar-store';
import { isSameDay } from '../engine/calendar-math';
import type { WeekConfig } from '../engine/types';
import type { CalendarState } from '../store/calendar-store';

export type UseCalendarOptions = {
  initialDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onDateChange?: (date: Date) => void;
  onDateSelect?: (date: Date | null) => void;
  store?: ReturnType<typeof createCalendarStore>;
};

export type UseCalendarReturn = {
  // State
  currentDate: Date;
  selectedDate: Date | null;
  weekConfig: WeekConfig;

  // Actions
  setCurrentDate: (date: Date) => void;
  selectDate: (date: Date | null) => void;
  clearSelection: () => void;
  goToToday: () => void;
  goToDate: (date: Date) => void;

  // Utilities
  isDateSelected: (date: Date) => boolean;
  isDateCurrent: (date: Date) => boolean;
};

// Default store instance for when no store is provided
const defaultStoreInstance = createCalendarStore();

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const {
    initialDate,
    weekStartsOn,
    onDateChange,
    onDateSelect,
    store = defaultStoreInstance,
  } = options;

  // Subscribe to store slices
  const currentDate = store((state: CalendarState) => state.currentDate);
  const selectedDate = store((state: CalendarState) => state.selectedDate);
  const weekConfig = store((state: CalendarState) => state.weekConfig);
  const setCurrentDateAction = store((state: CalendarState) => state.setCurrentDate);
  const setSelectedDateAction = store((state: CalendarState) => state.setSelectedDate);
  const clearSelectionAction = store((state: CalendarState) => state.clearSelection);
  const goToTodayAction = store((state: CalendarState) => state.goToToday);
  const goToDateAction = store((state: CalendarState) => state.goToDate);
  const setWeekStartsOnAction = store((state: CalendarState) => state.setWeekStartsOn);

  // Initialize on mount
  useEffect(() => {
    if (initialDate) {
      setCurrentDateAction(initialDate);
    }
    if (weekStartsOn !== undefined) {
      setWeekStartsOnAction(weekStartsOn);
    }
  }, []); // Only run once on mount

  // Call onDateChange when currentDate changes
  useEffect(() => {
    onDateChange?.(currentDate);
  }, [currentDate, onDateChange]);

  // Call onDateSelect when selectedDate changes
  useEffect(() => {
    if (selectedDate !== null) {
      onDateSelect?.(selectedDate);
    }
  }, [selectedDate, onDateSelect]);

  // Wrapped actions
  const setCurrentDate = useCallback((date: Date) => {
    setCurrentDateAction(date);
  }, [setCurrentDateAction]);

  const selectDate = useCallback((date: Date | null) => {
    setSelectedDateAction(date);
  }, [setSelectedDateAction]);

  const clearSelection = useCallback(() => {
    clearSelectionAction();
  }, [clearSelectionAction]);

  const goToToday = useCallback(() => {
    goToTodayAction();
  }, [goToTodayAction]);

  const goToDate = useCallback((date: Date) => {
    goToDateAction(date);
  }, [goToDateAction]);

  // Utility functions
  const isDateSelected = useCallback((date: Date): boolean => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  }, [selectedDate]);

  const isDateCurrent = useCallback((date: Date): boolean => {
    return isSameDay(date, currentDate);
  }, [currentDate]);

  return {
    currentDate,
    selectedDate,
    weekConfig,
    setCurrentDate,
    selectDate,
    clearSelection,
    goToToday,
    goToDate,
    isDateSelected,
    isDateCurrent,
  };
}
