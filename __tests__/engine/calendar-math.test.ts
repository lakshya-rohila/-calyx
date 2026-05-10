import {
  isSameDay,
  isToday,
  isWeekend,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  getDaysInMonth,
  toCalendarDate,
  fromCalendarDate,
} from '../../src/engine/calendar-math';

describe('calendar-math', () => {
  describe('isSameDay', () => {
    it('should return true for same dates', () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 18, 45);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      const saturday = new Date(2024, 0, 6); // Jan 6, 2024 is Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it('should return true for Sunday', () => {
      const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it('should return false for Monday', () => {
      const monday = new Date(2024, 0, 8); // Jan 8, 2024 is Monday
      expect(isWeekend(monday)).toBe(false);
    });

    it('should return false for Friday', () => {
      const friday = new Date(2024, 0, 5); // Jan 5, 2024 is Friday
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe('addMonths', () => {
    it('should add positive months', () => {
      const date = new Date(2024, 0, 15);
      const result = addMonths(date, 3);
      expect(result.getMonth()).toBe(3); // April
      expect(result.getDate()).toBe(15);
    });

    it('should subtract months with negative value', () => {
      const date = new Date(2024, 5, 15);
      const result = addMonths(date, -2);
      expect(result.getMonth()).toBe(3); // April
      expect(result.getDate()).toBe(15);
    });

    it('should handle year boundary', () => {
      const date = new Date(2024, 10, 15); // November
      const result = addMonths(date, 3);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
    });
  });

  describe('startOfMonth', () => {
    it('should return first day of month', () => {
      const date = new Date(2024, 0, 15, 10, 30);
      const result = startOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2024);
    });

    it('should set time to start of day', () => {
      const date = new Date(2024, 5, 15, 23, 59, 59);
      const result = startOfMonth(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfMonth', () => {
    it('should return last day of January', () => {
      const date = new Date(2024, 0, 15);
      const result = endOfMonth(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(0);
    });

    it('should return last day of February (leap year)', () => {
      const date = new Date(2024, 1, 15);
      const result = endOfMonth(date);
      expect(result.getDate()).toBe(29);
    });

    it('should return last day of February (non-leap year)', () => {
      const date = new Date(2023, 1, 15);
      const result = endOfMonth(date);
      expect(result.getDate()).toBe(28);
    });

    it('should set time to end of day', () => {
      const date = new Date(2024, 0, 15, 10, 30);
      const result = endOfMonth(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('startOfWeek', () => {
    it('should return Sunday for a Wednesday', () => {
      const wednesday = new Date(2024, 0, 10); // Jan 10, 2024
      const result = startOfWeek(wednesday);
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(7); // Jan 7
    });

    it('should return same date if already Sunday', () => {
      const sunday = new Date(2024, 0, 7);
      const result = startOfWeek(sunday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(7);
    });

    it('should set time to start of day', () => {
      const date = new Date(2024, 0, 10, 15, 30);
      const result = startOfWeek(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('getDaysInMonth', () => {
    it('should return 31 for January', () => {
      const date = new Date(2024, 0, 15);
      expect(getDaysInMonth(date)).toBe(31);
    });

    it('should return 29 for February in leap year', () => {
      const date = new Date(2024, 1, 15);
      expect(getDaysInMonth(date)).toBe(29);
    });

    it('should return 28 for February in non-leap year', () => {
      const date = new Date(2023, 1, 15);
      expect(getDaysInMonth(date)).toBe(28);
    });

    it('should return 30 for April', () => {
      const date = new Date(2024, 3, 15);
      expect(getDaysInMonth(date)).toBe(30);
    });
  });

  describe('toCalendarDate', () => {
    it('should convert Date to CalendarDate', () => {
      const date = new Date(2024, 0, 15);
      const result = toCalendarDate(date);
      expect(result).toEqual({
        year: 2024,
        month: 1, // 1-based
        day: 15,
      });
    });

    it('should handle December correctly', () => {
      const date = new Date(2024, 11, 31);
      const result = toCalendarDate(date);
      expect(result).toEqual({
        year: 2024,
        month: 12,
        day: 31,
      });
    });
  });

  describe('fromCalendarDate', () => {
    it('should convert CalendarDate to Date', () => {
      const calendarDate = { year: 2024, month: 1, day: 15 };
      const result = fromCalendarDate(calendarDate);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // 0-based
      expect(result.getDate()).toBe(15);
    });

    it('should handle December correctly', () => {
      const calendarDate = { year: 2024, month: 12, day: 31 };
      const result = fromCalendarDate(calendarDate);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11); // 0-based
      expect(result.getDate()).toBe(31);
    });

    it('should set time to start of day', () => {
      const calendarDate = { year: 2024, month: 6, day: 15 };
      const result = fromCalendarDate(calendarDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });
});
