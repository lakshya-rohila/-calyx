# Calyx RN - Phase 1: Core Foundation Design

**Date:** 2026-05-10  
**Phase:** Phase 1 of 9  
**Version:** 0.1.0 target  
**Status:** Design approved, ready for implementation

---

## Executive Summary

Phase 1 delivers the foundational calendar library infrastructure for **@calyx/rn** - a premium React Native calendar system. This phase establishes the core architecture, date calculation engine, state management, and three essential hooks (useCalendar, useMonthCalendar, useWeekCalendar) that future phases will build upon.

**What we're building:** A headless-first, TypeScript-strict, production-ready calendar foundation that separates pure calendar logic from React state management, enabling developers to build custom calendar UIs.

**What we're NOT building yet:** UI components, theme engine, animations, event management, advanced views. Those come in Phases 2-9.

---

## Product Vision Context

Calyx RN aims to become the definitive premium calendar library for React Native - competing with premium UI systems by offering:
- Luxury UI (Phase 2+)
- Deep customization
- Advanced animations (Phase 6)
- Multiple calendar modes (Phases 2-4)
- Theme engine (Phase 5)
- Event scheduling (Phase 3)
- Accessibility (ongoing)
- Production-level performance

Phase 1 establishes the **architectural foundation** that makes all future phases possible.

---

## Architecture Overview

### Headless-First Architecture

We're building in three distinct layers:

```
┌─────────────────────────────────────┐
│         Hooks Layer (React)         │  ← useCalendar, useMonthCalendar, useWeekCalendar
│  - React state management           │
│  - Component lifecycle integration  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Store Layer (Zustand)          │  ← Global calendar state
│  - Shared state across hooks        │
│  - Navigation actions                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Engine Layer (Pure Functions)    │  ← calendar-math, generators
│  - Date calculations (date-fns)     │
│  - Zero React dependencies           │
│  - Pure, testable functions          │
└─────────────────────────────────────┘
```

**Why this architecture:**
1. **Separation of concerns:** Logic vs state vs React integration
2. **Testability:** Pure engine functions are trivial to test
3. **Reusability:** Engine can be used outside React Native
4. **Future-proof:** UI components (Phase 2) will consume these same hooks
5. **Industry standard:** Matches Radix UI, Headless UI, React Aria patterns

---

## Project Structure

```
/dates (transforms from demo app to library package)
├── src/
│   ├── engine/                    # Pure calendar logic (no React)
│   │   ├── calendar-math.ts       # Date utilities wrapping date-fns
│   │   ├── week-generator.ts      # Generate week data structures
│   │   ├── month-generator.ts     # Generate month data structures
│   │   ├── types.ts               # Core type definitions
│   │   └── index.ts               # Engine exports
│   ├── store/                     # Zustand state management
│   │   ├── calendar-store.ts      # Global calendar state + actions
│   │   └── index.ts               # Store exports
│   ├── hooks/                     # React hooks layer
│   │   ├── useCalendar.ts         # Base calendar hook
│   │   ├── useMonthCalendar.ts    # Month view hook
│   │   ├── useWeekCalendar.ts     # Week view hook
│   │   └── index.ts               # Hook exports
│   ├── types/                     # Public TypeScript types
│   │   └── index.ts               # Re-exports + public-facing types
│   └── index.ts                   # Main entry point - public API
├── __tests__/
│   ├── engine/
│   │   ├── calendar-math.test.ts
│   │   ├── month-generator.test.ts
│   │   └── week-generator.test.ts
│   └── hooks/
│       ├── useCalendar.test.ts
│       ├── useMonthCalendar.test.ts
│       └── useWeekCalendar.test.ts
├── example/                       # Development playground
│   ├── App.tsx
│   └── screens/
│       ├── MonthExample.tsx
│       ├── WeekExample.tsx
│       └── BasicExample.tsx
├── dist/                          # Build output (gitignored)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## Technology Stack

### Core Dependencies

| Package | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| `date-fns` | ^3.x | Date calculations, pure functions, tree-shakeable | ~50KB (typical) |
| `zustand` | ^4.x | Lightweight state management | ~1KB |
| `immer` | ^10.x | Immutable state updates (Zustand middleware) | ~14KB |
| `@shopify/flash-list` | ^1.x | High-performance virtualization | ~30KB |

**Total dependency footprint:** ~95KB (gzipped: ~30KB)

### Peer Dependencies

- `react` >=18.0.0
- `react-native` >=0.70.0

### Dev Dependencies

- `@testing-library/react-hooks` - Hook testing
- `@testing-library/react-native` - Component testing
- `@types/jest` - TypeScript types for Jest
- `typescript` ^5.8.x - Strict mode
- `tsup` or `rollup` - Build tooling for dual ESM/CJS output

---

## Engine Layer Specification

### Design Principles

1. **Zero React dependencies** - Can be imported and used in any JS environment
2. **Pure functions only** - No side effects, deterministic outputs
3. **date-fns wrapper** - Abstract date library for potential future swaps
4. **Type-safe** - Strict TypeScript with full type inference

### Core Types (`engine/types.ts`)

```typescript
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
  isWeekend: boolean;            // Is this Sat/Sun (locale-aware in future)
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

### Calendar Math (`engine/calendar-math.ts`)

Pure utility functions wrapping date-fns:

```typescript
/**
 * Date comparison
 */
export function isSameDay(date1: Date, date2: Date): boolean;
export function isToday(date: Date): boolean;
export function isWeekend(date: Date): boolean;
export function isSameMonth(date1: Date, date2: Date): boolean;
export function isSameWeek(date1: Date, date2: Date, config: WeekConfig): boolean;

/**
 * Date arithmetic
 */
export function addMonths(date: Date, amount: number): Date;
export function addWeeks(date: Date, amount: number): Date;
export function addDays(date: Date, amount: number): Date;
export function subMonths(date: Date, amount: number): Date;
export function subWeeks(date: Date, amount: number): Date;
export function subDays(date: Date, amount: number): Date;

/**
 * Boundary calculations
 */
export function startOfMonth(date: Date): Date;
export function endOfMonth(date: Date): Date;
export function startOfWeek(date: Date, config: WeekConfig): Date;
export function endOfWeek(date: Date, config: WeekConfig): Date;
export function startOfDay(date: Date): Date;
export function endOfDay(date: Date): Date;

/**
 * Calendar metadata
 */
export function getDaysInMonth(year: number, month: number): number;
export function getWeekNumber(date: Date): number;  // ISO 8601 week number
export function getDayOfWeek(date: Date): number;   // 0-6

/**
 * Conversion utilities
 */
export function toCalendarDate(date: Date): CalendarDate;
export function fromCalendarDate(calendarDate: CalendarDate): Date;
```

**Implementation notes:**
- All functions handle edge cases (leap years, DST, month boundaries)
- date-fns is imported tree-shakeable style: `import { addMonths } from 'date-fns/addMonths'`
- Functions are memoization-friendly (pure, no closures)

### Month Generator (`engine/month-generator.ts`)

```typescript
/**
 * Generates a complete month data structure
 * 
 * @param date - Any date within the target month
 * @param config - Week configuration (start day, locale)
 * @returns Complete month structure with weeks and overflow days
 * 
 * @example
 * const monthData = generateMonthData(new Date('2026-05-10'), { weekStartsOn: 0 });
 * // Returns month with 5 weeks, including April overflow days
 */
export function generateMonthData(
  date: Date,
  config: WeekConfig
): MonthData;
```

**Behavior:**
- Returns 4-6 weeks depending on month layout
- Includes overflow days from adjacent months to complete weeks
- Overflow days have `isCurrentMonth: false`
- All days have rich metadata (isToday, isWeekend, etc.)

**Algorithm:**
1. Get first day of month
2. Find start of week containing first day (may be in previous month)
3. Generate weeks until we've passed the last day of target month
4. Ensure last week is complete (may include next month's days)

### Week Generator (`engine/week-generator.ts`)

```typescript
/**
 * Generates a single week data structure
 * 
 * @param date - Any date within the target week
 * @param config - Week configuration (start day, locale)
 * @returns Complete week structure with 7 days
 * 
 * @example
 * const weekData = generateWeekData(new Date('2026-05-10'), { weekStartsOn: 1 });
 * // Returns week starting Monday May 5 - Sunday May 11
 */
export function generateWeekData(
  date: Date,
  config: WeekConfig
): WeekData;
```

**Behavior:**
- Always returns exactly 7 days
- Finds start of week based on config
- Calculates ISO week number
- All days have rich metadata

---

## Store Layer Specification

### Zustand Store (`store/calendar-store.ts`)

**State shape:**

```typescript
type CalendarState = {
  // Core date state
  currentDate: Date;           // The date context being viewed
  selectedDate: Date | null;   // User-selected date (null = none selected)
  
  // Configuration
  weekConfig: WeekConfig;      // Week start day + locale
  
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
```

**Store implementation:**

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const createCalendarStore = (initialConfig?: Partial<WeekConfig>) => {
  return create<CalendarState>()(
    immer((set) => ({
      currentDate: new Date(),
      selectedDate: null,
      weekConfig: {
        weekStartsOn: initialConfig?.weekStartsOn ?? 0,
        locale: initialConfig?.locale,
      },
      
      setCurrentDate: (date) => set({ currentDate: date }),
      goToToday: () => set({ currentDate: new Date() }),
      goToNextMonth: () => set((state) => ({
        currentDate: addMonths(state.currentDate, 1)
      })),
      // ... other actions
    }))
  );
};

// Default global store instance
export const useCalendarStore = createCalendarStore();
```

**Why Zustand:**
- Minimal boilerplate (vs Redux)
- Hook-based API (feels native to React)
- No Provider wrapper needed (vs Context)
- Excellent TypeScript support
- Tiny bundle size (1KB)
- Easy to test

**Why immer middleware:**
- Immutable updates via mutable-looking code
- Prevents accidental state mutations
- Cleaner action implementations

**Multiple store instances:**
For apps with multiple independent calendars, developers can create isolated stores:

```typescript
const calendarStore1 = createCalendarStore();
const calendarStore2 = createCalendarStore();
```

---

## Hooks Layer Specification

### Base Hook: `useCalendar`

```typescript
type UseCalendarOptions = {
  initialDate?: Date;
  weekStartsOn?: 0 | 1;
  onDateChange?: (date: Date) => void;
  onDateSelect?: (date: Date | null) => void;
  store?: typeof useCalendarStore;  // Optional custom store
};

type UseCalendarReturn = {
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

export function useCalendar(options?: UseCalendarOptions): UseCalendarReturn;
```

**Behavior:**
- Connects to Zustand store (default or custom)
- Handles initialization with `initialDate`
- Calls `onDateChange` callback when currentDate changes
- Calls `onDateSelect` callback when selection changes
- Memoizes utility functions

**Example usage:**

```typescript
const calendar = useCalendar({
  initialDate: new Date('2026-05-01'),
  weekStartsOn: 1,
  onDateChange: (date) => console.log('Navigated to', date),
});

// Select a date
calendar.selectDate(new Date('2026-05-15'));

// Check if date is selected
calendar.isDateSelected(new Date('2026-05-15')); // true
```

### Month Hook: `useMonthCalendar`

```typescript
type UseMonthCalendarOptions = UseCalendarOptions & {
  onMonthChange?: (year: number, month: number) => void;
};

type UseMonthCalendarReturn = UseCalendarReturn & {
  // Month-specific state
  monthData: MonthData;
  year: number;
  month: number;
  
  // Month navigation
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  
  // Virtualization helpers (for infinite scroll)
  getMonthKey: (offset: number) => string;
  generateMonthAtOffset: (offset: number) => MonthData;
};

export function useMonthCalendar(options?: UseMonthCalendarOptions): UseMonthCalendarReturn;
```

**Behavior:**
- Extends `useCalendar` with month-specific functionality
- Generates `monthData` using `generateMonthData` (memoized)
- `goToNextMonth` / `goToPreviousMonth` update store and trigger callback
- Virtualization helpers enable FlashList infinite scrolling

**Example usage:**

```typescript
const monthCalendar = useMonthCalendar({
  weekStartsOn: 0,
  onMonthChange: (year, month) => {
    console.log(`Viewing ${year}-${month}`);
  },
});

// Access month data
monthCalendar.monthData.weeks.forEach(week => {
  week.days.forEach(day => {
    console.log(day.date, day.isToday, day.isCurrentMonth);
  });
});

// Navigate
monthCalendar.goToNextMonth();

// For FlashList infinite scroll
<FlashList
  data={virtualizedMonths}
  renderItem={({ item, index }) => {
    const offset = index - currentMonthIndex;
    const monthData = monthCalendar.generateMonthAtOffset(offset);
    return <MonthView data={monthData} />;
  }}
  keyExtractor={(_, index) => monthCalendar.getMonthKey(index - currentMonthIndex)}
/>
```

### Week Hook: `useWeekCalendar`

```typescript
type UseWeekCalendarOptions = UseCalendarOptions & {
  onWeekChange?: (weekNumber: number, year: number) => void;
};

type UseWeekCalendarReturn = UseCalendarReturn & {
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

export function useWeekCalendar(options?: UseWeekCalendarOptions): UseWeekCalendarReturn;
```

**Behavior:**
- Extends `useCalendar` with week-specific functionality
- Generates `weekData` using `generateWeekData` (memoized)
- Tracks ISO week number
- Virtualization helpers for horizontal week scrolling

**Example usage:**

```typescript
const weekCalendar = useWeekCalendar({
  weekStartsOn: 1,
  onWeekChange: (weekNum, year) => {
    console.log(`Week ${weekNum} of ${year}`);
  },
});

// Access week data
weekCalendar.weekData.days.forEach(day => {
  console.log(day.date, day.dayOfWeek);
});

// Navigate
weekCalendar.goToNextWeek();
```

---

## Public API Design

### Main Entry Point (`src/index.ts`)

```typescript
// Core Hooks (PRIMARY API)
export { useCalendar } from './hooks/useCalendar';
export { useMonthCalendar } from './hooks/useMonthCalendar';
export { useWeekCalendar } from './hooks/useWeekCalendar';

// Types (for TypeScript consumers)
export type {
  CalendarDate,
  WeekConfig,
  DayData,
  WeekData,
  MonthData,
} from './engine/types';

// Hook return types
export type {
  UseCalendarOptions,
  UseCalendarReturn,
  UseMonthCalendarOptions,
  UseMonthCalendarReturn,
  UseWeekCalendarOptions,
  UseWeekCalendarReturn,
} from './hooks';

// Engine utilities (ADVANCED API - for custom implementations)
export {
  // Date comparison
  isSameDay,
  isToday,
  isWeekend,
  isSameMonth,
  isSameWeek,
  
  // Date arithmetic
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  subWeeks,
  subDays,
  
  // Boundaries
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  
  // Metadata
  getDaysInMonth,
  getWeekNumber,
  getDayOfWeek,
  
  // Conversion
  toCalendarDate,
  fromCalendarDate,
} from './engine/calendar-math';

// Generators (ADVANCED API)
export {
  generateMonthData,
  generateWeekData,
} from './engine';

// Store (EXPERT API - for custom state management)
export { createCalendarStore } from './store/calendar-store';
```

**API Philosophy:**

Three tiers of API surface:
1. **Simple (most users):** Import hooks, use them. TypeScript autocomplete guides the way.
2. **Advanced (custom UIs):** Import engine functions to build custom calendar logic.
3. **Expert (complex apps):** Import store factory to create isolated calendar instances.

---

## Testing Strategy

### Test Coverage Goals

- **Engine layer:** >90% coverage (pure functions are easy to test)
- **Store layer:** >85% coverage
- **Hooks layer:** >80% coverage (React Testing Library)
- **Overall:** >85% coverage

### Engine Tests

**`__tests__/engine/calendar-math.test.ts`**

Test categories:
- Date comparison functions
- Date arithmetic (including negative offsets)
- Boundary calculations
- Edge cases:
  - Leap years (Feb 29, 2024)
  - DST transitions (spring forward, fall back)
  - Month boundaries (Jan 31 + 1 month)
  - Year boundaries (Dec 31 / Jan 1)
  - Different week start days

**`__tests__/engine/month-generator.test.ts`**

Test scenarios:
- Month with 4 weeks (February 2026, starts on Sunday)
- Month with 5 weeks (most common)
- Month with 6 weeks (May 2026, 31 days starting Saturday)
- Overflow days from previous/next month
- weekStartsOn variations (0 = Sunday, 1 = Monday)
- Leap year February
- isCurrentMonth flag accuracy
- isToday detection
- Week number calculations

**`__tests__/engine/week-generator.test.ts`**

Test scenarios:
- Week entirely within one month
- Week spanning two months (end of month)
- Week spanning two years (Dec 31 - Jan 1)
- weekStartsOn variations
- ISO week number accuracy
- Day of week calculations

### Hook Tests

**`__tests__/hooks/useCalendar.test.ts`**

Test scenarios:
- Initialization with default date (today)
- Initialization with custom initialDate
- Initialization with custom weekStartsOn
- setCurrentDate updates state
- selectDate updates selectedDate
- clearSelection sets selectedDate to null
- goToToday resets to current date
- isDateSelected utility function
- onDateChange callback fires
- onDateSelect callback fires
- Multiple hook instances share store state

**`__tests__/hooks/useMonthCalendar.test.ts`**

Test scenarios:
- monthData generation
- year and month extraction
- goToNextMonth updates state and triggers callback
- goToPreviousMonth updates state and triggers callback
- goToMonth jumps to specific year/month
- generateMonthAtOffset for virtualization
- getMonthKey uniqueness
- Memoization: monthData doesn't regenerate on unrelated state changes

**`__tests__/hooks/useWeekCalendar.test.ts`**

Test scenarios:
- weekData generation
- weekNumber calculation
- goToNextWeek / goToPreviousWeek
- goToWeek jumps to specific week
- generateWeekAtOffset for virtualization
- getWeekKey uniqueness
- Memoization efficiency

### Testing Tools

```json
{
  "jest": "^29.6.3",
  "@testing-library/react": "^14.x",
  "@testing-library/react-hooks": "^8.x",
  "@testing-library/react-native": "^12.x"
}
```

**Test commands:**
```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
npm test -- calendar-math   # Run specific test file
```

**CI Integration:**
- Tests run on every PR
- Coverage report posted to PR
- Minimum 85% coverage enforced

---

## Example App Structure

The current bare React Native app transforms into a development playground.

### Structure

```
example/
  App.tsx                   # Main navigation/tabs
  screens/
    BasicExample.tsx        # Simple useCalendar demo
    MonthExample.tsx        # useMonthCalendar demo
    WeekExample.tsx         # useWeekCalendar demo
  components/
    SimpleMonthView.tsx     # Basic month grid (no FlashList)
    SimpleWeekView.tsx      # Basic week row
    DayCell.tsx             # Pressable day cell
```

### Example: BasicExample.tsx

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useCalendar } from '@calyx/rn';

export function BasicExample() {
  const calendar = useCalendar({
    weekStartsOn: 0,
    onDateChange: (date) => console.log('Date changed:', date),
  });
  
  return (
    <View>
      <Text>Current Date: {calendar.currentDate.toDateString()}</Text>
      {calendar.selectedDate && (
        <Text>Selected: {calendar.selectedDate.toDateString()}</Text>
      )}
      
      <Button title="Today" onPress={calendar.goToToday} />
      <Button title="Select Tomorrow" onPress={() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        calendar.selectDate(tomorrow);
      }} />
      <Button title="Clear Selection" onPress={calendar.clearSelection} />
    </View>
  );
}
```

### Example: MonthExample.tsx

Demonstrates:
- useMonthCalendar hook
- Rendering month grid (7 columns × 4-6 rows)
- Day cell press handling
- Next/previous month navigation
- Week starts on Sunday vs Monday toggle

### Example: WeekExample.tsx

Demonstrates:
- useWeekCalendar hook
- Horizontal week strip
- Day selection
- Week navigation
- ISO week number display

---

## Build & Package Configuration

### package.json

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
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm test"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.70.0"
  },
  "dependencies": {
    "date-fns": "^3.6.0",
    "zustand": "^4.5.0",
    "immer": "^10.0.0",
    "@shopify/flash-list": "^1.6.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.3.0",
    "@testing-library/react-hooks": "^8.0.1",
    "@testing-library/react-native": "^12.5.0",
    "@types/jest": "^29.5.13",
    "@types/react": "^19.2.0",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "tsup": "^8.0.0",
    "typescript": "^5.8.3"
  },
  "keywords": [
    "react-native",
    "calendar",
    "date-picker",
    "headless",
    "hooks",
    "typescript"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/calyx-rn.git"
  },
  "license": "MIT",
  "sideEffects": false
}
```

### TypeScript Configuration

**tsconfig.json** (strict mode):

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
    
    "module": "ESNext",
    "target": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__", "example"]
}
```

### Build Configuration (tsup)

**tsup.config.ts**:

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
  minify: false, // Users' bundlers will minify
});
```

**Why tsup:**
- Zero-config TypeScript bundler
- Dual ESM/CJS output
- Automatic declaration file generation
- Fast (uses esbuild)
- Perfect for libraries

---

## Performance Considerations

### Engine Layer Optimizations

**Pure functions enable memoization:**
```typescript
import { memoize } from 'lodash-es'; // or custom implementation

const memoizedGenerateMonth = memoize(
  generateMonthData,
  (date, config) => `${date.getFullYear()}-${date.getMonth()}-${config.weekStartsOn}`
);
```

**date-fns tree-shaking:**
```typescript
// ❌ Don't do this (imports entire library)
import { addMonths } from 'date-fns';

// ✅ Do this (tree-shakeable)
import addMonths from 'date-fns/addMonths';
```

**Avoid object creation in loops:**
```typescript
// ❌ Bad
days.map(day => ({ ...day, selected: isSelected(day) }));

// ✅ Good
const dayDataArray = [];
for (const day of days) {
  dayDataArray.push({
    ...day,
    selected: isSelected(day)
  });
}
```

### Store Layer Optimizations

**Zustand subscription granularity:**
```typescript
// ❌ Don't do this (subscribes to all state changes)
const state = useCalendarStore();

// ✅ Do this (subscribes only to currentDate changes)
const currentDate = useCalendarStore(state => state.currentDate);
```

**Immer middleware:**
- Structural sharing: only changed parts of state get new references
- Components only re-render if their selected slice changed

### Hooks Layer Optimizations

**useMemo for expensive calculations:**
```typescript
export function useMonthCalendar(options) {
  const currentDate = useCalendarStore(state => state.currentDate);
  const weekConfig = useCalendarStore(state => state.weekConfig);
  
  // ✅ Only regenerate when currentDate or weekConfig changes
  const monthData = useMemo(
    () => generateMonthData(currentDate, weekConfig),
    [currentDate, weekConfig]
  );
  
  return { monthData, /* ... */ };
}
```

**useCallback for stable function references:**
```typescript
const goToNextMonth = useCallback(() => {
  useCalendarStore.getState().goToNextMonth();
}, []); // Stable reference, won't cause child re-renders
```

**Lazy generation for virtualization:**
```typescript
const generateMonthAtOffset = useCallback((offset: number) => {
  const targetDate = addMonths(currentDate, offset);
  return generateMonthData(targetDate, weekConfig);
}, [currentDate, weekConfig]);

// Month is only generated when FlashList needs to render it
```

### FlashList Integration

**Consistent item sizes:**
```typescript
<FlashList
  estimatedItemSize={350}  // Height of month grid
  // FlashList recycles views efficiently
/>
```

**Key extraction:**
```typescript
keyExtractor={(_, index) => `month-${index}`}
// Stable keys prevent unnecessary re-renders
```

### Bundle Size Targets

| Component | Target Size | Actual (Post-Build) |
|-----------|-------------|---------------------|
| Engine layer | 5-8 KB | TBD |
| Store layer | 2-3 KB | TBD |
| Hooks layer | 5-7 KB | TBD |
| Total library | 15-20 KB | TBD |
| With dependencies | ~95 KB | TBD |
| Gzipped total | ~30 KB | TBD |

---

## Documentation & Developer Experience

### README.md Structure

1. **Hero section**
   - Library name and tagline
   - Key features (headless, TypeScript, performant)
   - Installation command

2. **Quick start**
   ```typescript
   import { useMonthCalendar } from '@calyx/rn';
   
   function MyCalendar() {
     const calendar = useMonthCalendar({ weekStartsOn: 0 });
     
     return (
       <View>
         {calendar.monthData.weeks.map(week => (
           <View key={week.weekNumber} style={{ flexDirection: 'row' }}>
             {week.days.map(day => (
               <Pressable key={day.date.toString()} onPress={() => calendar.selectDate(day.date)}>
                 <Text>{day.calendarDate.day}</Text>
               </Pressable>
             ))}
           </View>
         ))}
       </View>
     );
   }
   ```

3. **Features**
   - Headless architecture
   - Three core hooks
   - TypeScript-first
   - Virtualization support
   - Zero UI opinions

4. **API Overview**
   - Link to full API docs (Phase 7)
   - Brief description of each hook
   - Link to examples

5. **Contributing**
   - How to run tests
   - How to build
   - Code style guidelines

6. **License**
   - MIT

### JSDoc Documentation

All public APIs include JSDoc:

```typescript
/**
 * Hook for managing month calendar view state and navigation.
 * 
 * Provides month data structure, navigation methods, and virtualization helpers
 * for building infinite-scroll month views.
 * 
 * @param options - Configuration options
 * @param options.initialDate - Starting date (defaults to today)
 * @param options.weekStartsOn - First day of week (0 = Sunday, 1 = Monday)
 * @param options.onMonthChange - Callback fired when month changes
 * 
 * @returns Month calendar state and methods
 * 
 * @example
 * ```tsx
 * const calendar = useMonthCalendar({
 *   weekStartsOn: 1,
 *   onMonthChange: (year, month) => console.log(`Now viewing ${year}-${month}`)
 * });
 * 
 * return (
 *   <View>
 *     {calendar.monthData.weeks.map(week => (
 *       <WeekRow key={week.weekNumber} days={week.days} />
 *     ))}
 *   </View>
 * );
 * ```
 */
export function useMonthCalendar(options?: UseMonthCalendarOptions): UseMonthCalendarReturn;
```

### TypeScript IntelliSense

Strict types + JSDoc = excellent autocomplete:
- Hovering over `useMonthCalendar` shows full documentation
- `calendar.monthData.` autocompletes with `weeks`, `year`, `month`, etc.
- Type errors caught before runtime

---

## Phase 1 Deliverables Checklist

### Code Deliverables

- [ ] `src/engine/` - Complete engine layer with all functions
- [ ] `src/store/` - Zustand store with calendar state
- [ ] `src/hooks/` - useCalendar, useMonthCalendar, useWeekCalendar
- [ ] `src/index.ts` - Public API exports
- [ ] `__tests__/` - >85% test coverage
- [ ] `example/` - Three example screens demonstrating hooks
- [ ] `dist/` - Built ESM + CJS + type declarations

### Configuration Deliverables

- [ ] `package.json` - Correct metadata, dependencies, scripts
- [ ] `tsconfig.json` - Strict mode configuration
- [ ] `tsup.config.ts` - Build configuration
- [ ] `jest.config.js` - Test configuration
- [ ] `.gitignore` - Exclude dist/, node_modules/, etc.
- [ ] `.npmignore` - Include only dist/, src/, README, LICENSE

### Documentation Deliverables

- [ ] `README.md` - Quick start, features, API overview
- [ ] JSDoc on all public functions
- [ ] `LICENSE` - MIT license file
- [ ] `CHANGELOG.md` - Version 0.1.0 entry

### Quality Gates

- [ ] All tests passing
- [ ] >85% code coverage
- [ ] TypeScript strict mode with zero errors
- [ ] ESLint passing with zero warnings
- [ ] Example app runs on iOS
- [ ] Example app runs on Android
- [ ] Library builds successfully (`npm run build`)
- [ ] Package size < 100KB (uncompressed)

### Publishing Preparation

- [ ] NPM org `@calyx` created
- [ ] Package name `@calyx/rn` available on NPM
- [ ] Git repository created
- [ ] First commit with working code
- [ ] v0.1.0 git tag

---

## Future Phases Preview

**Phase 1** (this phase) delivers the **foundation**. Here's what comes next:

### Phase 2: UI Component System
- `<Calendar />`, `<MonthView />`, `<WeekView />`, `<DayView />`
- Basic theming (colors, spacing)
- Pressable day cells
- Header components

### Phase 3: Event Management
- Event data structures
- `useEvents` hook
- Event rendering
- Drag and drop
- Conflict detection

### Phase 4: Advanced Views
- `<TimelineView />` (hourly schedule)
- `<AgendaView />` (list mode)
- `<ExpandableCalendar />`
- Resource scheduler

### Phase 5: Theme Engine
- Design token system
- 10+ prebuilt themes
- Dark mode
- Runtime theme switching

### Phase 6: Animation System
- Reanimated integration
- Gesture handling
- Layout animations
- Shared element transitions

### Phase 7: DX & Tooling
- Documentation website
- Storybook
- Playground app
- Figma kit

### Phase 8: Advanced Features
- Plugin architecture
- Timezone deep support
- RRULE recurring events
- Calendar sync adapters (Google, Outlook)

### Phase 9: Production Polish
- Performance audit
- Accessibility audit (WCAG 2.1 AA)
- Comprehensive E2E tests
- CI/CD for releases
- NPM publishing automation

---

## Success Criteria

Phase 1 is **successful** when:

1. ✅ A developer can `npm install @calyx/rn`
2. ✅ Import and use `useMonthCalendar` in <5 minutes
3. ✅ Build a basic month view without touching our internals
4. ✅ All tests pass with >85% coverage
5. ✅ TypeScript provides excellent autocomplete
6. ✅ Example app demonstrates all three hooks
7. ✅ Bundle size is <100KB
8. ✅ Performance is smooth on low-end Android devices
9. ✅ README is clear enough that users don't need to ask questions
10. ✅ Architecture can support Phases 2-9 without major refactoring

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| date-fns bundle size too large | Low | Medium | Tree-shakeable imports, consider Day.js if needed |
| Zustand state not shared correctly | Low | High | Comprehensive hook tests, example app validates |
| FlashList integration issues | Medium | Medium | Document clearly, provide working example |
| TypeScript strict mode slows development | Low | Low | Strict mode catches bugs early, worth the tradeoff |
| Month generation performance | Low | Medium | Memoization, lazy generation, benchmark tests |

### Project Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scope creep into UI components | Medium | High | Hard boundary: Phase 1 = hooks only |
| Over-engineering the architecture | Medium | Medium | YAGNI principle, build what's needed now |
| Insufficient testing | Low | High | 85% coverage requirement enforced |
| Poor documentation | Medium | High | JSDoc required, README review gate |

---

## Open Questions

*None - all clarifying questions answered during brainstorming.*

---

## Approval & Sign-off

**Design Status:** ✅ Approved  
**Ready for Implementation:** Yes  
**Next Step:** Invoke `writing-plans` skill to create implementation plan

---

## Appendix: Package Comparison

How Phase 1 compares to existing React Native calendar libraries:

| Feature | Calyx RN v0.1 | react-native-calendars | react-native-calendar-kit |
|---------|---------------|------------------------|---------------------------|
| Headless architecture | ✅ Yes | ❌ No | ❌ No |
| TypeScript-first | ✅ Strict | ⚠️ Types included | ⚠️ Types included |
| Zero UI opinions | ✅ Yes | ❌ Opinionated UI | ❌ Opinionated UI |
| Zustand state | ✅ Yes | ❌ Internal state | ❌ Internal state |
| FlashList support | ✅ Yes | ⚠️ FlatList | ⚠️ FlatList |
| Virtualization helpers | ✅ Built-in | ❌ Manual | ❌ Manual |
| Engine testability | ✅ Pure functions | ⚠️ Coupled | ⚠️ Coupled |
| Bundle size | ~20KB (library) | ~45KB | ~30KB |
| UI components | ❌ Phase 2 | ✅ Yes | ✅ Yes |
| Themes | ❌ Phase 5 | ✅ Limited | ✅ Limited |
| Event UI | ❌ Phase 3 | ✅ Basic | ✅ Advanced |

**Calyx RN's differentiation:** We're building the **best foundation** for custom calendar UIs, not another opinionated calendar component.

---

*End of Phase 1 Design Specification*
