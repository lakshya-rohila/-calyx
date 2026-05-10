<div align="center">
  <img src="https://raw.githubusercontent.com/lakshya-rohila/-calyx/main/.github/assets/logo.png" alt="Calyx RN" width="200" />
  
  # Calyx RN
  
  **Premium Calendar Library for React Native**
  
  [![npm version](https://img.shields.io/npm/v/calyx-rn.svg)](https://www.npmjs.com/package/calyx-rn)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
  [![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://reactnative.dev/)
  
  **[Installation](#-installation)** • 
  **[Quick Start](#-quick-start)** • 
  **[Examples](#-examples)** • 
  **[API Reference](#-api-reference)** • 
  **[Customization](#-customization)**
</div>

---

## 🎥 See It In Action

<div align="center">
  <img src="https://raw.githubusercontent.com/lakshya-rohila/-calyx/main/.github/assets/demo.gif" alt="Calyx RN Demo" width="300" />
  
  *Five powerful view modes: Month, Week, Day, Timeline, and Agenda*
</div>

---

## ✨ Features

<table>
  <tr>
    <td>
      <h3>🎯 Multiple View Modes</h3>
      <ul>
        <li><strong>Month View</strong> - Classic grid calendar</li>
        <li><strong>Week View</strong> - 7-day week display</li>
        <li><strong>Day View</strong> - Single day focus</li>
        <li><strong>Timeline View</strong> - Hourly grid with conflict detection</li>
        <li><strong>Agenda View</strong> - Chronological event list</li>
      </ul>
    </td>
    <td>
      <h3>🎨 Theming & Styling</h3>
      <ul>
        <li>6 built-in themes (light, dark, ocean, forest, sunset, minimal)</li>
        <li>Full custom theme support</li>
        <li>Per-component styling</li>
        <li>Dark mode ready</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>📅 Event Management</h3>
      <ul>
        <li>Connect to any API or backend</li>
        <li>Event indicators on calendar cells</li>
        <li>All-day and timed events</li>
        <li>Event colors and categories</li>
        <li>Conflict detection in Timeline view</li>
      </ul>
    </td>
    <td>
      <h3>🔧 Developer Experience</h3>
      <ul>
        <li>TypeScript-first with full type inference</li>
        <li>Headless hooks + ready-made UI</li>
        <li>Compound component pattern</li>
        <li>Render prop customization</li>
        <li>Zero config to get started</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>⚡️ Performance</h3>
      <ul>
        <li>FlatList virtualization for Agenda</li>
        <li>Memoized renders</li>
        <li>Optimized animations</li>
        <li>Infinite scroll support</li>
      </ul>
    </td>
    <td>
      <h3>♿️ Accessibility</h3>
      <ul>
        <li>WCAG 2.1 AA compliant</li>
        <li>Screen reader support</li>
        <li>Keyboard navigation ready</li>
        <li>Semantic roles and labels</li>
      </ul>
    </td>
  </tr>
</table>

---

## 📦 Installation

```bash
npm install calyx-rn date-fns
```

or with yarn:

```bash
yarn add calyx-rn date-fns
```

### Peer Dependencies

- `react` >=18.0.0
- `react-native` >=0.70.0
- `date-fns` ^4.0.0

---

## 🚀 Quick Start

### Basic Calendar

```tsx
import React, { useState } from 'react';
import { Calendar } from 'calyx-rn';

function MyCalendar() {
  const [selected, setSelected] = useState(new Date());

  return (
    <Calendar
      mode="month"
      selected={selected}
      onSelect={setSelected}
      theme="dark"
    />
  );
}
```

### Calendar with Events

```tsx
import { Calendar } from '@calyx/rn';
import type { CalendarEvent } from '@calyx/rn';

function EventCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      startDate: new Date(2026, 4, 15, 10, 0),
      endDate: new Date(2026, 4, 15, 11, 0),
      color: '#007AFF',
      category: 'Work',
    },
  ]);

  return (
    <Calendar
      mode="month"
      events={events}
      onEventPress={(event) => console.log('Pressed:', event.title)}
    />
  );
}
```

---

## 📘 Examples

### Month View

Classic grid calendar with date selection and event indicators.

```tsx
<Calendar
  mode="month"
  selected={date}
  onSelect={setDate}
  weekStartsOn={1} // Monday
  showWeekNumbers
  theme="ocean"
  events={events}
/>
```

**Props:**
- `selected` - Currently selected date
- `onSelect` - Callback when date is selected
- `weekStartsOn` - First day of week (0 = Sunday, 1 = Monday)
- `showWeekNumbers` - Display ISO week numbers
- `theme` - Theme name or custom theme object
- `events` - Array of calendar events
- `minDate` / `maxDate` - Date range constraints
- `disabledDates` - Array of disabled dates

---

### Week View

7-day week view with daily event display.

```tsx
<Calendar
  mode="week"
  selected={date}
  onSelect={setDate}
  showWeekNumber
  theme="forest"
  events={events}
/>
```

**Compound Component:**
```tsx
<Calendar.Week
  selected={date}
  onSelect={setDate}
  showWeekNumber
/>
```

---

### Day View

Single day view with detailed event listing.

```tsx
<Calendar
  mode="day"
  value={date}
  onChange={setDate}
  theme="sunset"
  events={events}
/>
```

**Compound Component:**
```tsx
<Calendar.Day
  value={date}
  onChange={setDate}
/>
```

---

### Timeline View ⏰

Hourly grid with time slots, conflict detection, and side-by-side event layout.

```tsx
<Calendar
  mode="timeline"
  value={date}
  onChange={setDate}
  events={events}
  timelineConfig={{
    startHour: 8,        // Start at 8 AM
    endHour: 20,         // End at 8 PM
    slotDuration: 30,    // 30-minute slots
    showCurrentTime: true,
    businessHours: { start: 9, end: 17 },
    scrollToNow: true,   // Auto-scroll to current time
  }}
  onEventPress={(event) => console.log(event)}
  onEventLongPress={(event) => console.log('Long press:', event)}
/>
```

**Compound Component:**
```tsx
<Calendar.Timeline
  value={date}
  events={events}
  timelineConfig={config}
/>
```

**Features:**
- **Conflict Detection** - Automatically detects overlapping events
- **Side-by-Side Layout** - Conflicting events displayed in columns
- **Current Time Indicator** - Red line showing current time
- **Business Hours** - Highlighted background for work hours
- **Auto-Scroll** - Scrolls to current time on mount
- **Custom Time Range** - Define your own start/end hours

**TimelineConfig Props:**
```tsx
type TimelineConfig = {
  startHour?: number;        // Default: 0
  endHour?: number;          // Default: 24
  slotDuration?: number;     // Default: 30 (minutes)
  showCurrentTime?: boolean; // Default: true
  businessHours?: { start: number; end: number }; // Default: 9-17
  scrollToNow?: boolean;     // Default: true
};
```

---

### Agenda View 📅

Chronological list with day/week/month grouping and infinite scroll.

```tsx
<Calendar
  mode="agenda"
  value={date}
  onChange={setDate}
  events={events}
  agendaConfig={{
    groupBy: 'day',        // 'day' | 'week' | 'month'
    showEmptyDays: false,  // Hide days with no events
    futureMonths: 3,       // Load 3 months ahead
    dateFormat: 'MMMM d, yyyy',
  }}
  onEventPress={(event) => console.log(event)}
/>
```

**Compound Component:**
```tsx
<Calendar.Agenda
  value={date}
  events={events}
  agendaConfig={config}
/>
```

**Features:**
- **Grouping** - Group events by day, week, or month
- **Section Headers** - Auto-generated with event counts
- **Infinite Scroll** - Loads more months as you scroll
- **Smart Formatting** - "TODAY", "TOMORROW", or formatted dates
- **All-Day Events** - Special handling for all-day events
- **Category Badges** - Colored category labels
- **Performance** - FlatList virtualization for large lists

**AgendaConfig Props:**
```tsx
type AgendaConfig = {
  groupBy?: 'day' | 'week' | 'month'; // Default: 'day'
  showEmptyDays?: boolean;             // Default: false
  futureMonths?: number;               // Default: 3
  dateFormat?: string;                 // Default: 'MMMM d, yyyy'
};
```

---

## 🎨 Theming

### Built-in Themes

Six beautiful themes ready to use:

```tsx
<Calendar theme="light" />   // Clean white background
<Calendar theme="dark" />    // Dark mode
<Calendar theme="ocean" />   // Blue ocean vibes
<Calendar theme="forest" />  // Green forest tones
<Calendar theme="sunset" />  // Warm sunset colors
<Calendar theme="minimal" /> // Minimalist design
```

### Theme Provider

Apply theme to entire component tree:

```tsx
import { ThemeProvider } from 'calyx-rn';

function App() {
  return (
    <ThemeProvider theme="dark">
      <Calendar mode="month" />
      <Calendar mode="week" />
      {/* All calendars use dark theme */}
    </ThemeProvider>
  );
}
```

### Custom Theme

Create your own theme with full type safety:

```tsx
import type { CalendarTheme } from 'calyx-rn';

const customTheme: CalendarTheme = {
  colors: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    primary: '#ff6b6b',
    primaryForeground: '#ffffff',
    muted: '#404040',
    mutedForeground: '#999999',
    accent: '#4ecdc4',
    border: '#333333',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '600',
  },
};

<Calendar theme={customTheme} />
```

---

## 🔧 API Reference

### Calendar Component

Main router component with mode switching:

```tsx
type CalendarProps = {
  // Mode
  mode?: 'month' | 'week' | 'day' | 'timeline' | 'agenda';
  
  // Date Selection (controlled)
  selected?: Date;
  onSelect?: (date: Date) => void;
  
  // Date Value (controlled - for day/timeline/agenda)
  value?: Date;
  onChange?: (date: Date) => void;
  
  // Events
  events?: CalendarEvent[];
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  
  // Configuration
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  timelineConfig?: TimelineConfig;
  agendaConfig?: AgendaConfig;
  
  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabled?: boolean;
  
  // Theming
  theme?: CalendarTheme | ThemeName;
  
  // Customization
  renderDay?: (day: CalendarDay) => React.ReactNode;
  
  // Styling
  style?: ViewStyle;
};
```

### CalendarEvent Type

```tsx
type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isAllDay?: boolean;
  color?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
```

### Compound Components

All compound components support the same props as the main Calendar component:

```tsx
Calendar.Month   // Month grid view
Calendar.Week    // Week view
Calendar.Day     // Day view
Calendar.Timeline // Timeline/hourly view
Calendar.Agenda   // Agenda/list view
```

---

## 🎭 Customization

### Custom Day Rendering

Full control over day cell appearance:

```tsx
<Calendar.Month
  renderDay={(day) => (
    <View style={styles.customDay}>
      <Text style={styles.dayNumber}>{day.calendarDate.day}</Text>
      
      {day.isToday && (
        <View style={styles.todayBadge}>
          <Text>Today</Text>
        </View>
      )}
      
      {day.isOutside && <Text style={styles.muted}>•</Text>}
      
      {hasEvent(day.date) && (
        <View style={styles.eventDot} />
      )}
    </View>
  )}
/>
```

**Day Object:**
```tsx
type CalendarDay = {
  date: Date;
  calendarDate: { day: number; month: number; year: number };
  isToday: boolean;
  isOutside: boolean; // Outside current month
  isWeekend: boolean;
};
```

### Custom Event Rendering (Timeline)

Customize event cards in Timeline view:

```tsx
<Calendar.Timeline
  renderEvent={(event, layout) => (
    <Pressable
      style={{
        position: 'absolute',
        top: layout.top,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
        height: layout.height,
        backgroundColor: event.color,
        borderRadius: 8,
        padding: 8,
      }}
      onPress={() => console.log(event)}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {event.title}
      </Text>
      <Text style={{ color: 'white', fontSize: 12 }}>
        {formatTime(event.startDate)}
      </Text>
    </Pressable>
  )}
/>
```

---

## 🪝 Headless Hooks

Use the headless hooks for complete control over rendering:

### useMonthCalendar

```tsx
import { useMonthCalendar } from 'calyx-rn';

const calendar = useMonthCalendar({
  initialDate: new Date(),
  weekStartsOn: 0,
});

// Access:
calendar.monthData      // { year, month, weeks: [{ days }] }
calendar.goToNextMonth()
calendar.goToPreviousMonth()
calendar.goToToday()
calendar.goToDate(date)
```

### useWeekCalendar

```tsx
import { useWeekCalendar } from 'calyx-rn';

const calendar = useWeekCalendar({
  initialDate: new Date(),
  weekStartsOn: 1,
});

// Access:
calendar.weekData       // { weekNumber, days: [] }
calendar.goToNextWeek()
calendar.goToPreviousWeek()
```

### useTimelineLayout

Calculate event positions for Timeline view:

```tsx
import { useTimelineLayout } from 'calyx-rn';

const layouts = useTimelineLayout(events, currentDate, {
  startHour: 9,
  endHour: 17,
});

// Returns: Array<TimelineEventLayout>
// { event, top, height, left, width, columnIndex, totalColumns }
```

### useAgendaGrouping

Group events by day/week/month:

```tsx
import { useAgendaGrouping } from 'calyx-rn';

const sections = useAgendaGrouping(events, startDate, {
  groupBy: 'day',
  futureMonths: 3,
});

// Returns: Array<AgendaSection>
// { title, date, events: [] }
```

---

## 📚 Event Management

### Fetching from API

```tsx
import { Calendar } from 'calyx-rn';
import type { CalendarEvent } from 'calyx-rn';

function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch('https://api.example.com/events')
      .then(res => res.json())
      .then(data => {
        // Transform API data to CalendarEvent format
        const calendarEvents = data.map(apiEvent => ({
          id: apiEvent.id,
          title: apiEvent.title,
          startDate: new Date(apiEvent.start_time),
          endDate: new Date(apiEvent.end_time),
          color: apiEvent.color,
          category: apiEvent.category,
        }));
        setEvents(calendarEvents);
      });
  }, []);

  return <Calendar mode="month" events={events} />;
}
```

### Using with React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'calyx-rn';

function MyCalendar() {
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  return <Calendar mode="month" events={events} />;
}
```

### Using with Zustand Store

```tsx
import { create } from 'zustand';
import { Calendar } from 'calyx-rn';

const useEventStore = create((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),
}));

function MyCalendar() {
  const events = useEventStore((state) => state.events);
  
  return <Calendar mode="month" events={events} />;
}
```

---

## 🔍 Advanced Usage

### Date Range Selection

```tsx
function DateRangePicker() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const handleSelect = (date: Date) => {
    if (!start) {
      setStart(date);
    } else if (!end) {
      setEnd(date);
    } else {
      setStart(date);
      setEnd(null);
    }
  };

  return (
    <Calendar
      mode="month"
      onSelect={handleSelect}
      renderDay={(day) => {
        const isInRange = start && end && 
          day.date >= start && day.date <= end;
        
        return (
          <View style={[
            styles.day,
            isInRange && styles.dayInRange
          ]}>
            <Text>{day.calendarDate.day}</Text>
          </View>
        );
      }}
    />
  );
}
```

### Multi-Select

```tsx
function MultiSelectCalendar() {
  const [selected, setSelected] = useState<Date[]>([]);

  const handleSelect = (date: Date) => {
    setSelected(prev => {
      const exists = prev.some(d => isSameDay(d, date));
      if (exists) {
        return prev.filter(d => !isSameDay(d, date));
      }
      return [...prev, date];
    });
  };

  return (
    <Calendar
      mode="month"
      onSelect={handleSelect}
      renderDay={(day) => {
        const isSelected = selected.some(d => isSameDay(d, day.date));
        return (
          <View style={[styles.day, isSelected && styles.selected]}>
            <Text>{day.calendarDate.day}</Text>
          </View>
        );
      }}
    />
  );
}
```

---

## 🧪 Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Calendar } from 'calyx-rn';

test('selects date when pressed', () => {
  const onSelect = jest.fn();
  const { getByText } = render(
    <Calendar mode="month" onSelect={onSelect} />
  );
  
  fireEvent.press(getByText('15'));
  expect(onSelect).toHaveBeenCalled();
});
```

---

## 🚀 Performance Tips

1. **Memoize Events** - Use `useMemo` for event arrays:
   ```tsx
   const events = useMemo(() => fetchedEvents, [fetchedEvents]);
   ```

2. **Virtualize Long Lists** - Agenda view automatically uses FlatList virtualization

3. **Optimize Renders** - Use `React.memo` for custom day components

4. **Limit Date Range** - Use `minDate` and `maxDate` to constrain navigation

---

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/lakshya-rohila/-calyx.git
cd -calyx

# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run typecheck

# Build library
npm run build

# Run example app
npm run ios
npm run android
```

---

## 🗺️ Roadmap

- **Phase 1:** ✅ Core foundation (hooks, engine, store)
- **Phase 2:** ✅ UI component system
- **Phase 3:** ✅ Event management
- **Phase 4:** ✅ Advanced views (timeline, agenda) **← Current**
- **Phase 5:** 🚧 Theme engine enhancements
- **Phase 6:** 🔜 Advanced animations
- **Phase 7:** 🔜 Developer experience (docs site, Storybook)
- **Phase 8:** 🔜 Advanced features (recurring events, time zones)
- **Phase 9:** 🔜 Production polish

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Requirements:**
- All PRs must include tests
- Follow the existing code style
- Update documentation for new features

---

## 📄 License

MIT © Lakshya Rohila

See [LICENSE](LICENSE) for details.

---

## 💬 Support

- 🐛 Issues: [GitHub Issues](https://github.com/lakshya-rohila/-calyx/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/lakshya-rohila/-calyx/discussions)
- ⭐ Star: [Star on GitHub](https://github.com/lakshya-rohila/-calyx)

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [React Native](https://reactnative.dev/)
- [date-fns](https://date-fns.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

<div align="center">
  <strong>Made with ❤️ for the React Native community</strong>
  <br />
  <br />
  <a href="https://github.com/lakshya-rohila/-calyx">⭐️ Star us on GitHub</a>
  •
  <a href="https://www.npmjs.com/package/calyx-rn">📦 View on npm</a>
</div>
