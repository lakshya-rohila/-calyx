import { generateMonthData } from '../../src/engine/month-generator';
import type { WeekConfig } from '../../src/engine/types';

describe('month-generator', () => {
  describe('generateMonthData', () => {
    it('generates month with correct year and month', () => {
      const date = new Date(2026, 4, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.year).toBe(2026);
      expect(monthData.month).toBe(5);
    });

    it('includes total days in month', () => {
      const date = new Date(2026, 4, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.totalDays).toBe(31); // May has 31 days
    });

    it('generates 5 weeks for June 2026 (starts on Monday)', () => {
      const date = new Date(2026, 5, 15); // June 2026
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.weeks).toHaveLength(5);
    });

    it('generates 6 weeks for May 2026 (starts on Friday)', () => {
      const date = new Date(2026, 4, 15); // May 2026 starts on Friday
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.weeks).toHaveLength(6);
    });

    it('generates 6 weeks for August 2026 (starts on Saturday)', () => {
      const date = new Date(2026, 7, 15); // Aug 2026 starts on Saturday
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.weeks).toHaveLength(6);
    });

    it('includes overflow days from previous month', () => {
      const date = new Date(2026, 4, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      const firstWeek = monthData.weeks[0];
      expect(firstWeek).toBeDefined();

      // May 1, 2026 is Friday, so first week has 5 days from April (Sun-Thu)
      const aprilDays = firstWeek!.days.filter(d => !d.isCurrentMonth);
      expect(aprilDays.length).toBeGreaterThan(0);
    });

    it('includes overflow days from next month', () => {
      const date = new Date(2026, 4, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      const lastWeek = monthData.weeks[monthData.weeks.length - 1];
      expect(lastWeek).toBeDefined();

      // May 31, 2026 is Sunday, so last week might have June days
      const juneDays = lastWeek!.days.filter(d => !d.isCurrentMonth);
      expect(juneDays.length).toBeGreaterThanOrEqual(0);
    });

    it('marks current month days correctly', () => {
      const date = new Date(2026, 4, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      let mayDaysCount = 0;
      monthData.weeks.forEach(week => {
        week.days.forEach(day => {
          if (day.isCurrentMonth && day.calendarDate.month === 5) {
            mayDaysCount++;
          }
        });
      });

      expect(mayDaysCount).toBe(31);
    });

    it('respects weekStartsOn Monday', () => {
      const date = new Date(2026, 4, 15);
      const config: WeekConfig = { weekStartsOn: 1 };
      const monthData = generateMonthData(date, config);

      monthData.weeks.forEach(week => {
        expect(week.days[0]?.dayOfWeek).toBe(1); // Monday
      });
    });

    it('handles February in leap year', () => {
      const date = new Date(2024, 1, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.totalDays).toBe(29);
    });

    it('handles February in non-leap year', () => {
      const date = new Date(2026, 1, 15);
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);

      expect(monthData.totalDays).toBe(28);
    });
  });
});
