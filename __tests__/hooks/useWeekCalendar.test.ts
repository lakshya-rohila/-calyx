import { renderHook, act } from '@testing-library/react-hooks';
import { useWeekCalendar } from '../../src/hooks/useWeekCalendar';
import { createCalendarStore } from '../../src/store/calendar-store';

describe('useWeekCalendar', () => {
  let store: ReturnType<typeof createCalendarStore>;

  beforeEach(() => {
    store = createCalendarStore();
  });

  it('generates week data', () => {
    const { result } = renderHook(() => useWeekCalendar({ store }));

    expect(result.current.weekData).toBeDefined();
    expect(result.current.weekData.days).toHaveLength(7);
  });

  it('extracts week number', () => {
    const initialDate = new Date(2026, 4, 13); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate, store }));

    expect(result.current.weekNumber).toBe(20);
  });

  it('extracts year', () => {
    const initialDate = new Date(2026, 4, 13);
    const { result } = renderHook(() => useWeekCalendar({ initialDate, store }));

    expect(result.current.year).toBe(2026);
  });

  it('goes to next week', () => {
    const initialDate = new Date(2026, 4, 13); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate, store }));

    act(() => {
      result.current.goToNextWeek();
    });

    expect(result.current.weekNumber).toBe(21);
  });

  it('goes to previous week', () => {
    const initialDate = new Date(2026, 4, 13); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate, store }));

    act(() => {
      result.current.goToPreviousWeek();
    });

    expect(result.current.weekNumber).toBe(19);
  });

  it('goes to specific week', () => {
    const { result } = renderHook(() => useWeekCalendar({ store }));

    act(() => {
      result.current.goToWeek(1, 2025);
    });

    expect(result.current.weekNumber).toBe(1);
    expect(result.current.year).toBe(2025);
  });

  it('calls onWeekChange callback', () => {
    const onWeekChange = jest.fn();
    const initialDate = new Date(2026, 4, 13);
    const { result } = renderHook(() => useWeekCalendar({ initialDate, onWeekChange, store }));

    act(() => {
      result.current.goToNextWeek();
    });

    expect(onWeekChange).toHaveBeenCalled();
  });

  it('generates week at offset', () => {
    const initialDate = new Date(2026, 4, 13); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate, store }));

    const nextWeekData = result.current.generateWeekAtOffset(1);
    expect(nextWeekData.weekNumber).toBe(21);

    const prevWeekData = result.current.generateWeekAtOffset(-1);
    expect(prevWeekData.weekNumber).toBe(19);
  });

  it('generates unique week keys', () => {
    const initialDate = new Date(2026, 4, 13);
    const { result } = renderHook(() => useWeekCalendar({ initialDate, store }));

    const key0 = result.current.getWeekKey(0);
    const key1 = result.current.getWeekKey(1);
    const keyNeg1 = result.current.getWeekKey(-1);

    expect(key0).not.toBe(key1);
    expect(key0).not.toBe(keyNeg1);
    expect(key1).not.toBe(keyNeg1);
  });

  it('memoizes weekData when currentDate does not change', () => {
    const { result, rerender } = renderHook(() => useWeekCalendar({ store }));

    const firstWeekData = result.current.weekData;
    rerender();
    const secondWeekData = result.current.weekData;

    expect(firstWeekData).toBe(secondWeekData);
  });
});
