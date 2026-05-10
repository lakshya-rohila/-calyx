/**
 * Event Store
 * Zustand store for managing calendar events with immer middleware
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CalendarEvent, CreateEventInput, UpdateEventInput } from '../types/events';

type EventStore = {
  events: CalendarEvent[];
  addEvent: (input: CreateEventInput) => CalendarEvent;
  updateEvent: (id: string, input: UpdateEventInput) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => CalendarEvent | undefined;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByRange: (start: Date, end: Date) => CalendarEvent[];
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useEventStore = create<EventStore>()(
  immer((set, get) => ({
    events: [],

    addEvent: (input: CreateEventInput): CalendarEvent => {
      const now = new Date();
      const event: CalendarEvent = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      set((state) => {
        state.events.push(event);
      });

      return event;
    },

    updateEvent: (id: string, input: UpdateEventInput): void => {
      set((state) => {
        const event = state.events.find((e) => e.id === id);
        if (event) {
          Object.assign(event, input);
          event.updatedAt = new Date();
        }
      });
    },

    deleteEvent: (id: string): void => {
      set((state) => {
        state.events = state.events.filter((e) => e.id !== id);
      });
    },

    getEventById: (id: string): CalendarEvent | undefined => {
      return get().events.find((e) => e.id === id);
    },

    getEventsByDate: (date: Date): CalendarEvent[] => {
      const events = get().events;
      const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const nextDay = new Date(targetDay);
      nextDay.setDate(nextDay.getDate() + 1);

      return events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        // Event overlaps with target day
        return eventStart < nextDay && eventEnd >= targetDay;
      });
    },

    getEventsByRange: (start: Date, end: Date): CalendarEvent[] => {
      const events = get().events;

      return events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        // Event overlaps with range
        return eventStart < end && eventEnd >= start;
      });
    },
  }))
);
