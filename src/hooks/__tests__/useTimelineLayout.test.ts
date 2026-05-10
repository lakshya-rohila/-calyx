import { renderHook } from '@testing-library/react-native';
import { useTimelineLayout } from '../useTimelineLayout';
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

describe('useTimelineLayout', () => {
  it('calculates correct pixel positions for single event', () => {
    const events = [mockEvent()];
    const date = new Date(2026, 4, 10);
    const config = { startHour: 0, endHour: 24, slotDuration: 30 };

    const { result } = renderHook(() =>
      useTimelineLayout(events, date, config)
    );

    const layout = result.current[0];
    expect(layout).toBeDefined();
    expect(layout?.event.id).toBe('1');
    expect(layout?.top).toBe(450); // 9 hours * 50px per hour
    expect(layout?.height).toBe(50); // 1 hour * 50px
    expect(layout?.left).toBe(0);
    expect(layout?.width).toBe(100);
    expect(layout?.columnIndex).toBe(0);
    expect(layout?.totalColumns).toBe(1);
  });

  it('detects conflicts and assigns columns', () => {
    const events = [
      mockEvent({
        id: '1',
        startDate: new Date(2026, 4, 10, 9, 0),
        endDate: new Date(2026, 4, 10, 11, 0),
      }),
      mockEvent({
        id: '2',
        startDate: new Date(2026, 4, 10, 10, 0),
        endDate: new Date(2026, 4, 10, 12, 0),
      }),
    ];
    const date = new Date(2026, 4, 10);
    const config = { startHour: 0, endHour: 24, slotDuration: 30 };

    const { result } = renderHook(() =>
      useTimelineLayout(events, date, config)
    );

    expect(result.current).toHaveLength(2);

    const layout1 = result.current[0];
    const layout2 = result.current[1];

    // Events overlap, should be in different columns
    expect(layout1).toBeDefined();
    expect(layout2).toBeDefined();
    expect(layout1?.columnIndex).toBe(0);
    expect(layout2?.columnIndex).toBe(1);
    expect(layout1?.width).toBe(50); // 100% / 2 columns
    expect(layout2?.width).toBe(50);
    expect(layout1?.left).toBe(0);
    expect(layout2?.left).toBe(50);
  });

  it('handles non-overlapping events in same column', () => {
    const events = [
      mockEvent({
        id: '1',
        startDate: new Date(2026, 4, 10, 9, 0),
        endDate: new Date(2026, 4, 10, 10, 0),
      }),
      mockEvent({
        id: '2',
        startDate: new Date(2026, 4, 10, 11, 0),
        endDate: new Date(2026, 4, 10, 12, 0),
      }),
    ];
    const date = new Date(2026, 4, 10);
    const config = { startHour: 0, endHour: 24, slotDuration: 30 };

    const { result } = renderHook(() =>
      useTimelineLayout(events, date, config)
    );

    // No overlap, both can be in column 0, full width
    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeDefined();
    expect(result.current[0]?.columnIndex).toBe(0);
    expect(result.current[1]?.columnIndex).toBe(0);
    expect(result.current[0]?.width).toBe(100);
    expect(result.current[1]?.width).toBe(100);
  });
});
