import { renderHook, act } from '@testing-library/react-native';
import { useCalendar } from '../../src/hooks/useCalendar';
import { createCalendarStore } from '../../src/store/calendar-store';

describe('useCalendar', () => {
  // Use a fresh store for each test to avoid shared state
  let store: ReturnType<typeof createCalendarStore>;

  beforeEach(() => {
    store = createCalendarStore();
  });

  it('initializes with default date (today)', () => {
    const { result } = renderHook(() => useCalendar({ store }));

    expect(result.current.currentDate).toBeInstanceOf(Date);
    expect(result.current.selectedDate).toBeNull();
  });

  it('initializes with custom initial date', () => {
    const initialDate = new Date(2026, 4, 10);
    const { result } = renderHook(() => useCalendar({ initialDate, store }));

    expect(result.current.currentDate.toDateString()).toBe(initialDate.toDateString());
  });

  it('initializes with custom weekStartsOn', () => {
    const { result } = renderHook(() => useCalendar({ weekStartsOn: 1, store }));

    expect(result.current.weekConfig.weekStartsOn).toBe(1);
  });

  it('sets current date', () => {
    const { result } = renderHook(() => useCalendar({ store }));
    const newDate = new Date(2026, 5, 15);

    act(() => {
      result.current.setCurrentDate(newDate);
    });

    expect(result.current.currentDate.toDateString()).toBe(newDate.toDateString());
  });

  it('selects a date', () => {
    const { result } = renderHook(() => useCalendar({ store }));
    const dateToSelect = new Date(2026, 4, 15);

    act(() => {
      result.current.selectDate(dateToSelect);
    });

    expect(result.current.selectedDate).not.toBeNull();
    expect(result.current.selectedDate?.toDateString()).toBe(dateToSelect.toDateString());
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useCalendar({ store }));
    const dateToSelect = new Date(2026, 4, 15);

    act(() => {
      result.current.selectDate(dateToSelect);
    });

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedDate).toBeNull();
  });

  it('goes to today', () => {
    const initialDate = new Date(2025, 0, 1);
    const { result } = renderHook(() => useCalendar({ initialDate, store }));

    act(() => {
      result.current.goToToday();
    });

    const today = new Date();
    expect(result.current.currentDate.toDateString()).toBe(today.toDateString());
  });

  it('isDateSelected returns true for selected date', () => {
    const { result } = renderHook(() => useCalendar({ store }));
    const dateToSelect = new Date(2026, 4, 15);

    act(() => {
      result.current.selectDate(dateToSelect);
    });

    expect(result.current.isDateSelected(dateToSelect)).toBe(true);
    expect(result.current.isDateSelected(new Date(2026, 4, 16))).toBe(false);
  });

  it('calls onDateChange callback', () => {
    const onDateChange = jest.fn();
    const { result } = renderHook(() => useCalendar({ onDateChange, store }));
    const newDate = new Date(2026, 5, 15);

    act(() => {
      result.current.setCurrentDate(newDate);
    });

    expect(onDateChange).toHaveBeenCalledWith(newDate);
  });

  it('calls onDateSelect callback', () => {
    const onDateSelect = jest.fn();
    const { result } = renderHook(() => useCalendar({ onDateSelect, store }));
    const dateToSelect = new Date(2026, 4, 15);

    act(() => {
      result.current.selectDate(dateToSelect);
    });

    expect(onDateSelect).toHaveBeenCalledWith(dateToSelect);
  });
});
