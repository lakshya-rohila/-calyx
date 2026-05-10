/**
 * Agenda View Types
 * Phase 4: Advanced Views
 */

import type { CalendarEvent } from './events';

export type AgendaConfig = {
  groupBy?: 'day' | 'week' | 'month';  // Default: 'day'
  showEmptyDays?: boolean;              // Show days with no events (default: false)
  futureMonths?: number;                // Months to load ahead (default: 3)
  dateFormat?: string;                  // Custom date format for headers
};

export type AgendaSection = {
  title: string;         // "Today", "May 10, 2026", "Week of May 10"
  date: Date;            // Section start date
  events: CalendarEvent[];
};

export const DEFAULT_AGENDA_CONFIG: Required<AgendaConfig> = {
  groupBy: 'day',
  showEmptyDays: false,
  futureMonths: 3,
  dateFormat: 'MMMM d, yyyy',
};
