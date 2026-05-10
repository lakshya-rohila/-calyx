# Calyx RN Phase 4: Advanced Views (Timeline & Agenda) - Design Specification

**Date:** 2026-05-10  
**Phase:** 4 of 9  
**Status:** Design Ready  
**Dependencies:** Phase 1 (hooks/engine), Phase 2 (UI components), Phase 3 (events)

---

## Overview

Phase 4 adds Timeline and Agenda views to the Calyx RN calendar library. Timeline displays events in a vertical hourly grid (like Google Calendar day/week view) with conflict detection. Agenda provides a chronological list view with grouping and infinite scroll. Both views integrate seamlessly with existing Calendar component via mode switching.

**Goals:**
- Timeline view with hourly grid and event positioning
- Agenda/list view with day/week/month grouping
- Conflict detection and side-by-side layout for overlapping events
- Current time indicator (red line)
- Performance optimization with virtualization
- Consistent API: same `events` prop, same theming
- Production-ready for npm publication

**Non-Goals (Future Phases):**
- Drag-and-drop event editing (Phase 8)
- Event creation via long-press (Phase 8)
- Multi-calendar sync (Phase 8)

---

## Architecture

### Type System

**Mode Extension:**
```typescript
type CalendarMode = 'month' | 'week' | 'day' | 'timeline' | 'agenda';

type TimelineConfig = {
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

type AgendaConfig = {
  groupBy?: 'day' | 'week' | 'month';  // Default: 'day'
  showEmptyDays?: boolean;              // Show days with no events (default: false)
  futureMonths?: number;                // Months to load ahead (default: 3)
  dateFormat?: string;                  // Custom date format for headers
};

type CalendarProps = {
  // ... existing props from Phase 2/3
  mode?: CalendarMode;
  events?: CalendarEvent[];
  
  // Phase 4 new props
  timelineConfig?: TimelineConfig;
  agendaConfig?: AgendaConfig;
  
  // Event interaction
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
};
```

**Event Layout Data:**
```typescript
type TimelineEventLayout = {
  event: CalendarEvent;
  top: number;           // Pixel offset from day start
  height: number;        // Pixel height
  left: number;          // Percentage (0-100) for column position
  width: number;         // Percentage (0-100) for column width
  columnIndex: number;   // Which conflict column (0, 1, 2...)
  totalColumns: number;  // Total overlapping columns
};

type AgendaSection = {
  title: string;         // "Today", "May 10, 2026", "Week of May 10"
  date: Date;            // Section start date
  events: CalendarEvent[];
};
```

### Component Hierarchy

```
Calendar (router)
├── mode="timeline" → CalendarTimeline
│   ├── TimelineHeader (date navigation)
│   ├── ScrollView (horizontal - for multi-day)
│   │   └── TimelineDay (per day column)
│   │       ├── TimelineGrid (hour slots background)
│   │       ├── TimelineEvents (event positioning layer)
│   │       │   └── TimelineEvent × N
│   │       └── CurrentTimeLine (red indicator)
│   └── TimelineTimeLabels (left gutter: "9 AM", "10 AM"...)
│
└── mode="agenda" → CalendarAgenda
    ├── AgendaHeader (search/filter controls)
    └── FlatList (virtualized)
        └── AgendaSection × N
            ├── AgendaSectionHeader
            └── AgendaEvent × N
```

---

## Timeline View

### Visual Structure

```
┌─────────────────────────────────────┐
│  Timeline - May 10, 2026      [<][>]│  Header
├────┬────────────────────────────────┤
│ 8AM│                                │
│    │  ┌──────────────────┐          │
│ 9AM│  │ Team Meeting     │          │
│    │  └──────────────────┘          │
│10AM│  ┌─────┐  ┌─────┐             │
│    │  │ Eve │  │ Eve │             │  Events positioned by time
│11AM│  │nt 1 │  │nt 2 │             │  Side-by-side when overlapping
│    │  └─────┘  └─────┘             │
│12PM│  ━━━━━━━━━━━━━━━━━━━━         │  Current time line (red)
│ 1PM│                                │
│ 2PM│  ┌──────────────────┐          │
│    │  │ Afternoon Call   │          │
│ 3PM│  │                  │          │
│    │  └──────────────────┘          │
└────┴────────────────────────────────┘
 Time   Events
 Labels
```

### CalendarTimeline Component

**File:** `src/components/Calendar/CalendarTimeline.tsx`

**Props:**
```typescript
type CalendarTimelineProps = {
  value?: Date;              // Viewing date
  onChange?: (date: Date) => void;
  selected?: Date;
  onSelect?: (date: Date) => void;
  events?: CalendarEvent[];
  timelineConfig?: TimelineConfig;
  theme?: CalendarTheme | ThemeName;
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  style?: ViewStyle;
};
```

**Layout Algorithm:**

1. **Time Slots:**
   - Each slot = 30min by default (configurable: 15, 30, 60)
   - Slot height = 50px (gives 25px per 15min)
   - Total height = (endHour - startHour) * 2 * 50px
   - Example: 8am-8pm = 12 hours * 100px = 1200px

2. **Event Positioning:**
   - Top offset: `(event.startHour - startHour) * pixelsPerHour`
   - Height: `(event.durationMinutes / 60) * pixelsPerHour`
   - Minimum height: 30px (show title even for short events)

3. **Conflict Detection:**
   - Events overlap if: `event1.endTime > event2.startTime && event1.startTime < event2.endTime`
   - Build conflict groups using union-find or greedy grouping
   - Assign column indices: 0, 1, 2... based on earliest available slot
   - Width per column: `100% / totalColumns`
   - Left offset: `columnIndex * (100% / totalColumns)`

**Example Conflict Resolution:**
```
Events:
  A: 9:00-11:00
  B: 10:00-12:00
  C: 10:30-11:30
  D: 13:00-14:00

Conflicts:
  Group 1: [A, B, C] (all overlap)
  Group 2: [D] (no overlap)

Layout:
  A: left=0%, width=33.3%   (column 0 of 3)
  B: left=33.3%, width=33.3% (column 1 of 3)
  C: left=66.6%, width=33.3% (column 2 of 3)
  D: left=0%, width=100%     (only event in timeframe)
```

### TimelineGrid Component

**File:** `src/components/Calendar/TimelineGrid.tsx`

**Purpose:** Render hour slot backgrounds with time labels

**Structure:**
- Left gutter: 50px wide, time labels (8 AM, 9 AM, 10 AM...)
- Right area: event canvas
- Business hours: highlighted background (rgba(0,122,255,0.05))
- Non-business: subtle gray background
- Hour lines: 1px solid #E0E0E0
- Half-hour lines: 1px dashed #F0F0F0

**Accessibility:**
- Time labels have `accessibilityRole="text"`
- Each hour slot has `accessibilityLabel`: "9 AM to 10 AM"

### TimelineEvent Component

**File:** `src/components/Calendar/TimelineEvent.tsx`

**Props:**
```typescript
type TimelineEventProps = {
  event: CalendarEvent;
  layout: TimelineEventLayout;
  onPress?: (event: CalendarEvent) => void;
  onLongPress?: (event: CalendarEvent) => void;
  theme: CalendarTheme;
};
```

**Visual Design:**
- Background: event.color
- Border-left: 4px solid (darker shade of event.color)
- Padding: 4px 8px
- Border-radius: 4px
- Shadow: subtle elevation

**Content:**
- Title: bold, 13px, truncate with ellipsis
- Time: 11px, lighter shade
- If height < 40px: only show title
- If height >= 40px: show title + time
- If height >= 60px: show title + time + description (truncated)

**Animation:**
- onPressIn: scale 0.98, opacity 0.8 (100ms)
- onPressOut: scale 1.0, opacity 1.0 (100ms)

**Accessibility:**
- `accessibilityRole="button"`
- `accessibilityLabel`: "Team Meeting, 9 AM to 10 AM, Work category"
- `accessibilityHint`: "Double tap to view details"

### CurrentTimeLine Component

**File:** `src/components/Calendar/CurrentTimeLine.tsx`

**Purpose:** Red horizontal line showing current time

**Behavior:**
- Only shown if current date matches viewing date
- Position updates every minute (useInterval)
- Top offset: `(currentMinutes / totalMinutes) * totalHeight`
- Style: 2px solid red (#FF3B30), with small red dot on left edge

**Animation:**
- Fade in on mount (300ms)
- Smooth position transition when updating (500ms)

### useTimelineLayout Hook

**File:** `src/hooks/useTimelineLayout.ts`

**Purpose:** Calculate event layouts with conflict detection

```typescript
function useTimelineLayout(
  events: CalendarEvent[],
  date: Date,
  config: TimelineConfig
): TimelineEventLayout[] {
  return useMemo(() => {
    // 1. Filter events for current day
    const dayEvents = events.filter(e => 
      isSameDay(e.startDate, date) || 
      (e.startDate < date && e.endDate >= date)
    );
    
    // 2. Sort by start time, then by duration (longer first)
    const sorted = dayEvents.sort((a, b) => {
      const startDiff = a.startDate.getTime() - b.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      return (b.endDate.getTime() - b.startDate.getTime()) - 
             (a.endDate.getTime() - a.startDate.getTime());
    });
    
    // 3. Detect conflicts and assign columns
    const layouts: TimelineEventLayout[] = [];
    const columns: CalendarEvent[][] = [];
    
    for (const event of sorted) {
      // Find first available column
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
      
      // Calculate layout
      const startMinutes = event.startDate.getHours() * 60 + event.startDate.getMinutes();
      const endMinutes = event.endDate.getHours() * 60 + event.endDate.getMinutes();
      const durationMinutes = endMinutes - startMinutes;
      
      const pixelsPerMinute = 50 / 30; // 50px per 30min slot
      const top = (startMinutes - config.startHour * 60) * pixelsPerMinute;
      const height = Math.max(30, durationMinutes * pixelsPerMinute);
      
      // Find total columns for this event's timeframe
      const overlappingEvents = sorted.filter(e => 
        e.startDate < event.endDate && e.endDate > event.startDate
      );
      const maxColumns = Math.max(...overlappingEvents.map(e => {
        return columns.findIndex(col => col.includes(e)) + 1;
      }));
      
      layouts.push({
        event,
        top,
        height,
        left: (columnIndex / maxColumns) * 100,
        width: (1 / maxColumns) * 100,
        columnIndex,
        totalColumns: maxColumns,
      });
    }
    
    return layouts;
  }, [events, date, config]);
}
```

---

## Agenda View

### Visual Structure

```
┌─────────────────────────────────────┐
│  Agenda                     [Search]│  Header
├─────────────────────────────────────┤
│ TODAY - May 10, 2026                │  Section Header
│  ┌──────────────────────────────┐   │
│  │ 🔵 9:00 AM - 10:00 AM        │   │
│  │ Team Meeting                 │   │  Event Card
│  │ Work                         │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ 🟢 12:00 PM - 1:00 PM        │   │
│  │ Lunch with Client            │   │
│  │ Business                     │   │
│  └──────────────────────────────┘   │
│                                      │
│ TOMORROW - May 11, 2026             │  Section Header
│  ┌──────────────────────────────┐   │
│  │ 🟠 All Day                   │   │
│  │ Company Offsite              │   │
│  └──────────────────────────────┘   │
│                                      │
│ MAY 15, 2026                        │
│  ┌──────────────────────────────┐   │
│  │ 🔴 2:00 PM - 3:30 PM         │   │
│  │ Deadline: Project Alpha      │   │
│  │ Work                         │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### CalendarAgenda Component

**File:** `src/components/Calendar/CalendarAgenda.tsx`

**Props:**
```typescript
type CalendarAgendaProps = {
  value?: Date;              // Starting date
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  agendaConfig?: AgendaConfig;
  theme?: CalendarTheme | ThemeName;
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  style?: ViewStyle;
};
```

**Implementation:**
- Uses React Native `FlatList` for virtualization
- `sections` computed by `useAgendaGrouping` hook
- `keyExtractor`: section date + event id
- `renderSectionHeader`: AgendaSectionHeader
- `renderItem`: AgendaEvent
- `onEndReached`: load more future events
- `onEndReachedThreshold`: 0.5

**Loading Pattern:**
- Initial: today + futureMonths ahead (default: 3 months)
- onEndReached: load 1 more month
- Show loading spinner at bottom while loading

### AgendaSectionHeader Component

**File:** `src/components/Calendar/AgendaSectionHeader.tsx`

**Purpose:** Day/week/month section header

**Content:**
- Today: "TODAY - May 10, 2026"
- Tomorrow: "TOMORROW - May 11, 2026"
- This week: "TUESDAY - May 12, 2026"
- Future: "MAY 15, 2026" or "WEEK OF MAY 17, 2026"

**Style:**
- Background: theme.colors.background (slightly darker)
- Text: 14px, bold, uppercase
- Padding: 12px 16px
- Sticky header (FlatList `stickySectionHeadersEnabled`)

**Accessibility:**
- `accessibilityRole="header"`
- `accessibilityLabel`: "Section, Today, May 10, 2026, 2 events"

### AgendaEvent Component

**File:** `src/components/Calendar/AgendaEvent.tsx`

**Props:**
```typescript
type AgendaEventProps = {
  event: CalendarEvent;
  onPress?: (event: CalendarEvent) => void;
  onLongPress?: (event: CalendarEvent) => void;
  theme: CalendarTheme;
  isFirst?: boolean;    // First in section
  isLast?: boolean;     // Last in section
};
```

**Layout:**
```
┌──────────────────────────────────┐
│ 🔵 9:00 AM - 10:00 AM            │  Left: color dot, time
│ Team Meeting                     │  Title (bold)
│ Weekly sync with engineering team│  Description (gray, 2 lines max)
│ Work                             │  Category badge
└──────────────────────────────────┘
```

**Components:**
- Color dot: 12px circle, event.color
- Time: 13px, gray
- Title: 16px, bold, 1 line with ellipsis
- Description: 14px, gray, 2 lines max with ellipsis
- Category: pill badge, background rgba(event.color, 0.1), text event.color

**Press Animation:**
- Pressable with scale animation
- onPressIn: scale 0.98, backgroundColor lighter (150ms)
- onPressOut: scale 1.0, backgroundColor normal (150ms)

**Accessibility:**
- `accessibilityRole="button"`
- `accessibilityLabel`: "Team Meeting, 9 AM to 10 AM, Weekly sync with engineering team, Work category"
- `accessibilityHint`: "Double tap to view event details"

### useAgendaGrouping Hook

**File:** `src/hooks/useAgendaGrouping.ts`

**Purpose:** Group events by day/week/month

```typescript
function useAgendaGrouping(
  events: CalendarEvent[],
  startDate: Date,
  config: AgendaConfig
): AgendaSection[] {
  return useMemo(() => {
    const { groupBy = 'day', showEmptyDays = false, futureMonths = 3 } = config;
    
    // Calculate end date
    const endDate = addMonths(startDate, futureMonths);
    
    // Generate all dates in range
    const allDates: Date[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      allDates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    
    // Group by day
    const sections: AgendaSection[] = allDates.map(date => {
      const dayEvents = events.filter(event =>
        (isSameDay(event.startDate, date)) ||
        (event.startDate < date && event.endDate >= date)
      ).sort((a, b) => {
        // All-day events first
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        // Then by start time
        return a.startDate.getTime() - b.startDate.getTime();
      });
      
      return {
        title: formatSectionTitle(date, startDate),
        date,
        events: dayEvents,
      };
    });
    
    // Filter empty days if configured
    const filtered = showEmptyDays 
      ? sections 
      : sections.filter(s => s.events.length > 0);
    
    // Group by week/month if configured
    if (groupBy === 'week') {
      return groupByWeek(filtered);
    } else if (groupBy === 'month') {
      return groupByMonth(filtered);
    }
    
    return filtered;
  }, [events, startDate, config]);
}

function formatSectionTitle(date: Date, startDate: Date): string {
  if (isToday(date)) return `TODAY - ${format(date, 'MMMM d, yyyy')}`;
  if (isTomorrow(date)) return `TOMORROW - ${format(date, 'MMMM d, yyyy')}`;
  if (isThisWeek(date, { weekStartsOn: 0 })) {
    return `${format(date, 'EEEE')} - ${format(date, 'MMMM d, yyyy')}`;
  }
  return format(date, 'MMMM d, yyyy').toUpperCase();
}
```

---

## Integration with Existing Calendar

### Calendar.tsx Updates

**File:** `src/components/Calendar/Calendar.tsx`

**Changes:**
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

  // Phase 4: New modes
  if (mode === 'timeline') {
    return <CalendarTimeline {...rest} />;
  }

  if (mode === 'agenda') {
    return <CalendarAgenda {...rest} />;
  }

  return <CalendarMonth {...rest} />;
}

// Compound component pattern (Phase 4 additions)
Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.Day = CalendarDay;
Calendar.Timeline = CalendarTimeline;  // NEW
Calendar.Agenda = CalendarAgenda;      // NEW
Calendar.Header = CalendarHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.Days = CalendarDays;
```

---

## Performance Optimizations

### 1. Timeline Virtualization

**Problem:** Rendering 24 hours (48 slots × 50px = 2400px) can be expensive

**Solution:**
- Use `ScrollView` with `removeClippedSubviews={true}`
- Only render visible hour range + 2 hours buffer
- Memoize TimelineEvent components with React.memo
- Use `useCallback` for event press handlers

**Implementation:**
```typescript
const VisibleTimeline = React.memo(({ visibleStart, visibleEnd, events }) => {
  const visibleEvents = events.filter(e => 
    e.startHour >= visibleStart - 2 && 
    e.startHour <= visibleEnd + 2
  );
  
  return visibleEvents.map(event => 
    <TimelineEvent key={event.id} event={event} />
  );
});
```

### 2. Agenda Virtualization

**Built-in:** `FlatList` automatically virtualizes

**Optimizations:**
- `getItemLayout`: provide explicit heights if uniform
- `maxToRenderPerBatch`: 10 (render 10 items per frame)
- `windowSize`: 5 (render 5 viewports worth of content)
- `initialNumToRender`: 15 (first render batch)

### 3. Layout Calculation Memoization

**Timeline:**
```typescript
const layouts = useMemo(() => 
  calculateTimelineLayouts(events, date, config),
  [events, date, config]
);
```

**Agenda:**
```typescript
const sections = useMemo(() => 
  groupEventsByDay(events, startDate, config),
  [events, startDate, config]
);
```

### 4. Staggered Animations

**Agenda List Entry:**
- Stagger each item by 50ms
- Use Animated.stagger for smooth reveal
- Only animate initial render, not on scroll

```typescript
const animations = events.map((_, i) => 
  Animated.timing(fadeAnims[i], {
    toValue: 1,
    duration: 200,
    delay: i * 50,
    useNativeDriver: true,
  })
);

Animated.stagger(50, animations).start();
```

---

## Animations

### Timeline Animations

**1. View Enter:**
- Timeline grid: fade in (300ms)
- Events: stagger from top to bottom (50ms delay per event)
- Current time line: slide in from left (400ms)

**2. Event Press:**
- Scale: 1.0 → 0.98 (100ms)
- Opacity: 1.0 → 0.8 (100ms)

**3. Mode Switch (month → timeline):**
- Fade out month view (200ms)
- Fade in timeline view (300ms, delay 100ms)

### Agenda Animations

**1. Section Reveal:**
- Section header: slide in from left (200ms)
- Events: stagger fade in (50ms per item)

**2. Event Card Press:**
- Scale: 1.0 → 0.98 (100ms)
- Background: normal → lighter (100ms)

**3. Infinite Scroll Loading:**
- Spinner: fade in (200ms)
- New items: stagger from bottom (50ms per item)

### View Transition Animation

**Mode prop change:**
```typescript
const fadeAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.sequence([
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }),
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();
}, [mode]);
```

---

## Theming

### Timeline Theme Extensions

**New theme properties:**
```typescript
type CalendarTheme = {
  // ... existing properties
  
  // Timeline-specific
  timeline?: {
    timeLabel: string;         // Time label color
    gridLine: string;          // Hour line color
    gridLineDashed: string;    // Half-hour line color
    businessHoursBg: string;   // Business hours background
    currentTimeLine: string;   // Red "now" line color
    eventMinHeight: number;    // Minimum event height (px)
  };
  
  // Agenda-specific
  agenda?: {
    sectionHeaderBg: string;   // Section header background
    sectionHeaderText: string; // Section header text color
    eventCardBg: string;       // Event card background
    eventCardBorder: string;   // Event card border
  };
};
```

**Default values:**
```typescript
const defaultTimelineTheme = {
  timeLabel: '#666',
  gridLine: '#E0E0E0',
  gridLineDashed: '#F0F0F0',
  businessHoursBg: 'rgba(0, 122, 255, 0.05)',
  currentTimeLine: '#FF3B30',
  eventMinHeight: 30,
};

const defaultAgendaTheme = {
  sectionHeaderBg: '#F5F5F5',
  sectionHeaderText: '#333',
  eventCardBg: '#FFF',
  eventCardBorder: '#E0E0E0',
};
```

**Existing themes inherit these defaults** - users can override per theme.

---

## Accessibility

### Timeline Accessibility

**Screen Reader Support:**
- Time labels: `accessibilityRole="text"`, clear labels ("9 AM", not "9")
- Time slots: `accessibilityLabel`: "9 AM to 10 AM time slot"
- Events: `accessibilityRole="button"`, detailed labels with time and description
- Current time line: `accessibilityLabel`: "Current time: 2:30 PM"

**Focus Order:**
- Header → Time labels (top to bottom) → Events (chronological)

**Minimum Touch Targets:**
- Events: minimum 44×44pt (expand touch area if visual is smaller)

### Agenda Accessibility

**Screen Reader Support:**
- Section headers: `accessibilityRole="header"`
- Event cards: `accessibilityRole="button"`
- Loading spinner: `accessibilityLabel`: "Loading more events"

**Keyboard Navigation:**
- Tab through event cards
- Enter/Space to activate
- Arrow keys for list navigation (if on web)

**Focus Management:**
- Preserve focus when loading more items
- Return focus to event card after modal dismiss

**Dynamic Type:**
- Support for user font size preferences
- Layout adjusts for larger text

---

## Testing Strategy

### Unit Tests

**Hooks:**
```typescript
describe('useTimelineLayout', () => {
  it('calculates correct pixel positions', () => {
    const events = [mockEvent({ start: '9:00', end: '10:00' })];
    const layouts = useTimelineLayout(events, new Date(), defaultConfig);
    expect(layouts[0].top).toBe(450); // 9 hours * 50px
    expect(layouts[0].height).toBe(50); // 1 hour * 50px
  });
  
  it('detects conflicts and assigns columns', () => {
    const events = [
      mockEvent({ start: '9:00', end: '11:00' }),
      mockEvent({ start: '10:00', end: '12:00' }),
    ];
    const layouts = useTimelineLayout(events, new Date(), defaultConfig);
    expect(layouts[0].columnIndex).toBe(0);
    expect(layouts[1].columnIndex).toBe(1);
    expect(layouts[0].width).toBe(50);
    expect(layouts[1].width).toBe(50);
  });
  
  it('handles all-day events', () => {
    const event = mockEvent({ isAllDay: true });
    const layouts = useTimelineLayout([event], new Date(), defaultConfig);
    expect(layouts[0].top).toBe(0);
    expect(layouts[0].height).toBeGreaterThan(1000);
  });
});

describe('useAgendaGrouping', () => {
  it('groups events by day', () => {
    const events = [
      mockEvent({ date: '2026-05-10' }),
      mockEvent({ date: '2026-05-10' }),
      mockEvent({ date: '2026-05-11' }),
    ];
    const sections = useAgendaGrouping(events, new Date('2026-05-10'), { groupBy: 'day' });
    expect(sections).toHaveLength(2);
    expect(sections[0].events).toHaveLength(2);
    expect(sections[1].events).toHaveLength(1);
  });
  
  it('filters empty days when showEmptyDays is false', () => {
    const events = [mockEvent({ date: '2026-05-10' })];
    const sections = useAgendaGrouping(events, new Date('2026-05-10'), { 
      groupBy: 'day',
      showEmptyDays: false,
    });
    // Should only have 1 section (May 10), not all days in range
    expect(sections).toHaveLength(1);
  });
});
```

**Components:**
```typescript
describe('TimelineEvent', () => {
  it('renders event title and time', () => {
    const event = mockEvent({ title: 'Meeting', start: '9:00', end: '10:00' });
    const { getByText } = render(<TimelineEvent event={event} layout={mockLayout} />);
    expect(getByText('Meeting')).toBeTruthy();
    expect(getByText('9:00 AM')).toBeTruthy();
  });
  
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<TimelineEvent event={mockEvent()} layout={mockLayout} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mockEvent());
  });
});

describe('AgendaEvent', () => {
  it('shows color dot matching event color', () => {
    const event = mockEvent({ color: '#007AFF' });
    const { getByTestId } = render(<AgendaEvent event={event} />);
    const dot = getByTestId('event-dot');
    expect(dot.props.style.backgroundColor).toBe('#007AFF');
  });
});
```

### Integration Tests

**Timeline:**
```typescript
describe('CalendarTimeline Integration', () => {
  it('displays all events for the day', () => {
    const events = [
      mockEvent({ start: '9:00', title: 'Event 1' }),
      mockEvent({ start: '14:00', title: 'Event 2' }),
    ];
    const { getByText } = render(<CalendarTimeline events={events} value={new Date()} />);
    expect(getByText('Event 1')).toBeTruthy();
    expect(getByText('Event 2')).toBeTruthy();
  });
  
  it('scrolls to current time on mount', async () => {
    const scrollRef = jest.fn();
    render(<CalendarTimeline value={new Date()} timelineConfig={{ scrollToNow: true }} ref={scrollRef} />);
    await waitFor(() => expect(scrollRef.current.scrollTo).toHaveBeenCalled());
  });
});
```

**Agenda:**
```typescript
describe('CalendarAgenda Integration', () => {
  it('groups events by day', () => {
    const events = [
      mockEvent({ date: '2026-05-10', title: 'Today Event' }),
      mockEvent({ date: '2026-05-11', title: 'Tomorrow Event' }),
    ];
    const { getByText } = render(<CalendarAgenda events={events} value={new Date('2026-05-10')} />);
    expect(getByText('TODAY')).toBeTruthy();
    expect(getByText('TOMORROW')).toBeTruthy();
  });
  
  it('loads more events on scroll to bottom', async () => {
    const { getByTestId } = render(<CalendarAgenda events={mockManyEvents()} />);
    const list = getByTestId('agenda-list');
    fireEvent.scroll(list, { nativeEvent: { contentOffset: { y: 5000 } } });
    await waitFor(() => expect(getByText('Loading...')).toBeTruthy());
  });
});
```

### Visual Regression Tests

- Screenshot tests for Timeline layout at different times
- Screenshot tests for Agenda sections
- Conflict visualization correctness
- Theme variations (light/dark/custom)

---

## Example Usage

### Timeline Mode

```tsx
import { Calendar } from '@calyx/rn';

function MyTimeline() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  return (
    <Calendar
      mode="timeline"
      value={new Date()}
      events={events}
      timelineConfig={{
        startHour: 8,
        endHour: 20,
        slotDuration: 30,
        showCurrentTime: true,
        businessHours: { start: 9, end: 17 },
      }}
      onEventPress={(event) => console.log('Pressed:', event.title)}
      theme="light"
    />
  );
}
```

### Agenda Mode

```tsx
import { Calendar } from '@calyx/rn';

function MyAgenda() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  return (
    <Calendar
      mode="agenda"
      value={new Date()}
      events={events}
      agendaConfig={{
        groupBy: 'day',
        showEmptyDays: false,
        futureMonths: 3,
      }}
      onEventPress={(event) => console.log('Pressed:', event.title)}
      theme="dark"
    />
  );
}
```

### Mode Switching

```tsx
function CalendarApp() {
  const [mode, setMode] = useState<CalendarMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  return (
    <View>
      <View style={styles.modeButtons}>
        <Button title="Month" onPress={() => setMode('month')} />
        <Button title="Week" onPress={() => setMode('week')} />
        <Button title="Timeline" onPress={() => setMode('timeline')} />
        <Button title="Agenda" onPress={() => setMode('agenda')} />
      </View>
      
      <Calendar
        mode={mode}
        events={events}
        timelineConfig={{ startHour: 8, endHour: 20 }}
        agendaConfig={{ groupBy: 'day' }}
      />
    </View>
  );
}
```

### Compound Components

```tsx
// Direct access to specific view
import { Calendar } from '@calyx/rn';

<Calendar.Timeline
  value={new Date()}
  events={events}
  timelineConfig={{ startHour: 9, endHour: 18 }}
/>

<Calendar.Agenda
  value={new Date()}
  events={events}
  agendaConfig={{ groupBy: 'week' }}
/>
```

---

## Implementation Checklist

**Timeline View:**
- [ ] CalendarTimeline component with ScrollView
- [ ] TimelineGrid with hour slots and labels
- [ ] TimelineEvent with positioning and styling
- [ ] TimelineEvents layer with conflict detection
- [ ] CurrentTimeLine indicator
- [ ] useTimelineLayout hook with conflict algorithm
- [ ] Time slot configuration (15/30/60 min)
- [ ] Business hours highlighting
- [ ] Multi-day timeline (horizontal scroll)
- [ ] Auto-scroll to current time
- [ ] Event press/long-press handlers

**Agenda View:**
- [ ] CalendarAgenda component with FlatList
- [ ] AgendaSectionHeader with date formatting
- [ ] AgendaEvent card with layout
- [ ] useAgendaGrouping hook (day/week/month)
- [ ] Infinite scroll with loading
- [ ] Empty state for days with no events
- [ ] Section header sticky behavior
- [ ] Event card animations

**Integration:**
- [ ] Extend CalendarMode type
- [ ] Add timelineConfig and agendaConfig props
- [ ] Update Calendar router for new modes
- [ ] Compound components: Calendar.Timeline, Calendar.Agenda
- [ ] onEventPress and onEventLongPress callbacks

**Theming:**
- [ ] Timeline theme properties
- [ ] Agenda theme properties
- [ ] Apply to all built-in themes
- [ ] Custom theme support

**Performance:**
- [ ] Timeline virtualization
- [ ] FlatList optimization (getItemLayout, windowSize)
- [ ] Memoize layout calculations
- [ ] useCallback for event handlers
- [ ] React.memo for event components

**Animations:**
- [ ] Timeline entry animation
- [ ] Agenda list stagger
- [ ] Event press feedback
- [ ] Mode transition animation
- [ ] Loading spinner fade

**Accessibility:**
- [ ] Screen reader labels for all elements
- [ ] Minimum touch targets (44×44pt)
- [ ] Focus order management
- [ ] Dynamic type support
- [ ] Accessibility hints

**Testing:**
- [ ] Unit tests for useTimelineLayout
- [ ] Unit tests for useAgendaGrouping
- [ ] Component tests for TimelineEvent
- [ ] Component tests for AgendaEvent
- [ ] Integration tests for Timeline view
- [ ] Integration tests for Agenda view
- [ ] Visual regression tests

**Documentation:**
- [ ] Update README with Timeline/Agenda examples
- [ ] Add TimelineConfig and AgendaConfig to API docs
- [ ] Example app screens for Timeline and Agenda
- [ ] Migration guide from Phase 3

**Demo App:**
- [ ] TimelineDemo screen
- [ ] AgendaDemo screen
- [ ] Mode switcher in main App
- [ ] Sample events for timeline visualization
- [ ] Conflict demo (overlapping events)

---

## File Structure

```
src/
├── components/
│   ├── Calendar/
│   │   ├── Calendar.tsx              # Router (updated)
│   │   ├── CalendarTimeline.tsx      # NEW
│   │   ├── CalendarAgenda.tsx        # NEW
│   │   ├── TimelineGrid.tsx          # NEW
│   │   ├── TimelineEvents.tsx        # NEW
│   │   ├── TimelineEvent.tsx         # NEW
│   │   ├── CurrentTimeLine.tsx       # NEW
│   │   ├── AgendaList.tsx           # NEW
│   │   ├── AgendaSectionHeader.tsx  # NEW
│   │   ├── AgendaEvent.tsx          # NEW
│   │   ├── types.ts                 # Updated
│   │   └── index.ts                 # Updated exports
│   └── index.ts
├── hooks/
│   ├── useTimelineLayout.ts         # NEW
│   ├── useAgendaGrouping.ts         # NEW
│   └── index.ts                     # Updated exports
├── types/
│   ├── timeline.ts                  # NEW
│   └── agenda.ts                    # NEW
└── index.ts                         # Updated exports

example/screens/
├── TimelineDemo.tsx                 # NEW
├── AgendaDemo.tsx                   # NEW
└── App.tsx                          # Updated with new tabs

docs/
└── superpowers/
    └── specs/
        └── 2026-05-10-calyx-rn-phase4-design.md

__tests__/
├── useTimelineLayout.test.ts        # NEW
├── useAgendaGrouping.test.ts        # NEW
├── TimelineEvent.test.tsx           # NEW
├── AgendaEvent.test.tsx             # NEW
├── CalendarTimeline.test.tsx        # NEW
└── CalendarAgenda.test.tsx          # NEW
```

---

## Phase 4 Success Criteria

✅ **Timeline View:**
- Displays events in hourly grid
- Handles overlapping events with side-by-side layout
- Shows current time indicator
- Configurable time range and slot duration
- Business hours highlighting
- Smooth scrolling performance

✅ **Agenda View:**
- Chronological list with day grouping
- Infinite scroll with loading
- Section headers (Today, Tomorrow, dates)
- Empty state handling
- Performant with 1000+ events

✅ **API Consistency:**
- Same `events` prop as Phase 3
- Same theming system
- Mode switching: `<Calendar mode="timeline" />`
- Compound components: `Calendar.Timeline`, `Calendar.Agenda`

✅ **Production Quality:**
- TypeScript strict mode passing
- Test coverage >80%
- Accessibility WCAG 2.1 AA
- Animations smooth (60fps)
- Works on iOS and Android
- NPM-ready (no breaking changes)

✅ **Documentation:**
- README updated with Timeline/Agenda examples
- API docs for new props
- Demo app showcasing both views
- Migration guide

---

## End of Design Specification

This completes the Phase 4 design for Advanced Views (Timeline & Agenda). The architecture extends the existing Calendar component with two new modes, maintaining API consistency while adding powerful new visualization options. All components follow established patterns from Phase 1-3, ensuring a cohesive library experience.
