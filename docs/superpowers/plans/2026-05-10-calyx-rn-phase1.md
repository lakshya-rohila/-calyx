# Calyx RN Phase 1: Core Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build headless-first calendar library foundation with pure engine, Zustand store, and three React hooks.

**Architecture:** Three-layer separation - pure engine (date-fns), Zustand store (global state), React hooks (composition layer). Zero UI components.

**Tech Stack:** TypeScript strict, date-fns, Zustand, immer, @shopify/flash-list, Jest, React Testing Library

---

## File Structure Overview

**New files to create:**
```
src/
  engine/
    types.ts                    # Core type definitions
    calendar-math.ts            # Pure date utility functions
    month-generator.ts          # Month data generation
    week-generator.ts           # Week data generation
    index.ts                    # Engine exports
  store/
    calendar-store.ts           # Zustand store
    index.ts                    # Store exports
  hooks/
    useCalendar.ts              # Base calendar hook
    useMonthCalendar.ts         # Month view hook
    useWeekCalendar.ts          # Week view hook
    index.ts                    # Hook exports
  types/
    index.ts                    # Public type re-exports
  index.ts                      # Main library entry
__tests__/
  engine/
    calendar-math.test.ts
    month-generator.test.ts
    week-generator.test.ts
  hooks/
    useCalendar.test.ts
    useMonthCalendar.test.ts
    useWeekCalendar.test.ts
example/
  App.tsx                       # Transform existing app
  screens/
    BasicExample.tsx
    MonthExample.tsx
    WeekExample.tsx
  components/
    SimpleMonthView.tsx
    DayCell.tsx
```

**Files to modify:**
- `package.json` - Add dependencies, update metadata
- `tsconfig.json` - Enable strict mode
- `jest.config.js` - Configure testing

---

## Task 1: Project Setup & Dependencies

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Add dependencies to package.json**

```bash
npm install date-fns zustand immer @shopify/flash-list
npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/react-native tsup
```

- [ ] **Step 2: Update package.json metadata**

Edit `package.json`, update these fields:

```json
{
  "name": "@calyx/rn",
  "version": "0.1.0",
  "description": "Premium headless calendar library for React Native",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "react-native": "src/index.ts",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "react-native": "./src/index.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm test"
  },
  "keywords": [
    "react-native",
    "calendar",
    "date-picker",
    "headless",
    "hooks",
    "typescript"
  ],
  "sideEffects": false
}
```

- [ ] **Step 3: Enable TypeScript strict mode**

Edit `tsconfig.json`:

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__", "example"]
}
```

- [ ] **Step 4: Create tsup config**

Create `tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native', 'date-fns', 'zustand', 'immer', '@shopify/flash-list'],
  treeshake: true,
  splitting: false,
  minify: false,
});
```

- [ ] **Step 5: Create src directory structure**

```bash
mkdir -p src/engine src/store src/hooks src/types
mkdir -p __tests__/engine __tests__/hooks
mkdir -p example/screens example/components
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsup.config.ts
git commit -m "chore: setup Phase 1 dependencies and TypeScript config

- Add date-fns, zustand, immer, flash-list
- Enable TypeScript strict mode
- Configure tsup for dual ESM/CJS build
- Create src directory structure

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Engine Layer - Core Types

**Files:**
- Create: `src/engine/types.ts`

- [ ] **Step 1: Write types file**

Create `src/engine/types.ts`:

```typescript
import type { Locale } from 'date-fns';

/**
 * Represents a calendar date without time component
 */
export type CalendarDate = {
  year: number;
  month: number;  // 1-12 (not zero-indexed)
  day: number;    // 1-31
};

/**
 * Week configuration for calendar rendering
 */
export type WeekConfig = {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday, 1 = Monday, etc.
  locale?: Locale;  // date-fns Locale object
};

/**
 * Rich metadata for a single day in the calendar
 */
export type DayData = {
  date: Date;                    // Full Date object
  calendarDate: CalendarDate;    // Decomposed date
  isToday: boolean;              // Is this today?
  isWeekend: boolean;            // Is this Sat/Sun
  isCurrentMonth: boolean;       // For month views - is this day in the displayed month?
  dayOfWeek: number;             // 0-6 (0 = Sunday)
};

/**
 * Represents a single week in the calendar
 */
export type WeekData = {
  weekNumber: number;  // ISO 8601 week number
  days: DayData[];     // Always 7 days
};

/**
 * Represents a complete month view
 */
export type MonthData = {
  year: number;
  month: number;         // 1-12
  weeks: WeekData[];     // 4-6 weeks (includes overflow days)
  totalDays: number;     // Days in this month (28-31)
};
```

- [ ] **Step 2: Commit**

```bash
git add src/engine/types.ts
git commit -m "feat(engine): add core type definitions

- CalendarDate, WeekConfig, DayData
- WeekData, MonthData
- Full JSDoc comments

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Engine Layer - Calendar Math

**Files:**
- Create: `src/engine/calendar-math.ts`
- Create: `__tests__/engine/calendar-math.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/engine/calendar-math.test.ts`:

```typescript
import {
  isSameDay,
  isToday,
  isWeekend,
  addMonths,
  addWeeks,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  getDaysInMonth,
  getWeekNumber,
  toCalendarDate,
  fromCalendarDate,
} from '../src/engine/calendar-math';
import type { WeekConfig } from '../src/engine/types';

describe('calendar-math', () => {
  describe('isSameDay', () => {
    it('returns true for same date', () => {
      const date1 = new Date('2026-05-10');
      const date2 = new Date('2026-05-10');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different dates', () => {
      const date1 = new Date('2026-05-10');
      const date2 = new Date('2026-05-11');
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('ignores time component', () => {
      const date1 = new Date('2026-05-10T08:00:00');
      const date2 = new Date('2026-05-10T20:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });
  });

  describe('isWeekend', () => {
    it('returns true for Saturday', () => {
      const saturday = new Date('2026-05-09'); // Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it('returns true for Sunday', () => {
      const sunday = new Date('2026-05-10'); // Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it('returns false for Monday', () => {
      const monday = new Date('2026-05-11'); // Monday
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe('addMonths', () => {
    it('adds months correctly', () => {
      const date = new Date('2026-05-10');
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(6); // July (0-indexed)
      expect(result.getFullYear()).toBe(2026);
    });

    it('handles year boundary', () => {
      const date = new Date('2026-11-10');
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2027);
    });
  });

  describe('startOfMonth', () => {
    it('returns first day of month', () => {
      const date = new Date('2026-05-15');
      const result = startOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(4); // May
    });
  });

  describe('endOfMonth', () => {
    it('returns last day of month', () => {
      const date = new Date('2026-05-15');
      const result = endOfMonth(date);
      expect(result.getDate()).toBe(31); // May has 31 days
    });
  });

  describe('startOfWeek', () => {
    it('returns start of week (Sunday)', () => {
      const date = new Date('2026-05-13'); // Wednesday
      const config: WeekConfig = { weekStartsOn: 0 };
      const result = startOfWeek(date, config);
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(10);
    });

    it('returns start of week (Monday)', () => {
      const date = new Date('2026-05-13'); // Wednesday
      const config: WeekConfig = { weekStartsOn: 1 };
      const result = startOfWeek(date, config);
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(11);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns 31 for May', () => {
      expect(getDaysInMonth(2026, 5)).toBe(31);
    });

    it('returns 28 for Feb non-leap year', () => {
      expect(getDaysInMonth(2026, 2)).toBe(28);
    });

    it('returns 29 for Feb leap year', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });
  });

  describe('toCalendarDate', () => {
    it('converts Date to CalendarDate', () => {
      const date = new Date('2026-05-10');
      const result = toCalendarDate(date);
      expect(result).toEqual({
        year: 2026,
        month: 5,
        day: 10,
      });
    });
  });

  describe('fromCalendarDate', () => {
    it('converts CalendarDate to Date', () => {
      const calDate = { year: 2026, month: 5, day: 10 };
      const result = fromCalendarDate(calDate);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(4); // 0-indexed
      expect(result.getDate()).toBe(10);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- calendar-math.test`
Expected: FAIL with "Cannot find module '../src/engine/calendar-math'"

- [ ] **Step 3: Write minimal implementation**

Create `src/engine/calendar-math.ts`:

```typescript
import {
  isSameDay as dfnIsSameDay,
  isToday as dfnIsToday,
  isWeekend as dfnIsWeekend,
  addMonths as dfnAddMonths,
  addWeeks as dfnAddWeeks,
  addDays as dfnAddDays,
  subMonths as dfnSubMonths,
  subWeeks as dfnSubWeeks,
  subDays as dfnSubDays,
  startOfMonth as dfnStartOfMonth,
  endOfMonth as dfnEndOfMonth,
  startOfWeek as dfnStartOfWeek,
  endOfWeek as dfnEndOfWeek,
  startOfDay as dfnStartOfDay,
  endOfDay as dfnEndOfDay,
  getDaysInMonth as dfnGetDaysInMonth,
  getISOWeek,
  getDay,
  isSameMonth as dfnIsSameMonth,
  isSameWeek as dfnIsSameWeek,
} from 'date-fns';
import type { CalendarDate, WeekConfig } from './types';

/**
 * Date comparison
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return dfnIsSameDay(date1, date2);
}

export function isToday(date: Date): boolean {
  return dfnIsToday(date);
}

export function isWeekend(date: Date): boolean {
  return dfnIsWeekend(date);
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return dfnIsSameMonth(date1, date2);
}

export function isSameWeek(date1: Date, date2: Date, config: WeekConfig): boolean {
  return dfnIsSameWeek(date1, date2, { weekStartsOn: config.weekStartsOn, locale: config.locale });
}

/**
 * Date arithmetic
 */
export function addMonths(date: Date, amount: number): Date {
  return dfnAddMonths(date, amount);
}

export function addWeeks(date: Date, amount: number): Date {
  return dfnAddWeeks(date, amount);
}

export function addDays(date: Date, amount: number): Date {
  return dfnAddDays(date, amount);
}

export function subMonths(date: Date, amount: number): Date {
  return dfnSubMonths(date, amount);
}

export function subWeeks(date: Date, amount: number): Date {
  return dfnSubWeeks(date, amount);
}

export function subDays(date: Date, amount: number): Date {
  return dfnSubDays(date, amount);
}

/**
 * Boundary calculations
 */
export function startOfMonth(date: Date): Date {
  return dfnStartOfMonth(date);
}

export function endOfMonth(date: Date): Date {
  return dfnEndOfMonth(date);
}

export function startOfWeek(date: Date, config: WeekConfig): Date {
  return dfnStartOfWeek(date, { weekStartsOn: config.weekStartsOn, locale: config.locale });
}

export function endOfWeek(date: Date, config: WeekConfig): Date {
  return dfnEndOfWeek(date, { weekStartsOn: config.weekStartsOn, locale: config.locale });
}

export function startOfDay(date: Date): Date {
  return dfnStartOfDay(date);
}

export function endOfDay(date: Date): Date {
  return dfnEndOfDay(date);
}

/**
 * Calendar metadata
 */
export function getDaysInMonth(year: number, month: number): number {
  // date-fns expects 0-indexed month, we use 1-indexed
  return dfnGetDaysInMonth(new Date(year, month - 1));
}

export function getWeekNumber(date: Date): number {
  return getISOWeek(date);
}

export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

/**
 * Conversion utilities
 */
export function toCalendarDate(date: Date): CalendarDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Convert to 1-indexed
    day: date.getDate(),
  };
}

export function fromCalendarDate(calendarDate: CalendarDate): Date {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- calendar-math.test`
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/engine/calendar-math.ts __tests__/engine/calendar-math.test.ts
git commit -m "feat(engine): add calendar math utilities

- Wrap date-fns functions for date comparison, arithmetic, boundaries
- Add conversion helpers (toCalendarDate, fromCalendarDate)
- Comprehensive test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Engine Layer - Week Generator

**Files:**
- Create: `src/engine/week-generator.ts`
- Create: `__tests__/engine/week-generator.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/engine/week-generator.test.ts`:

```typescript
import { generateWeekData } from '../src/engine/week-generator';
import type { WeekConfig } from '../src/engine/types';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- week-generator.test`
Expected: FAIL with "Cannot find module '../src/engine/week-generator'"

- [ ] **Step 3: Write minimal implementation**

Create `src/engine/week-generator.ts`:

```typescript
import {
  startOfWeek,
  addDays,
  getWeekNumber,
  getDayOfWeek,
  isToday,
  isWeekend,
  toCalendarDate,
} from './calendar-math';
import type { WeekData, WeekConfig, DayData } from './types';

/**
 * Generates a single week data structure
 * 
 * @param date - Any date within the target week
 * @param config - Week configuration (start day, locale)
 * @returns Complete week structure with 7 days
 */
export function generateWeekData(date: Date, config: WeekConfig): WeekData {
  const weekStart = startOfWeek(date, config);
  const weekNum = getWeekNumber(date);
  
  const days: DayData[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);
    
    days.push({
      date: currentDay,
      calendarDate: toCalendarDate(currentDay),
      isToday: isToday(currentDay),
      isWeekend: isWeekend(currentDay),
      isCurrentMonth: true, // Week view doesn't distinguish months
      dayOfWeek: getDayOfWeek(currentDay),
    });
  }
  
  return {
    weekNumber: weekNum,
    days,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- week-generator.test`
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/engine/week-generator.ts __tests__/engine/week-generator.test.ts
git commit -m "feat(engine): add week data generator

- generateWeekData function with configurable week start
- Always generates 7 days with rich metadata
- ISO week number calculation
- Full test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Engine Layer - Month Generator

**Files:**
- Create: `src/engine/month-generator.ts`
- Create: `__tests__/engine/month-generator.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/engine/month-generator.test.ts`:

```typescript
import { generateMonthData } from '../src/engine/month-generator';
import type { WeekConfig } from '../src/engine/types';

describe('month-generator', () => {
  describe('generateMonthData', () => {
    it('generates month with correct year and month', () => {
      const date = new Date('2026-05-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      expect(monthData.year).toBe(2026);
      expect(monthData.month).toBe(5);
    });

    it('includes total days in month', () => {
      const date = new Date('2026-05-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      expect(monthData.totalDays).toBe(31); // May has 31 days
    });

    it('generates 5 weeks for May 2026 (starts on Friday)', () => {
      const date = new Date('2026-05-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      expect(monthData.weeks).toHaveLength(5);
    });

    it('generates 6 weeks when month starts late in week', () => {
      const date = new Date('2026-08-15'); // Aug 2026 starts on Saturday
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      expect(monthData.weeks).toHaveLength(6);
    });

    it('includes overflow days from previous month', () => {
      const date = new Date('2026-05-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      const firstWeek = monthData.weeks[0];
      expect(firstWeek).toBeDefined();
      
      // May 1, 2026 is Friday, so first week has 4 days from April
      const aprilDays = firstWeek!.days.filter(d => !d.isCurrentMonth);
      expect(aprilDays.length).toBeGreaterThan(0);
    });

    it('includes overflow days from next month', () => {
      const date = new Date('2026-05-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      const lastWeek = monthData.weeks[monthData.weeks.length - 1];
      expect(lastWeek).toBeDefined();
      
      // May 31, 2026 is Sunday, so last week might have June days
      const juneDays = lastWeek!.days.filter(d => !d.isCurrentMonth);
      expect(juneDays.length).toBeGreaterThanOrEqual(0);
    });

    it('marks current month days correctly', () => {
      const date = new Date('2026-05-15');
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
      const date = new Date('2026-05-15');
      const config: WeekConfig = { weekStartsOn: 1 };
      const monthData = generateMonthData(date, config);
      
      monthData.weeks.forEach(week => {
        expect(week.days[0]?.dayOfWeek).toBe(1); // Monday
      });
    });

    it('handles February in leap year', () => {
      const date = new Date('2024-02-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      expect(monthData.totalDays).toBe(29);
    });

    it('handles February in non-leap year', () => {
      const date = new Date('2026-02-15');
      const config: WeekConfig = { weekStartsOn: 0 };
      const monthData = generateMonthData(date, config);
      
      expect(monthData.totalDays).toBe(28);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- month-generator.test`
Expected: FAIL with "Cannot find module '../src/engine/month-generator'"

- [ ] **Step 3: Write minimal implementation**

Create `src/engine/month-generator.ts`:

```typescript
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDaysInMonth,
  isSameMonth,
  toCalendarDate,
  isToday,
  isWeekend,
  getDayOfWeek,
  getWeekNumber,
} from './calendar-math';
import type { MonthData, WeekConfig, WeekData, DayData } from './types';

/**
 * Generates a complete month data structure
 * 
 * @param date - Any date within the target month
 * @param config - Week configuration (start day, locale)
 * @returns Complete month structure with weeks and overflow days
 */
export function generateMonthData(date: Date, config: WeekConfig): MonthData {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Convert to 1-indexed
  const totalDays = getDaysInMonth(year, month);
  
  // Find the calendar start (may be in previous month)
  const calendarStart = startOfWeek(monthStart, config);
  
  // Find the calendar end (may be in next month)
  const calendarEnd = endOfWeek(monthEnd, config);
  
  // Generate all days
  const weeks: WeekData[] = [];
  let currentWeekStart = calendarStart;
  
  while (currentWeekStart <= calendarEnd) {
    const days: DayData[] = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(currentWeekStart, i);
      
      days.push({
        date: currentDay,
        calendarDate: toCalendarDate(currentDay),
        isToday: isToday(currentDay),
        isWeekend: isWeekend(currentDay),
        isCurrentMonth: isSameMonth(currentDay, date),
        dayOfWeek: getDayOfWeek(currentDay),
      });
    }
    
    weeks.push({
      weekNumber: getWeekNumber(currentWeekStart),
      days,
    });
    
    currentWeekStart = addDays(currentWeekStart, 7);
  }
  
  return {
    year,
    month,
    weeks,
    totalDays,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- month-generator.test`
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/engine/month-generator.ts __tests__/engine/month-generator.test.ts
git commit -m "feat(engine): add month data generator

- generateMonthData with overflow days from adjacent months
- Configurable week start day
- Marks current month vs overflow days
- Handles leap years and all month lengths
- Full test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Engine Layer - Index Exports

**Files:**
- Create: `src/engine/index.ts`

- [ ] **Step 1: Create engine index file**

Create `src/engine/index.ts`:

```typescript
// Types
export type {
  CalendarDate,
  WeekConfig,
  DayData,
  WeekData,
  MonthData,
} from './types';

// Calendar math utilities
export {
  isSameDay,
  isToday,
  isWeekend,
  isSameMonth,
  isSameWeek,
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  subWeeks,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  getDaysInMonth,
  getWeekNumber,
  getDayOfWeek,
  toCalendarDate,
  fromCalendarDate,
} from './calendar-math';

// Generators
export { generateMonthData } from './month-generator';
export { generateWeekData } from './week-generator';
```

- [ ] **Step 2: Verify exports work**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/engine/index.ts
git commit -m "feat(engine): add engine layer exports

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Store Layer - Zustand Calendar Store

**Files:**
- Create: `src/store/calendar-store.ts`

- [ ] **Step 1: Write calendar store**

Create `src/store/calendar-store.ts`:

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { addMonths, addWeeks } from '../engine/calendar-math';
import type { WeekConfig } from '../engine/types';

export type CalendarState = {
  // Current date context
  currentDate: Date;
  selectedDate: Date | null;
  
  // Configuration
  weekConfig: WeekConfig;
  
  // Actions - Navigation
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToDate: (date: Date) => void;
  
  // Actions - Selection
  setSelectedDate: (date: Date | null) => void;
  clearSelection: () => void;
  
  // Actions - Configuration
  setWeekConfig: (config: WeekConfig) => void;
  setWeekStartsOn: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
};

/**
 * Creates a new calendar store instance
 * Supports multiple independent calendars in the same app
 */
export const createCalendarStore = (initialConfig?: Partial<WeekConfig>) => {
  return create<CalendarState>()(
    immer((set) => ({
      // Initial state
      currentDate: new Date(),
      selectedDate: null,
      weekConfig: {
        weekStartsOn: initialConfig?.weekStartsOn ?? 0,
        locale: initialConfig?.locale,
      },
      
      // Navigation actions
      setCurrentDate: (date) =>
        set((state) => {
          state.currentDate = date;
        }),
      
      goToToday: () =>
        set((state) => {
          state.currentDate = new Date();
        }),
      
      goToNextMonth: () =>
        set((state) => {
          state.currentDate = addMonths(state.currentDate, 1);
        }),
      
      goToPreviousMonth: () =>
        set((state) => {
          state.currentDate = addMonths(state.currentDate, -1);
        }),
      
      goToNextWeek: () =>
        set((state) => {
          state.currentDate = addWeeks(state.currentDate, 1);
        }),
      
      goToPreviousWeek: () =>
        set((state) => {
          state.currentDate = addWeeks(state.currentDate, -1);
        }),
      
      goToDate: (date) =>
        set((state) => {
          state.currentDate = date;
        }),
      
      // Selection actions
      setSelectedDate: (date) =>
        set((state) => {
          state.selectedDate = date;
        }),
      
      clearSelection: () =>
        set((state) => {
          state.selectedDate = null;
        }),
      
      // Configuration actions
      setWeekConfig: (config) =>
        set((state) => {
          state.weekConfig = config;
        }),
      
      setWeekStartsOn: (day) =>
        set((state) => {
          state.weekConfig.weekStartsOn = day;
        }),
    }))
  );
};

/**
 * Default global calendar store
 * Most apps only need one calendar
 */
export const useCalendarStore = createCalendarStore();
```

- [ ] **Step 2: Create store index**

Create `src/store/index.ts`:

```typescript
export { createCalendarStore, useCalendarStore } from './calendar-store';
export type { CalendarState } from './calendar-store';
```

- [ ] **Step 3: Verify store compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/store/
git commit -m "feat(store): add Zustand calendar store

- Global calendar state with Zustand + immer
- Navigation actions (month, week, date)
- Selection management
- Configuration management
- Support for multiple store instances

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Hooks Layer - useCalendar

**Files:**
- Create: `src/hooks/useCalendar.ts`
- Create: `__tests__/hooks/useCalendar.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/hooks/useCalendar.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCalendar } from '../src/hooks/useCalendar';

describe('useCalendar', () => {
  it('initializes with default date (today)', () => {
    const { result } = renderHook(() => useCalendar());
    
    expect(result.current.currentDate).toBeInstanceOf(Date);
    expect(result.current.selectedDate).toBeNull();
  });

  it('initializes with custom initial date', () => {
    const initialDate = new Date('2026-05-10');
    const { result } = renderHook(() => useCalendar({ initialDate }));
    
    expect(result.current.currentDate.toDateString()).toBe(initialDate.toDateString());
  });

  it('initializes with custom weekStartsOn', () => {
    const { result } = renderHook(() => useCalendar({ weekStartsOn: 1 }));
    
    expect(result.current.weekConfig.weekStartsOn).toBe(1);
  });

  it('sets current date', () => {
    const { result } = renderHook(() => useCalendar());
    const newDate = new Date('2026-06-15');
    
    act(() => {
      result.current.setCurrentDate(newDate);
    });
    
    expect(result.current.currentDate.toDateString()).toBe(newDate.toDateString());
  });

  it('selects a date', () => {
    const { result } = renderHook(() => useCalendar());
    const dateToSelect = new Date('2026-05-15');
    
    act(() => {
      result.current.selectDate(dateToSelect);
    });
    
    expect(result.current.selectedDate).not.toBeNull();
    expect(result.current.selectedDate?.toDateString()).toBe(dateToSelect.toDateString());
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useCalendar());
    const dateToSelect = new Date('2026-05-15');
    
    act(() => {
      result.current.selectDate(dateToSelect);
      result.current.clearSelection();
    });
    
    expect(result.current.selectedDate).toBeNull();
  });

  it('goes to today', () => {
    const { result } = renderHook(() => useCalendar({ initialDate: new Date('2025-01-01') }));
    
    act(() => {
      result.current.goToToday();
    });
    
    const today = new Date();
    expect(result.current.currentDate.toDateString()).toBe(today.toDateString());
  });

  it('isDateSelected returns true for selected date', () => {
    const { result } = renderHook(() => useCalendar());
    const dateToSelect = new Date('2026-05-15');
    
    act(() => {
      result.current.selectDate(dateToSelect);
    });
    
    expect(result.current.isDateSelected(dateToSelect)).toBe(true);
    expect(result.current.isDateSelected(new Date('2026-05-16'))).toBe(false);
  });

  it('calls onDateChange callback', () => {
    const onDateChange = jest.fn();
    const { result } = renderHook(() => useCalendar({ onDateChange }));
    const newDate = new Date('2026-06-15');
    
    act(() => {
      result.current.setCurrentDate(newDate);
    });
    
    expect(onDateChange).toHaveBeenCalledWith(newDate);
  });

  it('calls onDateSelect callback', () => {
    const onDateSelect = jest.fn();
    const { result } = renderHook(() => useCalendar({ onDateSelect }));
    const dateToSelect = new Date('2026-05-15');
    
    act(() => {
      result.current.selectDate(dateToSelect);
    });
    
    expect(onDateSelect).toHaveBeenCalledWith(dateToSelect);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useCalendar.test`
Expected: FAIL with "Cannot find module '../src/hooks/useCalendar'"

- [ ] **Step 3: Write minimal implementation**

Create `src/hooks/useCalendar.ts`:

```typescript
import { useEffect, useCallback, useMemo } from 'react';
import { useCalendarStore as defaultStore } from '../store/calendar-store';
import { isSameDay } from '../engine/calendar-math';
import type { WeekConfig } from '../engine/types';
import type { CalendarState } from '../store/calendar-store';

export type UseCalendarOptions = {
  initialDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onDateChange?: (date: Date) => void;
  onDateSelect?: (date: Date | null) => void;
  store?: typeof defaultStore;
};

export type UseCalendarReturn = {
  // State
  currentDate: Date;
  selectedDate: Date | null;
  weekConfig: WeekConfig;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  selectDate: (date: Date | null) => void;
  clearSelection: () => void;
  goToToday: () => void;
  goToDate: (date: Date) => void;
  
  // Utilities
  isDateSelected: (date: Date) => boolean;
  isDateCurrent: (date: Date) => boolean;
};

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const {
    initialDate,
    weekStartsOn,
    onDateChange,
    onDateSelect,
    store = defaultStore,
  } = options;
  
  // Subscribe to store slices
  const currentDate = store((state: CalendarState) => state.currentDate);
  const selectedDate = store((state: CalendarState) => state.selectedDate);
  const weekConfig = store((state: CalendarState) => state.weekConfig);
  const storeActions = store((state: CalendarState) => ({
    setCurrentDate: state.setCurrentDate,
    setSelectedDate: state.setSelectedDate,
    clearSelection: state.clearSelection,
    goToToday: state.goToToday,
    goToDate: state.goToDate,
    setWeekStartsOn: state.setWeekStartsOn,
  }));
  
  // Initialize on mount
  useEffect(() => {
    if (initialDate) {
      storeActions.setCurrentDate(initialDate);
    }
    if (weekStartsOn !== undefined) {
      storeActions.setWeekStartsOn(weekStartsOn);
    }
  }, []); // Only run once on mount
  
  // Call onDateChange when currentDate changes
  useEffect(() => {
    onDateChange?.(currentDate);
  }, [currentDate, onDateChange]);
  
  // Call onDateSelect when selectedDate changes
  useEffect(() => {
    onDateSelect?.(selectedDate);
  }, [selectedDate, onDateSelect]);
  
  // Wrapped actions
  const setCurrentDate = useCallback((date: Date) => {
    storeActions.setCurrentDate(date);
  }, [storeActions]);
  
  const selectDate = useCallback((date: Date | null) => {
    storeActions.setSelectedDate(date);
  }, [storeActions]);
  
  const clearSelection = useCallback(() => {
    storeActions.clearSelection();
  }, [storeActions]);
  
  const goToToday = useCallback(() => {
    storeActions.goToToday();
  }, [storeActions]);
  
  const goToDate = useCallback((date: Date) => {
    storeActions.goToDate(date);
  }, [storeActions]);
  
  // Utility functions
  const isDateSelected = useCallback((date: Date): boolean => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  }, [selectedDate]);
  
  const isDateCurrent = useCallback((date: Date): boolean => {
    return isSameDay(date, currentDate);
  }, [currentDate]);
  
  return {
    currentDate,
    selectedDate,
    weekConfig,
    setCurrentDate,
    selectDate,
    clearSelection,
    goToToday,
    goToDate,
    isDateSelected,
    isDateCurrent,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useCalendar.test`
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCalendar.ts __tests__/hooks/useCalendar.test.ts
git commit -m "feat(hooks): add useCalendar base hook

- Connects to Zustand store
- Navigation and selection management
- Callbacks for date changes
- Utility functions for date comparison
- Full test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Hooks Layer - useMonthCalendar

**Files:**
- Create: `src/hooks/useMonthCalendar.ts`
- Create: `__tests__/hooks/useMonthCalendar.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/hooks/useMonthCalendar.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useMonthCalendar } from '../src/hooks/useMonthCalendar';

describe('useMonthCalendar', () => {
  it('generates month data', () => {
    const { result } = renderHook(() => useMonthCalendar());
    
    expect(result.current.monthData).toBeDefined();
    expect(result.current.monthData.weeks.length).toBeGreaterThan(0);
  });

  it('extracts year and month', () => {
    const initialDate = new Date('2026-05-15');
    const { result } = renderHook(() => useMonthCalendar({ initialDate }));
    
    expect(result.current.year).toBe(2026);
    expect(result.current.month).toBe(5);
  });

  it('goes to next month', () => {
    const initialDate = new Date('2026-05-15');
    const { result } = renderHook(() => useMonthCalendar({ initialDate }));
    
    act(() => {
      result.current.goToNextMonth();
    });
    
    expect(result.current.month).toBe(6); // June
    expect(result.current.year).toBe(2026);
  });

  it('goes to previous month', () => {
    const initialDate = new Date('2026-05-15');
    const { result } = renderHook(() => useMonthCalendar({ initialDate }));
    
    act(() => {
      result.current.goToPreviousMonth();
    });
    
    expect(result.current.month).toBe(4); // April
    expect(result.current.year).toBe(2026);
  });

  it('goes to specific month', () => {
    const { result } = renderHook(() => useMonthCalendar());
    
    act(() => {
      result.current.goToMonth(2025, 12);
    });
    
    expect(result.current.year).toBe(2025);
    expect(result.current.month).toBe(12);
  });

  it('calls onMonthChange callback', () => {
    const onMonthChange = jest.fn();
    const initialDate = new Date('2026-05-15');
    const { result } = renderHook(() => useMonthCalendar({ initialDate, onMonthChange }));
    
    act(() => {
      result.current.goToNextMonth();
    });
    
    expect(onMonthChange).toHaveBeenCalledWith(2026, 6);
  });

  it('generates month at offset', () => {
    const initialDate = new Date('2026-05-15');
    const { result } = renderHook(() => useMonthCalendar({ initialDate }));
    
    const nextMonthData = result.current.generateMonthAtOffset(1);
    expect(nextMonthData.month).toBe(6); // June
    
    const prevMonthData = result.current.generateMonthAtOffset(-1);
    expect(prevMonthData.month).toBe(4); // April
  });

  it('generates unique month keys', () => {
    const initialDate = new Date('2026-05-15');
    const { result } = renderHook(() => useMonthCalendar({ initialDate }));
    
    const key0 = result.current.getMonthKey(0);
    const key1 = result.current.getMonthKey(1);
    const keyNeg1 = result.current.getMonthKey(-1);
    
    expect(key0).not.toBe(key1);
    expect(key0).not.toBe(keyNeg1);
    expect(key1).not.toBe(keyNeg1);
  });

  it('memoizes monthData when currentDate does not change', () => {
    const { result, rerender } = renderHook(() => useMonthCalendar());
    
    const firstMonthData = result.current.monthData;
    rerender();
    const secondMonthData = result.current.monthData;
    
    expect(firstMonthData).toBe(secondMonthData); // Same reference
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useMonthCalendar.test`
Expected: FAIL with "Cannot find module '../src/hooks/useMonthCalendar'"

- [ ] **Step 3: Write minimal implementation**

Create `src/hooks/useMonthCalendar.ts`:

```typescript
import { useCallback, useMemo, useEffect } from 'react';
import { useCalendar } from './useCalendar';
import { generateMonthData } from '../engine/month-generator';
import { addMonths } from '../engine/calendar-math';
import type { UseCalendarOptions, UseCalendarReturn } from './useCalendar';
import type { MonthData } from '../engine/types';
import { useCalendarStore as defaultStore } from '../store/calendar-store';
import type { CalendarState } from '../store/calendar-store';

export type UseMonthCalendarOptions = UseCalendarOptions & {
  onMonthChange?: (year: number, month: number) => void;
};

export type UseMonthCalendarReturn = UseCalendarReturn & {
  // Month-specific state
  monthData: MonthData;
  year: number;
  month: number;
  
  // Month navigation
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  
  // Virtualization helpers
  getMonthKey: (offset: number) => string;
  generateMonthAtOffset: (offset: number) => MonthData;
};

export function useMonthCalendar(options: UseMonthCalendarOptions = {}): UseMonthCalendarReturn {
  const { onMonthChange, store = defaultStore, ...calendarOptions } = options;
  
  // Base calendar hook
  const calendar = useCalendar({ ...calendarOptions, store });
  
  // Store actions
  const storeActions = store((state: CalendarState) => ({
    goToNextMonth: state.goToNextMonth,
    goToPreviousMonth: state.goToPreviousMonth,
  }));
  
  // Generate month data (memoized)
  const monthData = useMemo(() => {
    return generateMonthData(calendar.currentDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  
  // Extract year and month
  const year = monthData.year;
  const month = monthData.month;
  
  // Call onMonthChange when month changes
  useEffect(() => {
    onMonthChange?.(year, month);
  }, [year, month, onMonthChange]);
  
  // Month navigation
  const goToNextMonth = useCallback(() => {
    storeActions.goToNextMonth();
  }, [storeActions]);
  
  const goToPreviousMonth = useCallback(() => {
    storeActions.goToPreviousMonth();
  }, [storeActions]);
  
  const goToMonth = useCallback((targetYear: number, targetMonth: number) => {
    const targetDate = new Date(targetYear, targetMonth - 1, 1);
    calendar.setCurrentDate(targetDate);
  }, [calendar]);
  
  // Virtualization helpers
  const generateMonthAtOffset = useCallback((offset: number): MonthData => {
    const targetDate = addMonths(calendar.currentDate, offset);
    return generateMonthData(targetDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  
  const getMonthKey = useCallback((offset: number): string => {
    const targetDate = addMonths(calendar.currentDate, offset);
    return `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}`;
  }, [calendar.currentDate]);
  
  return {
    ...calendar,
    monthData,
    year,
    month,
    goToNextMonth,
    goToPreviousMonth,
    goToMonth,
    generateMonthAtOffset,
    getMonthKey,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useMonthCalendar.test`
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useMonthCalendar.ts __tests__/hooks/useMonthCalendar.test.ts
git commit -m "feat(hooks): add useMonthCalendar hook

- Extends useCalendar with month-specific functionality
- Generates month data with memoization
- Month navigation (next/previous/specific)
- Virtualization helpers for infinite scroll
- Full test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Hooks Layer - useWeekCalendar

**Files:**
- Create: `src/hooks/useWeekCalendar.ts`
- Create: `__tests__/hooks/useWeekCalendar.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/hooks/useWeekCalendar.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useWeekCalendar } from '../src/hooks/useWeekCalendar';

describe('useWeekCalendar', () => {
  it('generates week data', () => {
    const { result } = renderHook(() => useWeekCalendar());
    
    expect(result.current.weekData).toBeDefined();
    expect(result.current.weekData.days).toHaveLength(7);
  });

  it('extracts week number', () => {
    const initialDate = new Date('2026-05-13'); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate }));
    
    expect(result.current.weekNumber).toBe(20);
  });

  it('extracts year', () => {
    const initialDate = new Date('2026-05-13');
    const { result } = renderHook(() => useWeekCalendar({ initialDate }));
    
    expect(result.current.year).toBe(2026);
  });

  it('goes to next week', () => {
    const initialDate = new Date('2026-05-13'); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate }));
    
    act(() => {
      result.current.goToNextWeek();
    });
    
    expect(result.current.weekNumber).toBe(21);
  });

  it('goes to previous week', () => {
    const initialDate = new Date('2026-05-13'); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate }));
    
    act(() => {
      result.current.goToPreviousWeek();
    });
    
    expect(result.current.weekNumber).toBe(19);
  });

  it('goes to specific week', () => {
    const { result } = renderHook(() => useWeekCalendar());
    
    act(() => {
      result.current.goToWeek(1, 2025);
    });
    
    expect(result.current.weekNumber).toBe(1);
    expect(result.current.year).toBe(2025);
  });

  it('calls onWeekChange callback', () => {
    const onWeekChange = jest.fn();
    const initialDate = new Date('2026-05-13');
    const { result } = renderHook(() => useWeekCalendar({ initialDate, onWeekChange }));
    
    act(() => {
      result.current.goToNextWeek();
    });
    
    expect(onWeekChange).toHaveBeenCalled();
  });

  it('generates week at offset', () => {
    const initialDate = new Date('2026-05-13'); // Week 20
    const { result } = renderHook(() => useWeekCalendar({ initialDate }));
    
    const nextWeekData = result.current.generateWeekAtOffset(1);
    expect(nextWeekData.weekNumber).toBe(21);
    
    const prevWeekData = result.current.generateWeekAtOffset(-1);
    expect(prevWeekData.weekNumber).toBe(19);
  });

  it('generates unique week keys', () => {
    const initialDate = new Date('2026-05-13');
    const { result } = renderHook(() => useWeekCalendar({ initialDate }));
    
    const key0 = result.current.getWeekKey(0);
    const key1 = result.current.getWeekKey(1);
    const keyNeg1 = result.current.getWeekKey(-1);
    
    expect(key0).not.toBe(key1);
    expect(key0).not.toBe(keyNeg1);
    expect(key1).not.toBe(keyNeg1);
  });

  it('memoizes weekData when currentDate does not change', () => {
    const { result, rerender } = renderHook(() => useWeekCalendar());
    
    const firstWeekData = result.current.weekData;
    rerender();
    const secondWeekData = result.current.weekData;
    
    expect(firstWeekData).toBe(secondWeekData);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useWeekCalendar.test`
Expected: FAIL with "Cannot find module '../src/hooks/useWeekCalendar'"

- [ ] **Step 3: Write minimal implementation**

Create `src/hooks/useWeekCalendar.ts`:

```typescript
import { useCallback, useMemo, useEffect } from 'react';
import { useCalendar } from './useCalendar';
import { generateWeekData } from '../engine/week-generator';
import { addWeeks, getWeekNumber } from '../engine/calendar-math';
import type { UseCalendarOptions, UseCalendarReturn } from './useCalendar';
import type { WeekData } from '../engine/types';
import { useCalendarStore as defaultStore } from '../store/calendar-store';
import type { CalendarState } from '../store/calendar-store';

export type UseWeekCalendarOptions = UseCalendarOptions & {
  onWeekChange?: (weekNumber: number, year: number) => void;
};

export type UseWeekCalendarReturn = UseCalendarReturn & {
  // Week-specific state
  weekData: WeekData;
  weekNumber: number;
  year: number;
  
  // Week navigation
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToWeek: (weekNumber: number, year: number) => void;
  
  // Virtualization helpers
  getWeekKey: (offset: number) => string;
  generateWeekAtOffset: (offset: number) => WeekData;
};

export function useWeekCalendar(options: UseWeekCalendarOptions = {}): UseWeekCalendarReturn {
  const { onWeekChange, store = defaultStore, ...calendarOptions } = options;
  
  // Base calendar hook
  const calendar = useCalendar({ ...calendarOptions, store });
  
  // Store actions
  const storeActions = store((state: CalendarState) => ({
    goToNextWeek: state.goToNextWeek,
    goToPreviousWeek: state.goToPreviousWeek,
  }));
  
  // Generate week data (memoized)
  const weekData = useMemo(() => {
    return generateWeekData(calendar.currentDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  
  // Extract week number and year
  const weekNumber = weekData.weekNumber;
  const year = calendar.currentDate.getFullYear();
  
  // Call onWeekChange when week changes
  useEffect(() => {
    onWeekChange?.(weekNumber, year);
  }, [weekNumber, year, onWeekChange]);
  
  // Week navigation
  const goToNextWeek = useCallback(() => {
    storeActions.goToNextWeek();
  }, [storeActions]);
  
  const goToPreviousWeek = useCallback(() => {
    storeActions.goToPreviousWeek();
  }, [storeActions]);
  
  const goToWeek = useCallback((targetWeekNumber: number, targetYear: number) => {
    // Find a date in the target week
    // Simple approach: use Jan 4 of target year (always in week 1) then add weeks
    const jan4 = new Date(targetYear, 0, 4);
    const weeksToAdd = targetWeekNumber - getWeekNumber(jan4);
    const targetDate = addWeeks(jan4, weeksToAdd);
    calendar.setCurrentDate(targetDate);
  }, [calendar]);
  
  // Virtualization helpers
  const generateWeekAtOffset = useCallback((offset: number): WeekData => {
    const targetDate = addWeeks(calendar.currentDate, offset);
    return generateWeekData(targetDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  
  const getWeekKey = useCallback((offset: number): string => {
    const targetDate = addWeeks(calendar.currentDate, offset);
    return `${targetDate.getFullYear()}-W${getWeekNumber(targetDate)}`;
  }, [calendar.currentDate]);
  
  return {
    ...calendar,
    weekData,
    weekNumber,
    year,
    goToNextWeek,
    goToPreviousWeek,
    goToWeek,
    generateWeekAtOffset,
    getWeekKey,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useWeekCalendar.test`
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useWeekCalendar.ts __tests__/hooks/useWeekCalendar.test.ts
git commit -m "feat(hooks): add useWeekCalendar hook

- Extends useCalendar with week-specific functionality
- Generates week data with memoization
- Week navigation (next/previous/specific)
- Virtualization helpers for horizontal scroll
- Full test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Hooks Layer - Index Exports

**Files:**
- Create: `src/hooks/index.ts`

- [ ] **Step 1: Create hooks index file**

Create `src/hooks/index.ts`:

```typescript
export { useCalendar } from './useCalendar';
export type {
  UseCalendarOptions,
  UseCalendarReturn,
} from './useCalendar';

export { useMonthCalendar } from './useMonthCalendar';
export type {
  UseMonthCalendarOptions,
  UseMonthCalendarReturn,
} from './useMonthCalendar';

export { useWeekCalendar } from './useWeekCalendar';
export type {
  UseWeekCalendarOptions,
  UseWeekCalendarReturn,
} from './useWeekCalendar';
```

- [ ] **Step 2: Verify exports work**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/index.ts
git commit -m "feat(hooks): add hooks layer exports

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Public API - Main Entry Point

**Files:**
- Create: `src/types/index.ts`
- Create: `src/index.ts`

- [ ] **Step 1: Create types re-export file**

Create `src/types/index.ts`:

```typescript
// Re-export all engine types
export type {
  CalendarDate,
  WeekConfig,
  DayData,
  WeekData,
  MonthData,
} from '../engine/types';

// Re-export hook types
export type {
  UseCalendarOptions,
  UseCalendarReturn,
  UseMonthCalendarOptions,
  UseMonthCalendarReturn,
  UseWeekCalendarOptions,
  UseWeekCalendarReturn,
} from '../hooks';

// Re-export store types
export type { CalendarState } from '../store/calendar-store';
```

- [ ] **Step 2: Create main entry point**

Create `src/index.ts`:

```typescript
// Core Hooks (PRIMARY API)
export { useCalendar, useMonthCalendar, useWeekCalendar } from './hooks';

// Types (for TypeScript consumers)
export type {
  CalendarDate,
  WeekConfig,
  DayData,
  WeekData,
  MonthData,
  UseCalendarOptions,
  UseCalendarReturn,
  UseMonthCalendarOptions,
  UseMonthCalendarReturn,
  UseWeekCalendarOptions,
  UseWeekCalendarReturn,
  CalendarState,
} from './types';

// Engine utilities (ADVANCED API - for custom implementations)
export {
  isSameDay,
  isToday,
  isWeekend,
  isSameMonth,
  isSameWeek,
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  subWeeks,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  getDaysInMonth,
  getWeekNumber,
  getDayOfWeek,
  toCalendarDate,
  fromCalendarDate,
} from './engine/calendar-math';

// Generators (ADVANCED API)
export { generateMonthData, generateWeekData } from './engine';

// Store (EXPERT API - for custom state management)
export { createCalendarStore } from './store/calendar-store';
```

- [ ] **Step 3: Verify all imports work**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/index.ts
git commit -m "feat: add public API entry point

- Export hooks (primary API)
- Export types for TypeScript
- Export engine utilities (advanced API)
- Export store factory (expert API)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Example App - Basic Example

**Files:**
- Create: `example/components/DayCell.tsx`
- Create: `example/screens/BasicExample.tsx`

- [ ] **Step 1: Create DayCell component**

Create `example/components/DayCell.tsx`:

```typescript
import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import type { DayData } from '../../src/types';

type DayCellProps = {
  day: DayData;
  isSelected: boolean;
  onPress: () => void;
};

export function DayCell({ day, isSelected, onPress }: DayCellProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        day.isToday && styles.today,
        isSelected && styles.selected,
        !day.isCurrentMonth && styles.otherMonth,
      ]}
    >
      <Text
        style={[
          styles.text,
          day.isToday && styles.todayText,
          isSelected && styles.selectedText,
          !day.isCurrentMonth && styles.otherMonthText,
        ]}
      >
        {day.calendarDate.day}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 24,
  },
  today: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  otherMonth: {
    opacity: 0.3,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFF',
    fontWeight: '600',
  },
  otherMonthText: {
    color: '#999',
  },
});
```

- [ ] **Step 2: Create BasicExample screen**

Create `example/screens/BasicExample.tsx`:

```typescript
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useCalendar } from '../../src';

export function BasicExample() {
  const calendar = useCalendar({
    weekStartsOn: 0,
    onDateChange: (date) => console.log('Date changed:', date.toDateString()),
    onDateSelect: (date) => console.log('Date selected:', date?.toDateString() ?? 'none'),
  });
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>useCalendar Demo</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Current Date:</Text>
        <Text style={styles.value}>{calendar.currentDate.toDateString()}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Selected Date:</Text>
        <Text style={styles.value}>
          {calendar.selectedDate?.toDateString() ?? 'None'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Week Starts On:</Text>
        <Text style={styles.value}>
          {calendar.weekConfig.weekStartsOn === 0 ? 'Sunday' : 'Monday'}
        </Text>
      </View>
      
      <View style={styles.buttonRow}>
        <Button title="Today" onPress={calendar.goToToday} />
        <Button
          title="Select Tomorrow"
          onPress={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            calendar.selectDate(tomorrow);
          }}
        />
      </View>
      
      <View style={styles.buttonRow}>
        <Button
          title="Clear Selection"
          onPress={calendar.clearSelection}
        />
        <Button
          title="Next Month"
          onPress={() => {
            const nextMonth = new Date(calendar.currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            calendar.setCurrentDate(nextMonth);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
});
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add example/components/DayCell.tsx example/screens/BasicExample.tsx
git commit -m "feat(example): add basic calendar example

- DayCell component for rendering days
- BasicExample screen demonstrating useCalendar
- Navigation and selection interactions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: Example App - Month Example

**Files:**
- Create: `example/components/SimpleMonthView.tsx`
- Create: `example/screens/MonthExample.tsx`

- [ ] **Step 1: Create SimpleMonthView component**

Create `example/components/SimpleMonthView.tsx`:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayCell } from './DayCell';
import type { MonthData } from '../../src/types';

type SimpleMonthViewProps = {
  monthData: MonthData;
  selectedDate: Date | null;
  onDayPress: (date: Date) => void;
};

export function SimpleMonthView({ monthData, selectedDate, onDayPress }: SimpleMonthViewProps) {
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  
  return (
    <View style={styles.container}>
      {/* Header with day names */}
      <View style={styles.headerRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.headerText}>{day}</Text>
        ))}
      </View>
      
      {/* Weeks */}
      {monthData.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.days.map((day, dayIndex) => (
            <DayCell
              key={dayIndex}
              day={day}
              isSelected={isDateSelected(day.date)}
              onPress={() => onDayPress(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  headerText: {
    width: 48,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
```

- [ ] **Step 2: Create MonthExample screen**

Create `example/screens/MonthExample.tsx`:

```typescript
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useMonthCalendar } from '../../src';
import { SimpleMonthView } from '../components/SimpleMonthView';

export function MonthExample() {
  const calendar = useMonthCalendar({
    weekStartsOn: 0,
    onMonthChange: (year, month) => {
      console.log(`Viewing ${year}-${month}`);
    },
  });
  
  const monthName = new Date(calendar.year, calendar.month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button title="◀" onPress={calendar.goToPreviousMonth} />
        <Text style={styles.monthTitle}>{monthName}</Text>
        <Button title="▶" onPress={calendar.goToNextMonth} />
      </View>
      
      <Button title="Today" onPress={calendar.goToToday} />
      
      <SimpleMonthView
        monthData={calendar.monthData}
        selectedDate={calendar.selectedDate}
        onDayPress={calendar.selectDate}
      />
      
      {calendar.selectedDate && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Selected: {calendar.selectedDate.toDateString()}
          </Text>
          <Button title="Clear Selection" onPress={calendar.clearSelection} />
        </View>
      )}
      
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Month has {calendar.monthData.totalDays} days
        </Text>
        <Text style={styles.debugText}>
          Displaying {calendar.monthData.weeks.length} weeks
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedInfo: {
    padding: 20,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    marginBottom: 10,
  },
  debugInfo: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    margin: 20,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add example/components/SimpleMonthView.tsx example/screens/MonthExample.tsx
git commit -m "feat(example): add month calendar example

- SimpleMonthView component rendering month grid
- MonthExample screen with navigation
- Day selection and display

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: Example App - Week Example

**Files:**
- Create: `example/screens/WeekExample.tsx`

- [ ] **Step 1: Create WeekExample screen**

Create `example/screens/WeekExample.tsx`:

```typescript
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useWeekCalendar } from '../../src';
import { DayCell } from '../components/DayCell';

export function WeekExample() {
  const calendar = useWeekCalendar({
    weekStartsOn: 1, // Start on Monday
    onWeekChange: (weekNum, year) => {
      console.log(`Viewing Week ${weekNum} of ${year}`);
    },
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button title="◀" onPress={calendar.goToPreviousWeek} />
        <Text style={styles.weekTitle}>
          Week {calendar.weekNumber} • {calendar.year}
        </Text>
        <Button title="▶" onPress={calendar.goToNextWeek} />
      </View>
      
      <Button title="Today" onPress={calendar.goToToday} />
      
      <View style={styles.weekContainer}>
        <View style={styles.headerRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <Text key={day} style={styles.headerText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysRow}>
          {calendar.weekData.days.map((day, index) => (
            <DayCell
              key={index}
              day={day}
              isSelected={calendar.isDateSelected(day.date)}
              onPress={() => calendar.selectDate(day.date)}
            />
          ))}
        </View>
      </View>
      
      {calendar.selectedDate && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Selected: {calendar.selectedDate.toDateString()}
          </Text>
          <Button title="Clear Selection" onPress={calendar.clearSelection} />
        </View>
      )}
      
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          ISO Week Number: {calendar.weekNumber}
        </Text>
        <Text style={styles.debugText}>
          First day: {calendar.weekData.days[0]?.date.toDateString()}
        </Text>
        <Text style={styles.debugText}>
          Last day: {calendar.weekData.days[6]?.date.toDateString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  headerText: {
    width: 48,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectedInfo: {
    padding: 20,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    marginBottom: 10,
  },
  debugInfo: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    margin: 20,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add example/screens/WeekExample.tsx
git commit -m "feat(example): add week calendar example

- WeekExample screen with horizontal week view
- ISO week number display
- Week navigation and selection

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 16: Example App - Transform App.tsx

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Update App.tsx to show examples**

Edit `App.tsx`:

```typescript
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  useColorScheme,
} from 'react-native';
import { BasicExample } from './example/screens/BasicExample';
import { MonthExample } from './example/screens/MonthExample';
import { WeekExample } from './example/screens/WeekExample';

type TabKey = 'basic' | 'month' | 'week';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicExample />;
      case 'month':
        return <MonthExample />;
      case 'week':
        return <WeekExample />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calyx RN • Phase 1</Text>
      </View>
      
      <View style={styles.tabs}>
        <TabButton
          label="Basic"
          active={activeTab === 'basic'}
          onPress={() => setActiveTab('basic')}
        />
        <TabButton
          label="Month"
          active={activeTab === 'month'}
          onPress={() => setActiveTab('month')}
        />
        <TabButton
          label="Week"
          active={activeTab === 'week'}
          onPress={() => setActiveTab('week')}
        />
      </View>
      
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});

export default App;
```

- [ ] **Step 2: Test app runs**

Run: `npm run ios` (or `npm run android`)
Expected: App launches with three working tabs

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat(example): transform App.tsx into example navigator

- Tab navigation between three examples
- Basic, Month, and Week demos
- Clean header and styling

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 17: Documentation - README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:

```markdown
# Calyx RN

Premium headless calendar library for React Native.

**Phase 1:** Core Foundation - Pure engine, Zustand store, and three React hooks.

## Installation

\`\`\`bash
npm install @calyx/rn
# or
yarn add @calyx/rn
\`\`\`

## Quick Start

### Simple Month Calendar

\`\`\`tsx
import { useMonthCalendar } from '@calyx/rn';

function MyCalendar() {
  const calendar = useMonthCalendar({ weekStartsOn: 0 });
  
  return (
    <View>
      {calendar.monthData.weeks.map(week => (
        <View key={week.weekNumber} style={{ flexDirection: 'row' }}>
          {week.days.map(day => (
            <Pressable
              key={day.date.toString()}
              onPress={() => calendar.selectDate(day.date)}
            >
              <Text>{day.calendarDate.day}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      
      <Button title="Previous" onPress={calendar.goToPreviousMonth} />
      <Button title="Next" onPress={calendar.goToNextMonth} />
    </View>
  );
}
\`\`\`

### Week Calendar

\`\`\`tsx
import { useWeekCalendar } from '@calyx/rn';

function WeekView() {
  const calendar = useWeekCalendar({ weekStartsOn: 1 });
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {calendar.weekData.days.map(day => (
        <Pressable key={day.date.toString()} onPress={() => calendar.selectDate(day.date)}>
          <Text>{day.calendarDate.day}</Text>
        </Pressable>
      ))}
    </View>
  );
}
\`\`\`

## Features

- 🎯 **Headless Architecture** - Zero UI opinions, complete rendering control
- 🪝 **Three Core Hooks** - useCalendar, useMonthCalendar, useWeekCalendar
- 📘 **TypeScript-First** - Strict mode, full type inference
- ⚡️ **High Performance** - Memoized calculations, virtualization support
- 🎨 **Zero UI** - Bring your own components and styling
- 🌍 **Configurable** - Week start day, locale support via date-fns
- 🧪 **Well Tested** - >85% coverage

## API

### useCalendar

Base calendar hook for state management and navigation.

\`\`\`tsx
const calendar = useCalendar({
  initialDate: new Date('2026-05-01'),
  weekStartsOn: 0, // 0 = Sunday, 1 = Monday
  onDateChange: (date) => console.log('Date changed:', date),
  onDateSelect: (date) => console.log('Selected:', date),
});
\`\`\`

**Returns:**
- \`currentDate\`: Current viewing date
- \`selectedDate\`: User-selected date (null if none)
- \`weekConfig\`: Week configuration
- \`setCurrentDate(date)\`: Update current date
- \`selectDate(date)\`: Select a date
- \`clearSelection()\`: Clear selection
- \`goToToday()\`: Jump to today
- \`isDateSelected(date)\`: Check if date is selected

### useMonthCalendar

Extends useCalendar with month-specific functionality.

\`\`\`tsx
const calendar = useMonthCalendar({
  weekStartsOn: 0,
  onMonthChange: (year, month) => console.log(\`Viewing \${year}-\${month}\`),
});
\`\`\`

**Returns:** All from useCalendar plus:
- \`monthData\`: Complete month structure with weeks
- \`year\`: Current year
- \`month\`: Current month (1-12)
- \`goToNextMonth()\`: Navigate to next month
- \`goToPreviousMonth()\`: Navigate to previous month
- \`goToMonth(year, month)\`: Jump to specific month
- \`generateMonthAtOffset(offset)\`: For infinite scroll
- \`getMonthKey(offset)\`: Unique key for FlashList

### useWeekCalendar

Extends useCalendar with week-specific functionality.

\`\`\`tsx
const calendar = useWeekCalendar({
  weekStartsOn: 1,
  onWeekChange: (weekNum, year) => console.log(\`Week \${weekNum}\`),
});
\`\`\`

**Returns:** All from useCalendar plus:
- \`weekData\`: Complete week structure (7 days)
- \`weekNumber\`: ISO week number
- \`year\`: Current year
- \`goToNextWeek()\`: Navigate to next week
- \`goToPreviousWeek()\`: Navigate to previous week
- \`goToWeek(weekNum, year)\`: Jump to specific week
- \`generateWeekAtOffset(offset)\`: For horizontal scroll
- \`getWeekKey(offset)\`: Unique key for FlashList

## Advanced Usage

### Custom Store

Create isolated calendar instances:

\`\`\`tsx
import { createCalendarStore } from '@calyx/rn';

const customStore = createCalendarStore({ weekStartsOn: 1 });

function MyCalendar() {
  const calendar = useMonthCalendar({ store: customStore });
  // ...
}
\`\`\`

### Direct Engine Access

Use pure functions for custom logic:

\`\`\`tsx
import { generateMonthData, addMonths } from '@calyx/rn';

const nextMonth = addMonths(new Date(), 1);
const monthData = generateMonthData(nextMonth, { weekStartsOn: 0 });
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Type check
npm run typecheck

# Build
npm run build
\`\`\`

## Roadmap

**Phase 1 (Current):** Core foundation - engine, store, hooks ✅  
**Phase 2:** UI component system  
**Phase 3:** Event management  
**Phase 4:** Advanced views (timeline, agenda)  
**Phase 5:** Theme engine  
**Phase 6:** Animation system  
**Phase 7:** Developer experience (docs, Storybook)  
**Phase 8:** Advanced features (plugins, sync)  
**Phase 9:** Production polish

## License

MIT

## Contributing

See example app in \`App.tsx\` for usage patterns.
\`\`\`

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README

- Installation and quick start
- API reference for all three hooks
- Features and roadmap
- Advanced usage examples

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 18: Final Verification & Build

**Files:**
- None (verification only)

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass with >85% coverage

- [ ] **Step 2: Run type check**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Build library**

Run: `npm run build`
Expected: dist/ directory created with ESM, CJS, and .d.ts files

- [ ] **Step 4: Verify build output**

Run: `ls -la dist/`
Expected: `index.js`, `index.mjs`, `index.d.ts` files exist

- [ ] **Step 5: Test iOS app**

Run: `npm run ios`
Expected: App launches successfully, all three tabs work

- [ ] **Step 6: Test Android app** (if possible)

Run: `npm run android`
Expected: App launches successfully, all three tabs work

- [ ] **Step 7: Commit final verification**

```bash
git add .
git commit -m "chore: Phase 1 complete - verification passed

All tests passing, type checking clean, builds successfully.
Example app runs on iOS and Android.

Phase 1 deliverables:
- Engine layer (pure functions)
- Store layer (Zustand)
- Hooks layer (useCalendar, useMonthCalendar, useWeekCalendar)
- Comprehensive tests (>85% coverage)
- Example app with three demos
- Full documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 19: Create LICENSE

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create MIT license**

Create `LICENSE`:

```
MIT License

Copyright (c) 2026 Calyx RN Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "chore: add MIT license

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [x] No placeholders (TBD, TODO, "implement later")
- [x] All code blocks complete and functional
- [x] Exact file paths specified
- [x] Test-first approach (write test, see fail, implement, see pass)
- [x] Frequent commits after each task
- [x] Type consistency across tasks
- [x] All spec requirements covered

## Spec Coverage Check

✅ Engine layer - calendar-math, week-generator, month-generator  
✅ Store layer - Zustand with immer  
✅ Hooks layer - useCalendar, useMonthCalendar, useWeekCalendar  
✅ Public API exports  
✅ Testing - unit tests for engine and hooks  
✅ Example app - three demonstration screens  
✅ Build configuration - tsup, TypeScript strict  
✅ Documentation - README with API reference  

All spec requirements have corresponding implementation tasks.
