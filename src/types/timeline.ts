/**
 * Timeline View Types
 * Phase 4: Advanced Views
 */

export type TimelineConfig = {
  startHour?: number;        // Default: 0 (midnight)
  endHour?: number;          // Default: 24
  slotDuration?: number;     // Minutes: 15, 30, 60 (default: 30)
  showCurrentTime?: boolean; // Red line indicator (default: true)
  businessHours?: {
    start: number;           // Default: 9
    end: number;             // Default: 17
  };
  scrollToNow?: boolean;     // Auto-scroll to current time (default: true)
};

export type TimelineEventLayout = {
  event: import('./events').CalendarEvent;
  top: number;           // Pixel offset from day start
  height: number;        // Pixel height
  left: number;          // Percentage (0-100) for column position
  width: number;         // Percentage (0-100) for column width
  columnIndex: number;   // Which conflict column (0, 1, 2...)
  totalColumns: number;  // Total overlapping columns
};

export const DEFAULT_TIMELINE_CONFIG: Required<TimelineConfig> = {
  startHour: 0,
  endHour: 24,
  slotDuration: 30,
  showCurrentTime: true,
  businessHours: { start: 9, end: 17 },
  scrollToNow: true,
};
