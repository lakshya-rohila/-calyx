import { renderHook } from '@testing-library/react-native';
import { useAgendaGrouping } from '../useAgendaGrouping';
import type { CalendarEvent } from '../../types/events';

const mockEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: '1',
  title: 'Test Event',
  startDate: new Date(2026, 4, 10, 9, 0),
  endDate: new Date(2026, 4, 10, 10, 0),
  isAllDay: false,
  color: '#007AFF',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('useAgendaGrouping', () => {
  it('groups events by day', () => {
    const events = [
      mockEvent({ id: '1', startDate: new Date(2026, 4, 10, 9, 0) }),
      mockEvent({ id: '2', startDate: new Date(2026, 4, 10, 14, 0) }),
      mockEvent({ id: '3', startDate: new Date(2026, 4, 11, 10, 0) }),
    ];
    const startDate = new Date(2026, 4, 10);
    const config = { groupBy: 'day' as const, showEmptyDays: false, futureMonths: 1 };

    const { result } = renderHook(() =>
      useAgendaGrouping(events, startDate, config)
    );

    expect(result.current.length).toBeGreaterThanOrEqual(2);

    const may10Section = result.current.find(s =>
      s.date.getDate() === 10 && s.date.getMonth() === 4
    );
    const may11Section = result.current.find(s =>
      s.date.getDate() === 11 && s.date.getMonth() === 4
    );

    expect(may10Section?.events).toHaveLength(2);
    expect(may11Section?.events).toHaveLength(1);
  });

  it('filters empty days when showEmptyDays is false', () => {
    const events = [
      mockEvent({ id: '1', startDate: new Date(2026, 4, 10, 9, 0) }),
    ];
    const startDate = new Date(2026, 4, 10);
    const config = { groupBy: 'day' as const, showEmptyDays: false, futureMonths: 1 };

    const { result } = renderHook(() =>
      useAgendaGrouping(events, startDate, config)
    );

    // Should only have sections with events
    expect(result.current.every(section => section.events.length > 0)).toBe(true);
  });

  it('sorts events by all-day first, then start time', () => {
    const events = [
      mockEvent({ id: '1', startDate: new Date(2026, 4, 10, 14, 0), isAllDay: false }),
      mockEvent({ id: '2', startDate: new Date(2026, 4, 10, 9, 0), isAllDay: false }),
      mockEvent({ id: '3', startDate: new Date(2026, 4, 10, 0, 0), isAllDay: true }),
    ];
    const startDate = new Date(2026, 4, 10);
    const config = { groupBy: 'day' as const, showEmptyDays: false, futureMonths: 1 };

    const { result } = renderHook(() =>
      useAgendaGrouping(events, startDate, config)
    );

    const may10Section = result.current.find(s => s.date.getDate() === 10);
    expect(may10Section?.events[0].id).toBe('3'); // All-day first
    expect(may10Section?.events[1].id).toBe('2'); // 9am
    expect(may10Section?.events[2].id).toBe('1'); // 2pm
  });
});
