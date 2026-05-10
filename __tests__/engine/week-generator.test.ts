import { generateWeekData } from '../../src/engine/week-generator';
import type { WeekConfig } from '../../src/engine/types';

describe('week-generator', () => {
  describe('generateWeekData', () => {
    it('generates 7 days', () => {
      const date = new Date('2026-05-10'); // Sunday
      const config: WeekConfig = { weekStartsOn: 0 };
      const weekData = generateWeekData(date, config);

      expect(weekData.days).toHaveLength(7);
    });

    it('starts on Sunday when weekStartsOn is 0', () => {
      const date = new Date('2026-05-13'); // Wednesday
      const config: WeekConfig = { weekStartsOn: 0 };
      const weekData = generateWeekData(date, config);

      expect(weekData.days[0]?.dayOfWeek).toBe(0); // Sunday
      expect(weekData.days[0]?.date.getDate()).toBe(10);
    });

    it('starts on Monday when weekStartsOn is 1', () => {
      const date = new Date('2026-05-13'); // Wednesday
      const config: WeekConfig = { weekStartsOn: 1 };
      const weekData = generateWeekData(date, config);

      expect(weekData.days[0]?.dayOfWeek).toBe(1); // Monday
      expect(weekData.days[0]?.date.getDate()).toBe(11);
    });

    it('includes ISO week number', () => {
      const date = new Date('2026-05-13');
      const config: WeekConfig = { weekStartsOn: 0 };
      const weekData = generateWeekData(date, config);

      expect(weekData.weekNumber).toBe(20); // Week 20 of 2026
    });

    it('marks today correctly', () => {
      const today = new Date();
      const config: WeekConfig = { weekStartsOn: 0 };
      const weekData = generateWeekData(today, config);

      const todayData = weekData.days.find(d => d.isToday);
      expect(todayData).toBeDefined();
    });

    it('marks weekends correctly', () => {
      const date = new Date('2026-05-10'); // Sunday
      const config: WeekConfig = { weekStartsOn: 0 };
      const weekData = generateWeekData(date, config);

      const weekendDays = weekData.days.filter(d => d.isWeekend);
      expect(weekendDays).toHaveLength(2); // Sat + Sun
    });

    it('sets isCurrentMonth to true for all days', () => {
      const date = new Date('2026-05-13');
      const config: WeekConfig = { weekStartsOn: 0 };
      const weekData = generateWeekData(date, config);

      // Week view doesn't distinguish "current month"
      weekData.days.forEach(day => {
        expect(day.isCurrentMonth).toBe(true);
      });
    });
  });
});
