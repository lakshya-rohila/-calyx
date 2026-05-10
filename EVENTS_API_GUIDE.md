# Events API Guide

This guide shows how to integrate events with the Calyx RN calendar library.

## Two Usage Patterns

### Pattern 1: Controlled Events (Recommended for Production)

Pass your own event data from your API/backend to the calendar. The library is fully controlled and doesn't manage event state.

```tsx
import { Calendar } from '@calyx/rn';
import type { CalendarEvent } from '@calyx/rn';
import { useState, useEffect } from 'react';

function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from your API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://api.example.com/events');
        const data = await response.json();
        
        // Transform API data to CalendarEvent format
        const calendarEvents: CalendarEvent[] = data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: new Date(event.start_time),
          endDate: new Date(event.end_time),
          isAllDay: event.all_day,
          color: event.color || '#007AFF',
          category: event.category,
          createdAt: new Date(event.created_at),
          updatedAt: new Date(event.updated_at),
        }));
        
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <Calendar
      mode="month"
      events={events}
      onSelect={(date) => console.log('Selected:', date)}
    />
  );
}
```

### Pattern 2: Store-Managed Events (For Demos/Simple Apps)

Use the built-in Zustand store for quick prototyping or simple apps that don't need a backend.

```tsx
import { Calendar, useEventStore } from '@calyx/rn';
import { useEffect } from 'react';

function SimpleCalendar() {
  const events = useEventStore(state => state.events);
  const addEvent = useEventStore(state => state.addEvent);

  // Add sample events on mount
  useEffect(() => {
    if (events.length === 0) {
      addEvent({
        title: 'Team Meeting',
        startDate: new Date(2026, 4, 10, 10, 0),
        endDate: new Date(2026, 4, 10, 11, 0),
        isAllDay: false,
        color: '#007AFF',
      });
    }
  }, []);

  return (
    <Calendar
      mode="month"
      events={events}
    />
  );
}
```

## Event Data Type

```typescript
type CalendarEvent = {
  id: string;                    // Unique identifier
  title: string;                 // Event name (required)
  description?: string;          // Optional details
  startDate: Date;              // Start time
  endDate: Date;                // End time
  isAllDay: boolean;            // All-day event flag
  color: string;                // Hex color for display (#RRGGBB)
  category?: string;            // Optional category/tag
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
};
```

## Using with Popular State Management

### React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@calyx/rn';

function CalendarWithQuery() {
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEventsFromAPI,
  });

  return <Calendar mode="month" events={events} />;
}
```

### Redux

```tsx
import { useSelector } from 'react-redux';
import { Calendar } from '@calyx/rn';

function CalendarWithRedux() {
  const events = useSelector(state => state.calendar.events);

  return <Calendar mode="month" events={events} />;
}
```

### Apollo GraphQL

```tsx
import { useQuery, gql } from '@apollo/client';
import { Calendar } from '@calyx/rn';

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      startDate
      endDate
      isAllDay
      color
      category
    }
  }
`;

function CalendarWithGraphQL() {
  const { data } = useQuery(GET_EVENTS);

  const events = data?.events.map(e => ({
    ...e,
    startDate: new Date(e.startDate),
    endDate: new Date(e.endDate),
    createdAt: new Date(),
    updatedAt: new Date(),
  })) || [];

  return <Calendar mode="month" events={events} />;
}
```

## Event Filtering by Date Range

For performance with large event datasets, filter events before passing to the calendar:

```tsx
import { Calendar } from '@calyx/rn';
import { useState, useMemo } from 'react';

function OptimizedCalendar({ allEvents }) {
  const [viewingDate, setViewingDate] = useState(new Date());

  // Only pass events for the current month
  const visibleEvents = useMemo(() => {
    const monthStart = new Date(viewingDate.getFullYear(), viewingDate.getMonth(), 1);
    const monthEnd = new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 0);

    return allEvents.filter(event => {
      return event.startDate <= monthEnd && event.endDate >= monthStart;
    });
  }, [allEvents, viewingDate]);

  return (
    <Calendar
      mode="month"
      value={viewingDate}
      onChange={setViewingDate}
      events={visibleEvents}
      onMonthChange={(year, month) => {
        setViewingDate(new Date(year, month - 1));
      }}
    />
  );
}
```

## Built-in Store API (Optional)

Only use this for demos or simple apps without a backend:

```typescript
// Get store instance
import { useEventStore } from '@calyx/rn';

// Store methods
const {
  events,              // CalendarEvent[]
  addEvent,           // (input: CreateEventInput) => CalendarEvent
  updateEvent,        // (id: string, input: UpdateEventInput) => void
  deleteEvent,        // (id: string) => void
  getEventById,       // (id: string) => CalendarEvent | undefined
  getEventsByDate,    // (date: Date) => CalendarEvent[]
  getEventsByRange,   // (start: Date, end: Date) => CalendarEvent[]
} = useEventStore();

// Create event
const event = addEvent({
  title: 'Meeting',
  startDate: new Date(),
  endDate: new Date(),
  isAllDay: false,
  color: '#007AFF',
});

// Update event
updateEvent(event.id, { title: 'Updated Meeting' });

// Delete event
deleteEvent(event.id);
```

## Best Practices

1. **Always use controlled pattern for production apps** - pass events as props from your API
2. **Filter events by date range** - only pass visible events for better performance
3. **Handle loading states** - show loading indicator while fetching
4. **Error handling** - gracefully handle API failures
5. **Memoize transformations** - use `useMemo` when transforming API data
6. **Type safety** - use TypeScript and the `CalendarEvent` type

## Migration from Store to API

If you started with the built-in store and need to migrate to API data:

**Before:**
```tsx
const events = useEventStore(state => state.events);
return <Calendar events={events} />;
```

**After:**
```tsx
const { data: events = [] } = useMyApiHook();
return <Calendar events={events} />;
```

The calendar works exactly the same way - it just displays whatever events you pass to it!
