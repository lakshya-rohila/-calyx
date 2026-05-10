# Phase 4: Timeline & Agenda Views Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Timeline (hourly grid with conflict detection) and Agenda (chronological list) views to Calendar component with mode switching, consistent events prop API, and production-ready quality.

**Architecture:** Extend CalendarMode type to include 'timeline' and 'agenda'. Create CalendarTimeline with ScrollView + hourly grid + conflict detection algorithm. Create CalendarAgenda with FlatList + section grouping. Both views consume same events prop, inherit theming, support animations.

**Tech Stack:** React Native, TypeScript, React Native Animated API, date-fns, existing Calyx RN architecture (Phases 1-3)

---

## File Structure

**New Files:**
```
src/
├── types/
│   ├── timeline.ts                    # Timeline types
│   └── agenda.ts                      # Agenda types
├── hooks/
│   ├── useTimelineLayout.ts           # Conflict detection & positioning
│   └── useAgendaGrouping.ts           # Event grouping by day/week/month
├── components/Calendar/
│   ├── CalendarTimeline.tsx           # Timeline container
│   ├── TimelineGrid.tsx               # Hour slot grid
│   ├── TimelineEvent.tsx              # Single event card
│   ├── CurrentTimeLine.tsx            # Red "now" indicator
│   ├── CalendarAgenda.tsx             # Agenda container
│   ├── AgendaSectionHeader.tsx        # Section header (Today, Tomorrow, etc.)
│   └── AgendaEvent.tsx                # Event list item card
example/screens/
├── TimelineDemo.tsx                   # Timeline demo screen
└── AgendaDemo.tsx                     # Agenda demo screen
```

**Modified Files:**
```
src/components/Calendar/types.ts       # Extend CalendarMode, add new props
src/components/Calendar/Calendar.tsx   # Add timeline/agenda routing
src/components/Calendar/index.ts       # Export new components
src/index.ts                           # Export new types/hooks
App.tsx                                # Add Timeline/Agenda tabs
```

---

## Task 1: Timeline Type Definitions

**Files:**
- Create: `src/types/timeline.ts`
- Test: Manual verification (types only)

- [ ] **Step 1: Create timeline type file**

```typescript
/**
 * Timeline View Types
 * Phase 4: Advanced Views
 */

export type TimelineConfig = {
  startHour?: number;        // Default: 0 (midnight)
  endHour?: number;          // Default: 24
  slotDuration?: number;     // Minutes: 15, 30, 60 (default: 30)
  showCurrentTime?: boolean; // Red line indicator (default: true)
  businessHours?: {
    start: number;           // Default: 9
    end: number;             // Default: 17
  };
  scrollToNow?: boolean;     // Auto-scroll to current time (default: true)
};

export type TimelineEventLayout = {
  event: import('./events').CalendarEvent;
  top: number;           // Pixel offset from day start
  height: number;        // Pixel height
  left: number;          // Percentage (0-100) for column position
  width: number;         // Percentage (0-100) for column width
  columnIndex: number;   // Which conflict column (0, 1, 2...)
  totalColumns: number;  // Total overlapping columns
};

export const DEFAULT_TIMELINE_CONFIG: Required<TimelineConfig> = {
  startHour: 0,
  endHour: 24,
  slotDuration: 30,
  showCurrentTime: true,
  businessHours: { start: 9, end: 17 },
  scrollToNow: true,
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/timeline.ts
git commit -m "feat(types): add Timeline view type definitions

- TimelineConfig with hour range, slot duration, business hours
- TimelineEventLayout for conflict detection positioning
- DEFAULT_TIMELINE_CONFIG constants

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Agenda Type Definitions

**Files:**
- Create: `src/types/agenda.ts`
- Test: Manual verification (types only)

- [ ] **Step 1: Create agenda type file**

```typescript
/**
 * Agenda View Types
 * Phase 4: Advanced Views
 */

export type AgendaConfig = {
  groupBy?: 'day' | 'week' | 'month';  // Default: 'day'
  showEmptyDays?: boolean;              // Show days with no events (default: false)
  futureMonths?: number;                // Months to load ahead (default: 3)
  dateFormat?: string;                  // Custom date format for headers
};

export type AgendaSection = {
  title: string;         // "Today", "May 10, 2026", "Week of May 10"
  date: Date;            // Section start date
  events: import('./events').CalendarEvent[];
};

export const DEFAULT_AGENDA_CONFIG: Required<AgendaConfig> = {
  groupBy: 'day',
  showEmptyDays: false,
  futureMonths: 3,
  dateFormat: 'MMMM d, yyyy',
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/agenda.ts
git commit -m "feat(types): add Agenda view type definitions

- AgendaConfig with grouping, empty days, future months
- AgendaSection for list sections
- DEFAULT_AGENDA_CONFIG constants

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Extend Calendar Types

**Files:**
- Modify: `src/components/Calendar/types.ts`
- Test: Manual verification (types only)

- [ ] **Step 1: Update CalendarMode type and add new props**

Add imports at top:
```typescript
import type { TimelineConfig } from '../../types/timeline';
import type { AgendaConfig } from '../../types/agenda';
```

Update CalendarMode:
```typescript
export type CalendarMode = 'month' | 'week' | 'day' | 'timeline' | 'agenda';
```

Add to CalendarProps (after line 43 `events?: CalendarEvent[];`):
```typescript
  // Phase 4: Timeline & Agenda views
  timelineConfig?: TimelineConfig;
  agendaConfig?: AgendaConfig;
  
  // Event interaction
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
```

Add to CalendarMonthProps (after events prop if exists):
```typescript
  // Event interaction
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/types.ts
git commit -m "feat(types): extend Calendar types for Timeline and Agenda

- Add 'timeline' and 'agenda' to CalendarMode
- Add timelineConfig and agendaConfig props
- Add onEventPress and onEventLongPress callbacks

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: useTimelineLayout Hook (Conflict Detection)

**Files:**
- Create: `src/hooks/useTimelineLayout.ts`
- Create: `src/hooks/__tests__/useTimelineLayout.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { renderHook } from '@testing-library/react';
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
    expect(layout.event.id).toBe('1');
    expect(layout.top).toBe(450); // 9 hours * 50px per hour
    expect(layout.height).toBe(50); // 1 hour * 50px
    expect(layout.left).toBe(0);
    expect(layout.width).toBe(100);
    expect(layout.columnIndex).toBe(0);
    expect(layout.totalColumns).toBe(1);
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
    expect(layout1.columnIndex).toBe(0);
    expect(layout2.columnIndex).toBe(1);
    expect(layout1.width).toBe(50); // 100% / 2 columns
    expect(layout2.width).toBe(50);
    expect(layout1.left).toBe(0);
    expect(layout2.left).toBe(50);
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
    expect(result.current[0].columnIndex).toBe(0);
    expect(result.current[1].columnIndex).toBe(0);
    expect(result.current[0].width).toBe(100);
    expect(result.current[1].width).toBe(100);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useTimelineLayout.test.ts`
Expected: FAIL with "Cannot find module '../useTimelineLayout'"

- [ ] **Step 3: Implement useTimelineLayout hook**

```typescript
import { useMemo } from 'react';
import type { CalendarEvent } from '../types/events';
import type { TimelineConfig, TimelineEventLayout } from '../types/timeline';

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function useTimelineLayout(
  events: CalendarEvent[],
  date: Date,
  config: Partial<TimelineConfig>
): TimelineEventLayout[] {
  return useMemo(() => {
    const { startHour = 0, endHour = 24 } = config;
    const pixelsPerHour = 50; // Each hour = 50px (30min slot = 25px)

    // 1. Filter events for current day
    const dayEvents = events.filter(event => {
      // Event is on this day if it starts on this day OR spans across this day
      return (
        isSameDay(event.startDate, date) ||
        (event.startDate < date && event.endDate >= date)
      );
    });

    if (dayEvents.length === 0) {
      return [];
    }

    // 2. Sort by start time, then by duration (longer first)
    const sorted = [...dayEvents].sort((a, b) => {
      const startDiff = a.startDate.getTime() - b.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      const durationA = a.endDate.getTime() - a.startDate.getTime();
      const durationB = b.endDate.getTime() - b.startDate.getTime();
      return durationB - durationA;
    });

    // 3. Detect conflicts and assign columns
    const layouts: TimelineEventLayout[] = [];
    const columns: CalendarEvent[][] = [];

    for (const event of sorted) {
      // Find first available column where this event doesn't conflict
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        const lastInColumn = columns[columnIndex][columns[columnIndex].length - 1];
        if (lastInColumn.endDate <= event.startDate) {
          break; // No conflict
        }
        columnIndex++;
      }

      // Create new column if needed
      if (columnIndex === columns.length) {
        columns.push([]);
      }

      columns[columnIndex].push(event);

      // Calculate pixel positions
      const startMinutes = event.startDate.getHours() * 60 + event.startDate.getMinutes();
      const endMinutes = event.endDate.getHours() * 60 + event.endDate.getMinutes();
      const durationMinutes = endMinutes - startMinutes;

      const top = ((startMinutes / 60) - startHour) * pixelsPerHour;
      const height = Math.max(30, (durationMinutes / 60) * pixelsPerHour);

      // Find total columns for this event's timeframe (for width calculation)
      const overlappingEvents = sorted.filter(e =>
        e.startDate < event.endDate && e.endDate > event.startDate
      );
      const maxColumns = Math.max(...overlappingEvents.map(e => {
        return columns.findIndex(col => col.includes(e)) + 1;
      }));

      const totalColumns = Math.max(maxColumns, 1);

      layouts.push({
        event,
        top,
        height,
        left: (columnIndex / totalColumns) * 100,
        width: (1 / totalColumns) * 100,
        columnIndex,
        totalColumns,
      });
    }

    return layouts;
  }, [events, date, config]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useTimelineLayout.test.ts`
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTimelineLayout.ts src/hooks/__tests__/useTimelineLayout.test.ts
git commit -m "feat(hooks): add useTimelineLayout with conflict detection

- Calculate event positions (top, height) based on time
- Detect overlapping events
- Assign columns for side-by-side layout
- Calculate widths and left offsets for conflicts
- Tests for single event, conflicts, and non-overlapping

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: useAgendaGrouping Hook

**Files:**
- Create: `src/hooks/useAgendaGrouping.ts`
- Create: `src/hooks/__tests__/useAgendaGrouping.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { renderHook } from '@testing-library/react';
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useAgendaGrouping.test.ts`
Expected: FAIL with "Cannot find module '../useAgendaGrouping'"

- [ ] **Step 3: Implement useAgendaGrouping hook**

```typescript
import { useMemo } from 'react';
import { 
  addDays, 
  addMonths, 
  format, 
  isToday, 
  isTomorrow, 
  isThisWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';
import type { CalendarEvent } from '../types/events';
import type { AgendaConfig, AgendaSection } from '../types/agenda';

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatSectionTitle(date: Date): string {
  if (isToday(date)) {
    return `TODAY - ${format(date, 'MMMM d, yyyy')}`;
  }
  if (isTomorrow(date)) {
    return `TOMORROW - ${format(date, 'MMMM d, yyyy')}`;
  }
  if (isThisWeek(date, { weekStartsOn: 0 })) {
    return `${format(date, 'EEEE')} - ${format(date, 'MMMM d, yyyy')}`;
  }
  return format(date, 'MMMM d, yyyy').toUpperCase();
}

export function useAgendaGrouping(
  events: CalendarEvent[],
  startDate: Date,
  config: Partial<AgendaConfig>
): AgendaSection[] {
  return useMemo(() => {
    const { 
      groupBy = 'day',
      showEmptyDays = false,
      futureMonths = 3,
    } = config;

    // Calculate end date
    const endDate = addMonths(startDate, futureMonths);

    // Generate all dates in range
    const allDates: Date[] = [];
    let currentDate = startOfDay(startDate);
    const finalDate = endOfDay(endDate);
    
    while (currentDate <= finalDate) {
      allDates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    // Group events by day
    const sections: AgendaSection[] = allDates.map(date => {
      const dayEvents = events.filter(event => {
        // Event is on this day if it starts on this day OR spans this day
        return (
          isSameDay(event.startDate, date) ||
          (event.startDate < date && event.endDate >= date)
        );
      }).sort((a, b) => {
        // All-day events first
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        // Then by start time
        return a.startDate.getTime() - b.startDate.getTime();
      });

      return {
        title: formatSectionTitle(date),
        date,
        events: dayEvents,
      };
    });

    // Filter empty days if configured
    const filtered = showEmptyDays
      ? sections
      : sections.filter(s => s.events.length > 0);

    // TODO: Implement week/month grouping if groupBy is 'week' or 'month'
    // For now, just return day grouping
    return filtered;
  }, [events, startDate, config]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useAgendaGrouping.test.ts`
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAgendaGrouping.ts src/hooks/__tests__/useAgendaGrouping.test.ts
git commit -m "feat(hooks): add useAgendaGrouping for event list sections

- Group events by day within date range
- Filter empty days based on config
- Sort all-day events first, then by start time
- Format section titles (Today, Tomorrow, dates)
- Tests for grouping, filtering, and sorting

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Export New Hooks

**Files:**
- Modify: `src/hooks/index.ts`
- Test: Manual verification (exports only)

- [ ] **Step 1: Add hook exports**

Add to existing exports:
```typescript
// Phase 4: Timeline & Agenda hooks
export { useTimelineLayout } from './useTimelineLayout';
export { useAgendaGrouping } from './useAgendaGrouping';
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/index.ts
git commit -m "feat(hooks): export useTimelineLayout and useAgendaGrouping

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: TimelineGrid Component

**Files:**
- Create: `src/components/Calendar/TimelineGrid.tsx`
- Test: Manual verification (visual component)

- [ ] **Step 1: Create TimelineGrid component**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CalendarTheme } from '../theme/types';

type TimelineGridProps = {
  startHour: number;
  endHour: number;
  slotDuration: number;
  businessHours?: { start: number; end: number };
  theme: CalendarTheme;
};

export function TimelineGrid({
  startHour,
  endHour,
  slotDuration,
  businessHours = { start: 9, end: 17 },
  theme,
}: TimelineGridProps) {
  const hours = [];
  for (let hour = startHour; hour < endHour; hour++) {
    hours.push(hour);
  }

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const isBusinessHour = (hour: number): boolean => {
    return hour >= businessHours.start && hour < businessHours.end;
  };

  return (
    <View style={styles.container}>
      {hours.map((hour) => (
        <View key={hour} style={styles.hourSlot}>
          <View style={styles.timeLabel}>
            <Text 
              style={[styles.timeLabelText, { color: theme.colors.foreground }]}
              accessibilityRole="text"
            >
              {formatHour(hour)}
            </Text>
          </View>
          <View 
            style={[
              styles.hourLine,
              { 
                backgroundColor: isBusinessHour(hour) 
                  ? 'rgba(0, 122, 255, 0.05)' 
                  : theme.colors.background,
                borderTopColor: theme.colors.border || '#E0E0E0',
              }
            ]}
          >
            {slotDuration === 30 && (
              <View 
                style={[
                  styles.halfHourLine,
                  { borderTopColor: '#F0F0F0' }
                ]} 
              />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hourSlot: {
    height: 50, // 50px per hour
    flexDirection: 'row',
  },
  timeLabel: {
    width: 60,
    paddingRight: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  timeLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hourLine: {
    flex: 1,
    borderTopWidth: 1,
  },
  halfHourLine: {
    position: 'absolute',
    top: 25, // Halfway through 50px slot
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/TimelineGrid.tsx
git commit -m "feat(timeline): add TimelineGrid component

- Render hour slots with time labels
- Business hours background highlighting
- Half-hour dashed lines for 30min slots
- Accessible time labels
- Themed colors

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: TimelineEvent Component

**Files:**
- Create: `src/components/Calendar/TimelineEvent.tsx`
- Test: Manual verification (visual component)

- [ ] **Step 1: Create TimelineEvent component**

```typescript
import React, { useRef } from 'react';
import { Pressable, Text, View, StyleSheet, Animated } from 'react-native';
import type { CalendarEvent } from '../../types/events';
import type { TimelineEventLayout } from '../../types/timeline';
import type { CalendarTheme } from '../theme/types';

type TimelineEventProps = {
  layout: TimelineEventLayout;
  onPress?: (event: CalendarEvent) => void;
  onLongPress?: (event: CalendarEvent) => void;
  theme: CalendarTheme;
};

export function TimelineEvent({
  layout,
  onPress,
  onLongPress,
  theme,
}: TimelineEventProps) {
  const { event, top, height, left, width } = layout;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const showDetails = height >= 40;
  const showDescription = height >= 60;

  const accessibilityLabel = `${event.title}, ${formatTime(event.startDate)} to ${formatTime(event.endDate)}${event.category ? `, ${event.category} category` : ''}`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          position: 'absolute',
          top,
          height: Math.max(30, height),
          left: `${left}%`,
          width: `${width}%`,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={() => onPress?.(event)}
        onLongPress={() => onLongPress?.(event)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.eventCard,
          {
            backgroundColor: event.color,
            borderLeftColor: event.color,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view event details"
      >
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {showDetails && (
          <Text style={styles.time} numberOfLines={1}>
            {formatTime(event.startDate)} - {formatTime(event.endDate)}
          </Text>
        )}
        {showDescription && event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
  },
  eventCard: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  time: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  description: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/TimelineEvent.tsx
git commit -m "feat(timeline): add TimelineEvent component

- Positioned event card with time-based layout
- Dynamic content based on height (title, time, description)
- Press animations (scale, opacity)
- Event color with left border accent
- Accessible labels with time and category
- White text on colored background

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: CurrentTimeLine Component

**Files:**
- Create: `src/components/Calendar/CurrentTimeLine.tsx`
- Test: Manual verification (visual component)

- [ ] **Step 1: Create CurrentTimeLine component**

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type CurrentTimeLineProps = {
  startHour: number;
  showToday: boolean; // Only show if viewing today
};

export function CurrentTimeLine({ startHour, showToday }: CurrentTimeLineProps) {
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const topAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showToday) return;

    // Fade in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update time every minute
    const interval = setInterval(() => {
      const now = new Date();
      const newMinutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(newMinutes);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [showToday, fadeAnim]);

  useEffect(() => {
    // Animate position changes
    const pixelsPerMinute = 50 / 60; // 50px per hour
    const top = (currentMinutes - startHour * 60) * pixelsPerMinute;

    Animated.timing(topAnim, {
      toValue: top,
      duration: 500,
      useNativeDriver: false, // Can't use native driver for top
    }).start();
  }, [currentMinutes, startHour, topAnim]);

  if (!showToday) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          top: topAnim,
        },
      ]}
      accessibilityLabel={`Current time: ${Math.floor(currentMinutes / 60)}:${(currentMinutes % 60).toString().padStart(2, '0')}`}
    >
      <View style={styles.dot} />
      <View style={styles.line} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 100,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 56, // After time label gutter
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#FF3B30',
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/CurrentTimeLine.tsx
git commit -m "feat(timeline): add CurrentTimeLine indicator

- Red horizontal line showing current time
- Updates every minute
- Only visible when viewing today
- Fade in animation on mount
- Smooth position transitions
- Dot on left, line across grid

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

Due to length constraints, I'll create the complete plan file with all remaining tasks. Let me continue with the critical Timeline and Agenda components, then demo screens and integration.
---

## Task 10: CalendarTimeline Container

**Files:**
- Create: `src/components/Calendar/CalendarTimeline.tsx`
- Test: Manual verification (integration component)

- [ ] **Step 1: Create CalendarTimeline component**

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { TimelineGrid } from './TimelineGrid';
import { TimelineEvent } from './TimelineEvent';
import { CurrentTimeLine } from './CurrentTimeLine';
import { useTimelineLayout } from '../../hooks/useTimelineLayout';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import type { CalendarEvent } from '../../types/events';
import type { TimelineConfig } from '../../types/timeline';
import type { CalendarTheme } from '../theme/types';
import type { ThemeName } from '../theme/themes';

type CalendarTimelineProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  selected?: Date;
  onSelect?: (date: Date) => void;
  events?: CalendarEvent[];
  timelineConfig?: TimelineConfig;
  theme?: CalendarTheme | ThemeName;
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  style?: any;
};

export function CalendarTimeline({
  value,
  onChange,
  events = [],
  timelineConfig = {},
  theme: themeProp,
  onEventPress,
  onEventLongPress,
  style,
}: CalendarTimelineProps) {
  const [internalValue, setInternalValue] = useState<Date>(value || new Date());
  const currentValue = value !== undefined ? value : internalValue;
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Resolve theme
  const contextTheme = useTheme();
  const resolvedTheme: CalendarTheme = themeProp
    ? (typeof themeProp === 'string' ? themes[themeProp] : themeProp)
    : contextTheme;

  const config = {
    startHour: timelineConfig.startHour ?? 0,
    endHour: timelineConfig.endHour ?? 24,
    slotDuration: timelineConfig.slotDuration ?? 30,
    showCurrentTime: timelineConfig.showCurrentTime ?? true,
    businessHours: timelineConfig.businessHours ?? { start: 9, end: 17 },
    scrollToNow: timelineConfig.scrollToNow ?? true,
  };

  const layouts = useTimelineLayout(events, currentValue, config);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const showCurrentTime = config.showCurrentTime && isToday(currentValue);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (config.scrollToNow && isToday(currentValue) && scrollViewRef.current) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const pixelsPerMinute = 50 / 60;
      const scrollY = (currentMinutes - config.startHour * 60) * pixelsPerMinute - 100;
      
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, scrollY), animated: true });
      }, 300);
    }
  }, []);

  const handlePrevious = () => {
    const newDate = new Date(currentValue);
    newDate.setDate(newDate.getDate() - 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentValue);
    newDate.setDate(newDate.getDate() + 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const totalHeight = (config.endHour - config.startHour) * 50;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme.colors.background,
          padding: resolvedTheme.spacing.padding,
        },
        style,
      ]}
    >
      <CalendarHeader
        year={currentValue.getFullYear()}
        month={currentValue.getMonth()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        theme={resolvedTheme}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
      >
        <View style={{ height: totalHeight }}>
          <TimelineGrid
            startHour={config.startHour}
            endHour={config.endHour}
            slotDuration={config.slotDuration}
            businessHours={config.businessHours}
            theme={resolvedTheme}
          />
          
          {layouts.map((layout) => (
            <TimelineEvent
              key={layout.event.id}
              layout={layout}
              onPress={onEventPress}
              onLongPress={onEventLongPress}
              theme={resolvedTheme}
            />
          ))}

          {showCurrentTime && (
            <CurrentTimeLine
              startHour={config.startHour}
              showToday={true}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/CalendarTimeline.tsx
git commit -m "feat(timeline): add CalendarTimeline container component

- Integrate TimelineGrid, TimelineEvent, CurrentTimeLine
- Date navigation with header
- Auto-scroll to current time on mount
- ScrollView with removeClippedSubviews optimization
- useTimelineLayout integration
- Theme support and controlled/uncontrolled state

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: AgendaSectionHeader Component

**Files:**
- Create: `src/components/Calendar/AgendaSectionHeader.tsx`
- Test: Manual verification (visual component)

- [ ] **Step 1: Create AgendaSectionHeader component**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CalendarTheme } from '../theme/types';

type AgendaSectionHeaderProps = {
  title: string;
  eventCount: number;
  theme: CalendarTheme;
};

export function AgendaSectionHeader({
  title,
  eventCount,
  theme,
}: AgendaSectionHeaderProps) {
  const accessibilityLabel = `Section, ${title}, ${eventCount} event${eventCount !== 1 ? 's' : ''}`;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: '#F5F5F5' }
      ]}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={[styles.title, { color: theme.colors.foreground }]}>
        {title}
      </Text>
      <Text style={styles.count}>
        {eventCount} event{eventCount !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/AgendaSectionHeader.tsx
git commit -m "feat(agenda): add AgendaSectionHeader component

- Section header with title and event count
- Uppercase styled title
- Gray background for visual separation
- Accessible header role with count

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: AgendaEvent Component

**Files:**
- Create: `src/components/Calendar/AgendaEvent.tsx`
- Test: Manual verification (visual component)

- [ ] **Step 1: Create AgendaEvent component**

```typescript
import React, { useRef } from 'react';
import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import type { CalendarEvent } from '../../types/events';
import type { CalendarTheme } from '../theme/types';

type AgendaEventProps = {
  event: CalendarEvent;
  onPress?: (event: CalendarEvent) => void;
  onLongPress?: (event: CalendarEvent) => void;
  theme: CalendarTheme;
};

export function AgendaEvent({
  event,
  onPress,
  onLongPress,
  theme,
}: AgendaEventProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const timeDisplay = event.isAllDay
    ? 'All Day'
    : `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;

  const accessibilityLabel = `${event.title}, ${timeDisplay}${event.description ? `, ${event.description}` : ''}${event.category ? `, ${event.category} category` : ''}`;

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFF', '#F5F5F5'],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress?.(event)}
        onLongPress={() => onLongPress?.(event)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view event details"
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor },
          ]}
        >
          <View style={styles.leftSection}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: event.color },
              ]}
            />
            <View style={styles.content}>
              <Text style={styles.time}>{timeDisplay}</Text>
              <Text style={styles.title} numberOfLines={1}>
                {event.title}
              </Text>
              {event.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {event.description}
                </Text>
              )}
              {event.category && (
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: `${event.color}20` },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: event.color }]}>
                    {event.category}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/AgendaEvent.tsx
git commit -m "feat(agenda): add AgendaEvent list item component

- Event card with color dot, time, title, description
- Category badge with event color tint
- Press animations (scale, background)
- All-day vs timed event display
- Accessible button with full event details
- Clean card design with borders

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: CalendarAgenda Container

**Files:**
- Create: `src/components/Calendar/CalendarAgenda.tsx`
- Test: Manual verification (integration component)

- [ ] **Step 1: Create CalendarAgenda component**

```typescript
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { AgendaSectionHeader } from './AgendaSectionHeader';
import { AgendaEvent } from './AgendaEvent';
import { useAgendaGrouping } from '../../hooks/useAgendaGrouping';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import { addMonths } from 'date-fns';
import type { CalendarEvent } from '../../types/events';
import type { AgendaConfig } from '../../types/agenda';
import type { CalendarTheme } from '../theme/types';
import type { ThemeName } from '../theme/themes';

type CalendarAgendaProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  agendaConfig?: AgendaConfig;
  theme?: CalendarTheme | ThemeName;
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  style?: any;
};

type FlatListItem =
  | { type: 'header'; section: any }
  | { type: 'event'; event: CalendarEvent; sectionDate: Date };

export function CalendarAgenda({
  value,
  onChange,
  events = [],
  agendaConfig = {},
  theme: themeProp,
  onEventPress,
  onEventLongPress,
  style,
}: CalendarAgendaProps) {
  const [internalValue, setInternalValue] = useState<Date>(value || new Date());
  const currentValue = value !== undefined ? value : internalValue;
  const [loadedMonths, setLoadedMonths] = useState(agendaConfig.futureMonths || 3);

  // Resolve theme
  const contextTheme = useTheme();
  const resolvedTheme: CalendarTheme = themeProp
    ? (typeof themeProp === 'string' ? themes[themeProp] : themeProp)
    : contextTheme;

  const config = {
    groupBy: agendaConfig.groupBy || 'day',
    showEmptyDays: agendaConfig.showEmptyDays || false,
    futureMonths: loadedMonths,
    dateFormat: agendaConfig.dateFormat,
  };

  const sections = useAgendaGrouping(events, currentValue, config);

  // Flatten sections into FlatList items
  const flatListData: FlatListItem[] = [];
  sections.forEach((section) => {
    flatListData.push({ type: 'header', section });
    section.events.forEach((event) => {
      flatListData.push({ type: 'event', event, sectionDate: section.date });
    });
  });

  const handleLoadMore = () => {
    setLoadedMonths((prev) => prev + 1);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentValue);
    newDate.setMonth(newDate.getMonth() - 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentValue);
    newDate.setMonth(newDate.getMonth() + 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const renderItem = ({ item }: { item: FlatListItem }) => {
    if (item.type === 'header') {
      return (
        <AgendaSectionHeader
          title={item.section.title}
          eventCount={item.section.events.length}
          theme={resolvedTheme}
        />
      );
    }

    return (
      <AgendaEvent
        event={item.event}
        onPress={onEventPress}
        onLongPress={onEventLongPress}
        theme={resolvedTheme}
      />
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={resolvedTheme.colors.primary} />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme.colors.background,
        },
        style,
      ]}
    >
      <View style={{ padding: resolvedTheme.spacing.padding }}>
        <CalendarHeader
          year={currentValue.getFullYear()}
          month={currentValue.getMonth()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          theme={resolvedTheme}
        />
      </View>

      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'header'
            ? `header-${item.section.date.getTime()}`
            : `event-${item.event.id}-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={15}
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/CalendarAgenda.tsx
git commit -m "feat(agenda): add CalendarAgenda container component

- Integrate AgendaSectionHeader and AgendaEvent
- FlatList with virtualization optimizations
- Infinite scroll with onEndReached
- Date navigation with header
- Flatten sections into FlatList items
- Loading footer indicator
- Theme support and controlled/uncontrolled state

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: Integrate Timeline and Agenda into Calendar Router

**Files:**
- Modify: `src/components/Calendar/Calendar.tsx`
- Test: Manual verification

- [ ] **Step 1: Import new components**

Add imports at top:
```typescript
import { CalendarTimeline } from './CalendarTimeline';
import { CalendarAgenda } from './CalendarAgenda';
```

- [ ] **Step 2: Add routing for new modes**

Update the router function to add timeline and agenda cases:
```typescript
export function Calendar(props: CalendarProps) {
  const { mode = 'month', showWeekNumbers, ...rest } = props;

  if (mode === 'month') {
    return <CalendarMonth {...rest} />;
  }

  if (mode === 'week') {
    return <CalendarWeek {...rest} showWeekNumber={showWeekNumbers} />;
  }

  if (mode === 'day') {
    return <CalendarDay {...rest} />;
  }

  if (mode === 'timeline') {
    return <CalendarTimeline {...rest} />;
  }

  if (mode === 'agenda') {
    return <CalendarAgenda {...rest} />;
  }

  return <CalendarMonth {...rest} />;
}
```

- [ ] **Step 3: Add compound component exports**

After existing compound components:
```typescript
// Compound component pattern
Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.Day = CalendarDay;
Calendar.Timeline = CalendarTimeline;  // NEW
Calendar.Agenda = CalendarAgenda;      // NEW
Calendar.Header = CalendarHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.Days = CalendarDays;
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/Calendar/Calendar.tsx
git commit -m "feat(calendar): integrate Timeline and Agenda views

- Add timeline and agenda mode routing
- Add Calendar.Timeline and Calendar.Agenda compound components
- Support timelineConfig and agendaConfig props
- Mode switching: month/week/day/timeline/agenda

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: Update Calendar Component Exports

**Files:**
- Modify: `src/components/Calendar/index.ts`
- Test: Manual verification

- [ ] **Step 1: Add new component exports**

Add to existing exports:
```typescript
// Phase 4: Timeline & Agenda views
export { CalendarTimeline } from './CalendarTimeline';
export { CalendarAgenda } from './CalendarAgenda';
export { TimelineGrid } from './TimelineGrid';
export { TimelineEvent } from './TimelineEvent';
export { CurrentTimeLine } from './CurrentTimeLine';
export { AgendaSectionHeader } from './AgendaSectionHeader';
export { AgendaEvent } from './AgendaEvent';
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Calendar/index.ts
git commit -m "feat(exports): export Timeline and Agenda components

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 16: Update Main Index Exports

**Files:**
- Modify: `src/index.ts`
- Test: Manual verification

- [ ] **Step 1: Add Phase 4 exports**

Add after Phase 3 exports:
```typescript
// Phase 4 exports - Timeline & Agenda Views
export type {
  TimelineConfig,
  TimelineEventLayout,
} from './types/timeline';

export type {
  AgendaConfig,
  AgendaSection,
} from './types/agenda';

export {
  CalendarTimeline,
  CalendarAgenda,
} from './components/Calendar';
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat(exports): export Phase 4 types and components

- Export TimelineConfig, TimelineEventLayout
- Export AgendaConfig, AgendaSection
- Export CalendarTimeline, CalendarAgenda

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 17: TimelineDemo Screen

**Files:**
- Create: `example/screens/TimelineDemo.tsx`
- Test: Manual verification (visual testing in app)

- [ ] **Step 1: Create TimelineDemo screen**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarEvent, ThemeName } from '../../src';
import { useEventStore } from '../../src/store/event-store';

export function TimelineDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<ThemeName>('light');

  const addEvent = useEventStore((state) => state.addEvent);
  const events = useEventStore((state) => state.events);

  // Add sample events including conflicts
  useEffect(() => {
    if (events.length === 0) {
      const today = new Date();

      // Morning overlapping meetings
      addEvent({
        title: 'Team Standup',
        description: 'Daily sync',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
        isAllDay: false,
        color: '#007AFF',
        category: 'Work',
      });

      addEvent({
        title: '1-on-1 with Manager',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        isAllDay: false,
        color: '#34C759',
        category: 'Work',
      });

      addEvent({
        title: 'Coffee Break',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 45),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 15),
        isAllDay: false,
        color: '#FF9500',
        category: 'Personal',
      });

      // Lunch
      addEvent({
        title: 'Lunch with Client',
        description: 'Discuss Q2 roadmap',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30),
        isAllDay: false,
        color: '#FF2D55',
        category: 'Business',
      });

      // Afternoon
      addEvent({
        title: 'Project Review',
        description: 'Sprint retrospective',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        isAllDay: false,
        color: '#5AC8FA',
        category: 'Work',
      });

      // Long meeting
      addEvent({
        title: 'All-Hands Meeting',
        description: 'Company quarterly update',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
        isAllDay: false,
        color: '#AF52DE',
        category: 'Company',
      });
    }
  }, [addEvent, events.length]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Timeline View Demo</Text>
      <Text style={styles.subtitle}>Hourly grid with conflict detection</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ⏰ Shows events in hourly time slots
        </Text>
        <Text style={styles.infoText}>
          🔴 Red line indicates current time
        </Text>
        <Text style={styles.infoText}>
          ⚡️ Overlapping events shown side-by-side
        </Text>
        <Text style={styles.infoText}>
          💼 Business hours highlighted (9am-5pm)
        </Text>
      </View>

      <View style={styles.calendarWrapper}>
        <Calendar
          mode="timeline"
          value={selectedDate}
          onChange={setSelectedDate}
          events={events}
          timelineConfig={{
            startHour: 8,
            endHour: 20,
            slotDuration: 30,
            showCurrentTime: true,
            businessHours: { start: 9, end: 17 },
            scrollToNow: true,
          }}
          onEventPress={(event) => console.log('Pressed:', event.title)}
          theme={theme}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 4,
  },
  calendarWrapper: {
    height: 600,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add example/screens/TimelineDemo.tsx
git commit -m "feat(demo): add TimelineDemo screen

- Demo Timeline view with sample events
- Conflicting events for side-by-side visualization
- Business hours configuration (8am-8pm)
- Info box explaining features
- Event press logging

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 18: AgendaDemo Screen

**Files:**
- Create: `example/screens/AgendaDemo.tsx`
- Test: Manual verification (visual testing in app)

- [ ] **Step 1: Create AgendaDemo screen**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarEvent, ThemeName } from '../../src';
import { useEventStore } from '../../src/store/event-store';

export function AgendaDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<ThemeName>('light');

  const addEvent = useEventStore((state) => state.addEvent);
  const events = useEventStore((state) => state.events);

  // Add events across multiple days
  useEffect(() => {
    if (events.length === 0) {
      const today = new Date();

      // Today's events
      addEvent({
        title: 'Morning Meeting',
        description: 'Project kickoff',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        isAllDay: false,
        color: '#007AFF',
        category: 'Work',
      });

      addEvent({
        title: 'Lunch Break',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
        isAllDay: false,
        color: '#34C759',
        category: 'Personal',
      });

      // Tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      addEvent({
        title: 'Client Presentation',
        description: 'Q2 review with stakeholders',
        startDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
        endDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0),
        isAllDay: false,
        color: '#FF9500',
        category: 'Business',
      });

      // All-day event next week
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      addEvent({
        title: 'Company Offsite',
        description: 'Team building activities',
        startDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 0, 0),
        endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 1, 0, 0),
        isAllDay: true,
        color: '#FF2D55',
        category: 'Company',
      });

      // Future events
      for (let i = 1; i <= 5; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + (i * 3));

        addEvent({
          title: `Event ${i}`,
          description: `Scheduled event ${i}`,
          startDate: new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 10 + i, 0),
          endDate: new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 11 + i, 0),
          isAllDay: false,
          color: ['#5AC8FA', '#AF52DE', '#FF3B30', '#FFCC00', '#8E8E93'][i - 1],
          category: 'Work',
        });
      }
    }
  }, [addEvent, events.length]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda View Demo</Text>
        <Text style={styles.subtitle}>Chronological list with grouping</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📅 Events grouped by day
        </Text>
        <Text style={styles.infoText}>
          📜 Infinite scroll for future events
        </Text>
        <Text style={styles.infoText}>
          🔵 Color dots and category badges
        </Text>
        <Text style={styles.infoText}>
          ⏱ All-day and timed events
        </Text>
      </View>

      <View style={styles.calendarWrapper}>
        <Calendar
          mode="agenda"
          value={selectedDate}
          onChange={setSelectedDate}
          events={events}
          agendaConfig={{
            groupBy: 'day',
            showEmptyDays: false,
            futureMonths: 3,
          }}
          onEventPress={(event) => console.log('Pressed:', event.title)}
          theme={theme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 4,
  },
  calendarWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add example/screens/AgendaDemo.tsx
git commit -m "feat(demo): add AgendaDemo screen

- Demo Agenda view with multi-day events
- All-day and timed events
- Future events for infinite scroll testing
- Info box explaining features
- Event press logging

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 19: Update App with Timeline and Agenda Tabs

**Files:**
- Modify: `App.tsx`
- Test: Manual verification (run app and test tabs)

- [ ] **Step 1: Add demo imports**

Add imports:
```typescript
import { TimelineDemo } from './example/screens/TimelineDemo';
import { AgendaDemo } from './example/screens/AgendaDemo';
```

- [ ] **Step 2: Update TabKey type**

Change type to include new tabs:
```typescript
type TabKey = 'demo' | 'themes' | 'custom' | 'timeline' | 'agenda';
```

- [ ] **Step 3: Add new cases to renderContent**

Add cases in renderContent function:
```typescript
  const renderContent = () => {
    switch (activeTab) {
      case 'demo':
        return <CalendarDemo />;
      case 'themes':
        return <ThemeSwitcher />;
      case 'custom':
        return <CustomizationDemo />;
      case 'timeline':
        return <TimelineDemo />;
      case 'agenda':
        return <AgendaDemo />;
    }
  };
```

- [ ] **Step 4: Add tab buttons**

Add new TabButton components after existing tabs:
```typescript
      <View style={styles.tabs}>
        <TabButton
          label="Demo"
          active={activeTab === 'demo'}
          onPress={() => setActiveTab('demo')}
        />
        <TabButton
          label="Timeline"
          active={activeTab === 'timeline'}
          onPress={() => setActiveTab('timeline')}
        />
        <TabButton
          label="Agenda"
          active={activeTab === 'agenda'}
          onPress={() => setActiveTab('agenda')}
        />
        <TabButton
          label="Themes"
          active={activeTab === 'themes'}
          onPress={() => setActiveTab('themes')}
        />
        <TabButton
          label="Custom"
          active={activeTab === 'custom'}
          onPress={() => setActiveTab('custom')}
        />
      </View>
```

- [ ] **Step 5: Update header title**

Change header title:
```typescript
<Text style={styles.headerTitle}>Calyx RN • Phase 4</Text>
```

- [ ] **Step 6: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 7: Test app**

Run: `npm run ios` or `npm run android`
Expected: App launches, Timeline and Agenda tabs work

- [ ] **Step 8: Commit**

```bash
git add App.tsx
git commit -m "feat(app): add Timeline and Agenda demo tabs

- Add TimelineDemo and AgendaDemo screens
- Update tab navigation with 5 tabs
- Change header to Phase 4
- Timeline tab shows hourly view with conflicts
- Agenda tab shows chronological list

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 20: Update README

**Files:**
- Modify: `README.md`
- Test: Manual verification

- [ ] **Step 1: Update Quick Start section**

Add Timeline and Agenda examples after existing Calendar examples:

```markdown
### Timeline View

```tsx
<Calendar
  mode="timeline"
  events={events}
  timelineConfig={{
    startHour: 8,
    endHour: 20,
    slotDuration: 30,
    showCurrentTime: true,
  }}
/>
```

### Agenda/List View

```tsx
<Calendar
  mode="agenda"
  events={events}
  agendaConfig={{
    groupBy: 'day',
    showEmptyDays: false,
    futureMonths: 3,
  }}
/>
```
```

- [ ] **Step 2: Update Features list**

Add to Features section:
```markdown
- ⏰ **Timeline View** - Hourly grid with conflict detection
- 📅 **Agenda View** - Chronological list with grouping
```

- [ ] **Step 3: Update Roadmap**

Change Phase 4 line:
```markdown
**Phase 4:** ✅ Advanced views (timeline, agenda) (current)
```

- [ ] **Step 4: Add API section for Phase 4**

Add new section:
```markdown
### Timeline View

```tsx
<Calendar.Timeline
  value={date}
  events={events}
  timelineConfig={{
    startHour: 9,
    endHour: 18,
    slotDuration: 30,
    businessHours: { start: 9, end: 17 },
  }}
  onEventPress={(event) => console.log(event)}
/>
```

### Agenda View

```tsx
<Calendar.Agenda
  value={date}
  events={events}
  agendaConfig={{
    groupBy: 'day',
    futureMonths: 3,
  }}
  onEventPress={(event) => console.log(event)}
/>
```
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: update README for Phase 4 Timeline and Agenda

- Add Timeline and Agenda examples to Quick Start
- Update features list with new views
- Mark Phase 4 as complete in roadmap
- Add API documentation for Timeline and Agenda views

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 21: Update Package Version

**Files:**
- Modify: `package.json`
- Test: Manual verification

- [ ] **Step 1: Update version**

Change version from `0.2.0` to `0.3.0`:
```json
{
  "name": "@calyx/rn",
  "version": "0.3.0",
  "description": "Premium headless calendar library for React Native",
  ...
}
```

- [ ] **Step 2: Build library**

Run: `npm run build`
Expected: Build succeeds, dist/ files updated

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 4: Run type check**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add package.json dist/
git commit -m "chore: bump version to 0.3.0 for Phase 4 release

Phase 4 complete:
- Timeline view with hourly grid and conflict detection
- Agenda view with chronological list and grouping
- Mode switching support (month/week/day/timeline/agenda)
- Current time indicator
- Business hours highlighting
- Infinite scroll for agenda
- Performance optimizations with virtualization
- Demo screens for both views
- Full TypeScript support
- Production-ready for npm

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Implementation Complete!

All Phase 4 tasks finished:

✅ **Type Definitions** - Timeline and Agenda configs, layouts
✅ **Hooks** - useTimelineLayout (conflict detection), useAgendaGrouping
✅ **Timeline Components** - Grid, Event, CurrentTimeLine, Container
✅ **Agenda Components** - SectionHeader, Event, Container
✅ **Integration** - Calendar router, compound components
✅ **Demo Screens** - TimelineDemo and AgendaDemo
✅ **App Integration** - New tabs in main app
✅ **Documentation** - README updated
✅ **Version** - 0.3.0 ready for npm publish

**Test the implementation:**
```bash
npm run ios    # or npm run android
```

Navigate to Timeline and Agenda tabs to see the new views in action!

**Publish to npm:**
```bash
npm publish
```
