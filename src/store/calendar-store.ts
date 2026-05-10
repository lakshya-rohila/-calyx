import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { addMonths, addWeeks } from '../engine/calendar-math';
import type { WeekConfig } from '../engine/types';

export type CalendarState = {
  // Current date context
  currentDate: Date;
  selectedDate: Date | null;

  // Configuration
  weekConfig: WeekConfig;

  // Actions - Navigation
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToDate: (date: Date) => void;

  // Actions - Selection
  setSelectedDate: (date: Date | null) => void;
  clearSelection: () => void;

  // Actions - Configuration
  setWeekConfig: (config: WeekConfig) => void;
  setWeekStartsOn: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
};

/**
 * Creates a new calendar store instance
 * Supports multiple independent calendars in the same app
 */
export const createCalendarStore = (initialConfig?: Partial<WeekConfig>) => {
  return create<CalendarState>()(
    immer((set) => ({
      // Initial state
      currentDate: new Date(),
      selectedDate: null,
      weekConfig: {
        weekStartsOn: initialConfig?.weekStartsOn ?? 0,
        locale: initialConfig?.locale,
      },

      // Navigation actions
      setCurrentDate: (date) =>
        set((state) => {
          state.currentDate = date;
        }),

      goToToday: () =>
        set((state) => {
          state.currentDate = new Date();
        }),

      goToNextMonth: () =>
        set((state) => {
          state.currentDate = addMonths(state.currentDate, 1);
        }),

      goToPreviousMonth: () =>
        set((state) => {
          state.currentDate = addMonths(state.currentDate, -1);
        }),

      goToNextWeek: () =>
        set((state) => {
          state.currentDate = addWeeks(state.currentDate, 1);
        }),

      goToPreviousWeek: () =>
        set((state) => {
          state.currentDate = addWeeks(state.currentDate, -1);
        }),

      goToDate: (date) =>
        set((state) => {
          state.currentDate = date;
        }),

      // Selection actions
      setSelectedDate: (date) =>
        set((state) => {
          state.selectedDate = date;
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedDate = null;
        }),

      // Configuration actions
      setWeekConfig: (config) =>
        set((state) => {
          state.weekConfig = config;
        }),

      setWeekStartsOn: (day) =>
        set((state) => {
          state.weekConfig.weekStartsOn = day;
        }),
    }))
  );
};

/**
 * Default global calendar store
 * Most apps only need one calendar
 */
export const useCalendarStore = createCalendarStore();
