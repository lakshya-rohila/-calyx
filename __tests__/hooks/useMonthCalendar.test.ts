import { renderHook, act } from '@testing-library/react-native';
import { useMonthCalendar } from '../../src/hooks/useMonthCalendar';
import { createCalendarStore } from '../../src/store/calendar-store';

describe('useMonthCalendar', () => {
  let store: ReturnType<typeof createCalendarStore>;

  beforeEach(() => {
    store = createCalendarStore();
  });

  it('generates month data', () => {
    const { result } = renderHook(() => useMonthCalendar({ store }));

    expect(result.current.monthData).toBeDefined();
    expect(result.current.monthData.weeks.length).toBeGreaterThan(0);
  });

  it('extracts year and month', () => {
    const initialDate = new Date(2026, 4, 15);
    const { result } = renderHook(() => useMonthCalendar({ initialDate, store }));

    expect(result.current.year).toBe(2026);
    expect(result.current.month).toBe(5);
  });

  it('goes to next month', () => {
    const initialDate = new Date(2026, 4, 15);
    const { result } = renderHook(() => useMonthCalendar({ initialDate, store }));

    act(() => {
      result.current.goToNextMonth();
    });

    expect(result.current.month).toBe(6); // June
    expect(result.current.year).toBe(2026);
  });

  it('goes to previous month', () => {
    const initialDate = new Date(2026, 4, 15);
    const { result } = renderHook(() => useMonthCalendar({ initialDate, store }));

    act(() => {
      result.current.goToPreviousMonth();
    });

    expect(result.current.month).toBe(4); // April
    expect(result.current.year).toBe(2026);
  });

  it('goes to specific month', () => {
    const { result } = renderHook(() => useMonthCalendar({ store }));

    act(() => {
      result.current.goToMonth(2025, 12);
    });

    expect(result.current.year).toBe(2025);
    expect(result.current.month).toBe(12);
  });

  it('calls onMonthChange callback', () => {
    const onMonthChange = jest.fn();
    const initialDate = new Date(2026, 4, 15);
    const { result } = renderHook(() => useMonthCalendar({ initialDate, onMonthChange, store }));

    act(() => {
      result.current.goToNextMonth();
    });

    expect(onMonthChange).toHaveBeenCalledWith(2026, 6);
  });

  it('generates month at offset', () => {
    const initialDate = new Date(2026, 4, 15);
    const { result } = renderHook(() => useMonthCalendar({ initialDate, store }));

    const nextMonthData = result.current.generateMonthAtOffset(1);
    expect(nextMonthData.month).toBe(6); // June

    const prevMonthData = result.current.generateMonthAtOffset(-1);
    expect(prevMonthData.month).toBe(4); // April
  });

  it('generates unique month keys', () => {
    const initialDate = new Date(2026, 4, 15);
    const { result } = renderHook(() => useMonthCalendar({ initialDate, store }));

    const key0 = result.current.getMonthKey(0);
    const key1 = result.current.getMonthKey(1);
    const keyNeg1 = result.current.getMonthKey(-1);

    expect(key0).not.toBe(key1);
    expect(key0).not.toBe(keyNeg1);
    expect(key1).not.toBe(keyNeg1);
  });

  it('memoizes monthData when currentDate does not change', () => {
    const { result, rerender } = renderHook(() => useMonthCalendar({ store }));

    const firstMonthData = result.current.monthData;
    rerender();
    const secondMonthData = result.current.monthData;

    expect(firstMonthData).toBe(secondMonthData); // Same reference
  });
});
