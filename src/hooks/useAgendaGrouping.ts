import { useMemo } from 'react';
import {
  addDays,
  addMonths,
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';
import type { CalendarEvent } from '../types/events';
import type { AgendaConfig, AgendaSection } from '../types/agenda';

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatSectionTitle(date: Date): string {
  if (isToday(date)) {
    return `TODAY - ${format(date, 'MMMM d, yyyy')}`;
  }
  if (isTomorrow(date)) {
    return `TOMORROW - ${format(date, 'MMMM d, yyyy')}`;
  }
  if (isThisWeek(date, { weekStartsOn: 0 })) {
    return `${format(date, 'EEEE')} - ${format(date, 'MMMM d, yyyy')}`;
  }
  return format(date, 'MMMM d, yyyy').toUpperCase();
}

export function useAgendaGrouping(
  events: CalendarEvent[],
  startDate: Date,
  config: Partial<AgendaConfig>
): AgendaSection[] {
  return useMemo(() => {
    const {
      groupBy = 'day',
      showEmptyDays = false,
      futureMonths = 3,
    } = config;

    // Calculate end date
    const endDate = addMonths(startDate, futureMonths);

    // Generate all dates in range
    const allDates: Date[] = [];
    let currentDate = startOfDay(startDate);
    const finalDate = endOfDay(endDate);

    while (currentDate <= finalDate) {
      allDates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    // Group events by day
    const sections: AgendaSection[] = allDates.map(date => {
      const dayEvents = events.filter(event => {
        // Event is on this day if it starts on this day OR spans this day
        return (
          isSameDay(event.startDate, date) ||
          (event.startDate < date && event.endDate >= date)
        );
      }).sort((a, b) => {
        // All-day events first
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        // Then by start time
        return a.startDate.getTime() - b.startDate.getTime();
      });

      return {
        title: formatSectionTitle(date),
        date,
        events: dayEvents,
      };
    });

    // Filter empty days if configured
    const filtered = showEmptyDays
      ? sections
      : sections.filter(s => s.events.length > 0);

    // TODO: Implement week/month grouping if groupBy is 'week' or 'month'
    // For now, just return day grouping
    return filtered;
  }, [events, startDate, config]);
}
