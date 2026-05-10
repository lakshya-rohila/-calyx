/**
 * Calendar Event Type
 * Core event model for Phase 3
 */

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  color: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEventInput = Omit<
  CalendarEvent,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateEventInput = Partial<
  Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>
>;
