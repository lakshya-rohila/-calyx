# Calyx RN Phase 3: Event Management System - Design Specification

**Date:** 2026-05-10  
**Phase:** 3 of 9  
**Status:** Design Approved  
**Dependencies:** Phase 1 (hooks/engine), Phase 2 (UI components)

---

## Overview

Phase 3 adds event management capabilities to the Calyx RN calendar library. Users can create, view, edit, and delete calendar events. Events display as colored dot indicators on calendar days, with a bottom sheet for viewing event details. All animations use React Native's built-in Animated API.

**Goals:**
- In-memory event storage with Zustand
- Standard event model (title, description, start/end dates, color, category)
- Dot indicators on calendar days
- Bottom sheet UI for event lists
- Smooth animations for all interactions
- Demo app showcasing event features

---

## Event Data Model

### Event Type

```typescript
type CalendarEvent = {
  id: string;                    // UUID v4
  title: string;                 // Required, max 100 chars
  description?: string;          // Optional, max 500 chars
  startDate: Date;              // Event start (includes time)
  endDate: Date;                // Event end (includes time)
  isAllDay: boolean;            // All-day flag
  color: string;                // Hex color (e.g., "#FF5733")
  category?: string;            // Optional category/tag
  createdAt: Date;              // Timestamp
  updatedAt: Date;              // Timestamp
};
```

**Validation Rules:**
- `title` is required, 1-100 characters
- `description` optional, max 500 characters
- `endDate` must be >= `startDate`
- `color` must be valid hex color
- `isAllDay`: if true, time portion ignored for display
- Multi-day events: endDate can be days/weeks after startDate

---

## Architecture

### Event Store (Zustand)

**File:** `src/store/event-store.ts`

```typescript
type EventState = {
  events: Record<string, CalendarEvent>;  // Keyed by event.id
  
  // CRUD
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => CalendarEvent | undefined;
  
  // Queries
  getAllEvents: () => CalendarEvent[];
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  
  // Bulk operations
  clearAllEvents: () => void;
  importEvents: (events: CalendarEvent[]) => void;
};
```

**Store Implementation:**
- Uses Zustand with immer middleware (like calendar-store)
- Events stored as normalized map for O(1) lookups
- Query functions iterate events and filter by date
- Date comparisons use date-fns `isSameDay`, `isWithinInterval`
- Generate UUID with simple timestamp-based approach or `uuid` library

**Date Queries:**
- `getEventsByDate(date)`: Returns events where date is between startDate and endDate (inclusive)
- `getEventsByRange(start, end)`: Returns events that overlap with the range
- Both account for all-day events (ignore time portion)

---

## Components

### 1. EventDot

**File:** `src/components/events/EventDot.tsx`

**Purpose:** Single colored dot indicator

**Props:**
```typescript
type EventDotProps = {
  color: string;        // Hex color
  size?: number;        // Default: 6
  style?: ViewStyle;
};
```

**Appearance:**
- Circular dot (6px diameter default)
- Background color from event.color
- Small border to stand out on colored backgrounds

---

### 2. EventDots

**File:** `src/components/events/EventDots.tsx`

**Purpose:** Renders multiple event dots with overflow indicator

**Props:**
```typescript
type EventDotsProps = {
  events: CalendarEvent[];
  maxDots?: number;           // Default: 3
  dotSize?: number;           // Default: 6
  spacing?: number;           // Default: 2
  style?: ViewStyle;
};
```

**Behavior:**
- Shows up to `maxDots` colored dots
- If more events, shows "+N" text (e.g., "+2")
- Dots arranged horizontally with spacing
- Different colors for different events

---

### 3. EventBottomSheet

**File:** `src/components/events/EventBottomSheet.tsx`

**Purpose:** Slide-up bottom sheet container with backdrop

**Props:**
```typescript
type EventBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];      // [0.4, 0.7, 0.9] (% of screen)
  initialSnap?: number;       // Default: 0 (first snap point)
};
```

**Animation:**
- Uses `Animated.timing` with `translateY`
- Slides from bottom: `height` → 0
- Duration: 300ms, easing: ease-in-out
- Backdrop: semi-transparent black (0.5 opacity)
- Tap backdrop to close
- Support drag to dismiss (optional swipe down gesture)

**Layout:**
- Positioned absolute, bottom 0
- Rounded top corners (16px radius)
- Shadow/elevation for depth
- Safe area padding for bottom notch

---

### 4. EventList

**File:** `src/components/events/EventList.tsx`

**Purpose:** Scrollable list of events for a specific date

**Props:**
```typescript
type EventListProps = {
  date: Date;
  events: CalendarEvent[];
  onEventPress: (event: CalendarEvent) => void;
  onEventDelete: (event: CalendarEvent) => void;
  onEventEdit: (event: CalendarEvent) => void;
  theme?: ThemeName | CalendarTheme;
};
```

**Features:**
- Header showing selected date (e.g., "Saturday, May 10")
- ScrollView with event items
- Empty state: "No events" with illustration/icon
- Stagger fade-in animation for items (100ms delay each)
- Pull to refresh (optional)

---

### 5. EventItem

**File:** `src/components/events/EventItem.tsx`

**Purpose:** Individual event card with swipe actions

**Props:**
```typescript
type EventItemProps = {
  event: CalendarEvent;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
  theme?: ThemeName | CalendarTheme;
};
```

**Appearance:**
- Card with left color bar (4px, event.color)
- Title (bold), time range (if not all-day)
- Description (truncated, 1 line)
- Category badge (if present)

**Interactions:**
- Tap: expand to show full details or open detail modal
- Swipe left: reveal red delete button
- Swipe right: reveal blue edit button
- Press animation: scale 0.98, opacity 0.7 (150ms)

**Animation:**
- Swipe: `Animated.event` with `translateX`
- Threshold: 80px to trigger action
- Spring back if not enough swipe

---

### 6. EventDetailModal

**File:** `src/components/events/EventDetailModal.tsx`

**Purpose:** Full event details in modal

**Props:**
```typescript
type EventDetailModalProps = {
  visible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
  theme?: ThemeName | CalendarTheme;
};
```

**Layout:**
- Full-screen modal with header
- Close button (X) top-right
- Color bar at top matching event.color
- Sections: Title, Time, Description, Category
- Action buttons at bottom: Edit, Delete

**Animation:**
- Fade in backdrop (0 → 0.5 opacity, 200ms)
- Slide up modal (translateY: 100 → 0, 300ms)

---

### 7. EventForm

**File:** `src/components/events/EventForm.tsx`

**Purpose:** Create/edit event form

**Props:**
```typescript
type EventFormProps = {
  visible: boolean;
  event?: CalendarEvent;      // undefined = create, defined = edit
  initialDate?: Date;
  onSave: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  theme?: ThemeName | CalendarTheme;
};
```

**Fields:**
- Title (TextInput, required)
- Description (TextInput, multiline)
- Start Date/Time (DateTimePicker)
- End Date/Time (DateTimePicker)
- All Day toggle (Switch)
- Color picker (6-8 preset colors)
- Category (TextInput or Picker)

**Validation:**
- Title required
- End date >= Start date
- Show error messages inline

**Buttons:**
- Cancel (dismiss)
- Save (validate & call onSave)

**Animation:**
- Modal slide up from bottom (same as detail modal)

---

## Hooks

### useEventStore

**File:** `src/hooks/useEventStore.ts`

Direct access to event store:

```typescript
const useEventStore = () => {
  const store = getEventStore();
  return store();
};
```

---

### useEvents

**File:** `src/hooks/useEvents.ts`

Get all events:

```typescript
const useEvents = () => {
  const events = useEventStore((state) => state.getAllEvents());
  return events;
};
```

---

### useEventsByDate

**File:** `src/hooks/useEventsByDate.ts`

Get events for specific date:

```typescript
const useEventsByDate = (date: Date) => {
  const getEventsByDate = useEventStore((state) => state.getEventsByDate);
  
  // Memoize to avoid unnecessary recalculations
  const events = useMemo(() => getEventsByDate(date), [date, getEventsByDate]);
  
  return events;
};
```

---

### useEventsByRange

**File:** `src/hooks/useEventsByRange.ts`

Get events in date range:

```typescript
const useEventsByRange = (startDate: Date, endDate: Date) => {
  const getEventsByRange = useEventStore((state) => state.getEventsByRange);
  
  const events = useMemo(
    () => getEventsByRange(startDate, endDate),
    [startDate, endDate, getEventsByRange]
  );
  
  return events;
};
```

---

### useEventManager

**File:** `src/hooks/useEventManager.ts`

CRUD operations with convenience methods:

```typescript
const useEventManager = () => {
  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const getEvent = useEventStore((state) => state.getEvent);
  
  return {
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
  };
};
```

---

## Phase 2 Integration

### Enhanced DayCell

**File:** `src/components/primitives/DayCell.tsx` (modify)

**Changes:**
- Add `events` prop: `CalendarEvent[]`
- Add `onDayPress` prop: `(day: DayData, events: CalendarEvent[]) => void`
- Render `<EventDots events={events} />` below day number
- Call `onDayPress` instead of just `onPress`

**Updated Props:**
```typescript
type DayCellProps = {
  // ... existing props
  events?: CalendarEvent[];
  onDayPress?: (day: DayData, events: CalendarEvent[]) => void;
};
```

---

### Enhanced CalendarMonth/Week/Day

**Files:** `src/components/Calendar/*.tsx` (modify)

**Changes:**
- Accept `onDayPress` prop
- Use `useEventsByRange` to get events for visible dates
- Pass events to `DayCell` components
- Forward `onDayPress` callback

**Example for CalendarMonth:**
```typescript
const visibleEvents = useEventsByRange(
  startOfMonth(currentDate),
  endOfMonth(currentDate)
);

// In render, pass to DayCell:
<DayCell
  day={day}
  events={visibleEvents.filter(e => isSameDay(e.startDate, day.date))}
  onDayPress={onDayPress}
/>
```

---

## Animations (Animated API)

### 1. Bottom Sheet Slide Up/Down

```typescript
const translateY = useRef(new Animated.Value(500)).current; // Start off-screen

// Open
Animated.timing(translateY, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.ease),
  useNativeDriver: true,
}).start();

// Close
Animated.timing(translateY, {
  toValue: 500,
  duration: 250,
  easing: Easing.in(Easing.ease),
  useNativeDriver: true,
}).start(() => onClose());
```

---

### 2. Event List Stagger Fade

```typescript
const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.stagger(
    100,
    events.map((_, index) =>
      Animated.timing(opacities[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    )
  ).start();
}, [events]);
```

---

### 3. Event Item Press

```typescript
const scale = useRef(new Animated.Value(1)).current;
const opacity = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.parallel([
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 150,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }),
  ]).start();
};

const handlePressOut = () => {
  Animated.parallel([
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }),
  ]).start();
};
```

---

### 4. Swipe to Delete

```typescript
const translateX = useRef(new Animated.Value(0)).current;

const panResponder = PanResponder.create({
  onPanResponderMove: Animated.event(
    [null, { dx: translateX }],
    { useNativeDriver: false }
  ),
  onPanResponderRelease: (_, gesture) => {
    if (gesture.dx < -80) {
      // Delete action
      onDelete();
    } else {
      // Spring back
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  },
});
```

---

### 5. Dot Pulse on Event Add

```typescript
const scale = useRef(new Animated.Value(1)).current;

// Triggered when new event added
Animated.sequence([
  Animated.timing(scale, {
    toValue: 1.2,
    duration: 200,
    useNativeDriver: true,
  }),
  Animated.timing(scale, {
    toValue: 1,
    duration: 200,
    useNativeDriver: true,
  }),
]).start();
```

---

## Demo App Updates

### New "Events" Tab

**File:** `example/screens/EventDemo.tsx`

**Features:**
- Pre-populated with 5-10 sample events
- Calendar with event dots
- Tap day to open bottom sheet
- Bottom sheet shows event list
- Tap event to see details
- Edit/delete from detail modal
- FAB (Floating Action Button) to create new event

**Sample Events:**
```typescript
const sampleEvents = [
  {
    title: "Team Standup",
    startDate: new Date(2026, 4, 10, 9, 0),
    endDate: new Date(2026, 4, 10, 9, 30),
    color: "#007AFF",
    isAllDay: false,
  },
  {
    title: "Dentist Appointment",
    startDate: new Date(2026, 4, 12, 14, 0),
    endDate: new Date(2026, 4, 12, 15, 0),
    color: "#FF3B30",
    isAllDay: false,
  },
  {
    title: "Conference",
    startDate: new Date(2026, 4, 15, 0, 0),
    endDate: new Date(2026, 4, 17, 23, 59),
    color: "#34C759",
    isAllDay: true,
  },
  // ... more events
];
```

---

### Update App.tsx

Add "Events" tab:

```typescript
type TabKey = 'demo' | 'themes' | 'custom' | 'events';

// Add tab button
<TabButton
  label="Events"
  active={activeTab === 'events'}
  onPress={() => setActiveTab('events')}
/>
```

---

## Public API Updates

### src/index.ts

Export new event types and hooks:

```typescript
// Event types
export type { CalendarEvent } from './store/event-store';

// Event hooks
export { useEvents, useEventsByDate, useEventsByRange, useEventManager } from './hooks';

// Event components
export {
  EventDot,
  EventDots,
  EventBottomSheet,
  EventList,
  EventItem,
  EventDetailModal,
  EventForm,
} from './components/events';
```

---

## Testing Strategy

### Unit Tests

**Store Tests:**
- `event-store.test.ts`: CRUD operations, queries, edge cases

**Hook Tests:**
- `useEventsByDate.test.ts`: Date filtering
- `useEventsByRange.test.ts`: Range queries

**Component Tests:**
- `EventDot.test.tsx`: Rendering, colors
- `EventDots.test.tsx`: Multiple dots, overflow
- `EventItem.test.tsx`: Press, swipe actions
- `EventList.test.tsx`: Rendering, empty state

**Animation Tests:**
- Verify animations start/complete
- Check transform values

### Integration Tests

- Add event → appears on calendar
- Edit event → updates display
- Delete event → removes from calendar
- Multi-day event → dots on all days
- Bottom sheet → opens on day press

---

## Performance Considerations

1. **Memoization:**
   - `useEventsByDate` and `useEventsByRange` use `useMemo`
   - Event queries cached until events/dates change

2. **Efficient Queries:**
   - Store events as map for O(1) lookups
   - Date filtering uses optimized date-fns functions

3. **Animation Performance:**
   - Use `useNativeDriver: true` wherever possible (transforms, opacity)
   - Avoid animating layout properties (width, height, padding)

4. **List Rendering:**
   - Use `FlatList` for event lists if > 20 events
   - Key extraction for efficient re-renders

---

## Success Criteria

✅ Event CRUD operations work correctly  
✅ Events display as dots on calendar days  
✅ Bottom sheet slides smoothly with backdrop  
✅ Event list shows all events for selected day  
✅ Swipe actions work on event items  
✅ Animations are smooth (60fps)  
✅ All components respect theme system  
✅ Demo app showcases all features  
✅ TypeScript strict mode passes  
✅ All tests pass (>80% coverage)  
✅ Works on iOS and Android  

---

## Future Enhancements (Not in Phase 3)

- Recurring events (Phase 4)
- Event reminders/notifications (Phase 5)
- Drag & drop to reschedule (Phase 6)
- Multi-select events (Phase 6)
- Event search/filter (Phase 7)
- Calendar sync (iCloud, Google) (Phase 8)
- Offline persistence (Phase 8)

---

## File Structure Summary

```
src/
  store/
    event-store.ts                    # NEW - Zustand event store
  
  hooks/
    useEvents.ts                      # NEW - All events hook
    useEventsByDate.ts                # NEW - Events by date
    useEventsByRange.ts               # NEW - Events by range
    useEventManager.ts                # NEW - CRUD operations
  
  components/
    events/
      EventDot.tsx                    # NEW - Single dot
      EventDots.tsx                   # NEW - Multiple dots
      EventBottomSheet.tsx            # NEW - Bottom sheet container
      EventList.tsx                   # NEW - Event list
      EventItem.tsx                   # NEW - Event card
      EventDetailModal.tsx            # NEW - Event details
      EventForm.tsx                   # NEW - Create/edit form
      index.ts                        # NEW - Exports
    
    primitives/
      DayCell.tsx                     # MODIFY - Add event dots
  
  types/
    index.ts                          # MODIFY - Export event types

example/
  screens/
    EventDemo.tsx                     # NEW - Events demo screen

App.tsx                               # MODIFY - Add Events tab

__tests__/
  store/
    event-store.test.ts               # NEW
  
  hooks/
    useEventsByDate.test.ts           # NEW
    useEventsByRange.test.ts          # NEW
  
  components/
    events/
      EventDot.test.tsx               # NEW
      EventDots.test.tsx              # NEW
      EventItem.test.tsx              # NEW
      EventList.test.tsx              # NEW
```

---

## Implementation Order

1. Event store + types
2. Event hooks
3. EventDot + EventDots components
4. Enhance DayCell with event dots
5. EventBottomSheet with animation
6. EventList + EventItem
7. EventDetailModal
8. EventForm
9. Demo app integration
10. Tests
11. Documentation

---

**End of Specification**
