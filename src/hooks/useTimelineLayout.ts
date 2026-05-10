import { useMemo } from 'react';
import type { CalendarEvent } from '../types/events';
import type { TimelineConfig, TimelineEventLayout } from '../types/timeline';

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function useTimelineLayout(
  events: CalendarEvent[],
  date: Date,
  config: Partial<TimelineConfig>
): TimelineEventLayout[] {
  return useMemo(() => {
    const { startHour = 0, endHour = 24 } = config;
    const pixelsPerHour = 50; // Each hour = 50px (30min slot = 25px)

    // 1. Filter events for current day
    const dayEvents = events.filter(event => {
      // Event is on this day if it starts on this day OR spans across this day
      return (
        isSameDay(event.startDate, date) ||
        (event.startDate < date && event.endDate >= date)
      );
    });

    if (dayEvents.length === 0) {
      return [];
    }

    // 2. Sort by start time, then by duration (longer first)
    const sorted = [...dayEvents].sort((a, b) => {
      const startDiff = a.startDate.getTime() - b.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      const durationA = a.endDate.getTime() - a.startDate.getTime();
      const durationB = b.endDate.getTime() - b.startDate.getTime();
      return durationB - durationA;
    });

    // 3. Detect conflicts and assign columns
    const eventToColumn = new Map<string, number>();
    const columns: CalendarEvent[][] = [];

    for (const event of sorted) {
      // Find first available column where this event doesn't conflict
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        // Check if this event conflicts with ANY event in this column
        const hasConflict = columns[columnIndex].some(existingEvent =>
          existingEvent.startDate < event.endDate && existingEvent.endDate > event.startDate
        );
        if (!hasConflict) {
          break; // No conflict, can use this column
        }
        columnIndex++;
      }

      // Create new column if needed
      if (columnIndex === columns.length) {
        columns.push([]);
      }

      columns[columnIndex].push(event);
      eventToColumn.set(event.id, columnIndex);
    }

    // 4. Calculate layout positions for all events
    const layouts: TimelineEventLayout[] = [];

    for (const event of sorted) {
      const columnIndex = eventToColumn.get(event.id)!;

      // Calculate pixel positions
      const startMinutes = event.startDate.getHours() * 60 + event.startDate.getMinutes();
      const endMinutes = event.endDate.getHours() * 60 + event.endDate.getMinutes();
      const durationMinutes = endMinutes - startMinutes;

      const top = ((startMinutes / 60) - startHour) * pixelsPerHour;
      const height = Math.max(30, (durationMinutes / 60) * pixelsPerHour);

      // Find total columns for this event's timeframe (for width calculation)
      const overlappingEvents = sorted.filter(e =>
        e.startDate < event.endDate && e.endDate > event.startDate
      );
      const maxColumns = Math.max(...overlappingEvents.map(e => {
        return eventToColumn.get(e.id)! + 1;
      }));

      const totalColumns = Math.max(maxColumns, 1);

      layouts.push({
        event,
        top,
        height,
        left: (columnIndex / totalColumns) * 100,
        width: (1 / totalColumns) * 100,
        columnIndex,
        totalColumns,
      });
    }

    return layouts;
  }, [events, date, config]);
}
