# Calyx RN

Premium headless calendar library for React Native.

**Current Version:** Phase 2 (v0.2.0) - UI Component System

## Installation

```bash
npm install @calyx/rn date-fns
# or
yarn add @calyx/rn date-fns
```

**Peer dependencies:** react >=18.0.0, react-native >=0.70.0, date-fns ^4.0.0

## Quick Start

### Simple Calendar

```tsx
import { Calendar } from '@calyx/rn';

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

### Calendar with Events (from your API)

```tsx
import { Calendar } from '@calyx/rn';
import type { CalendarEvent } from '@calyx/rn';

function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Fetch from your API
  useEffect(() => {
    fetchEventsFromAPI().then(setEvents);
  }, []);

  return (
    <Calendar
      mode="month"
      events={events}
    />
  );
}
```

📖 **[Full Events API Guide](./EVENTS_API_GUIDE.md)** - Shows how to integrate with your backend, React Query, Redux, GraphQL, etc.

### Month View

```tsx
import { Calendar } from '@calyx/rn';

<Calendar.Month
  selected={date}
  onSelect={setDate}
  weekStartsOn={1}
  theme="ocean"
/>
```

### Week View

```tsx
<Calendar.Week
  selected={date}
  onSelect={setDate}
  showWeekNumber
  theme="forest"
/>
```

### Custom Theme

```tsx
import { ThemeProvider } from '@calyx/rn';

<ThemeProvider theme="sunset">
  <Calendar mode="month" />
</ThemeProvider>
```

## Features

- 🎯 **Headless + UI** - Use hooks alone or ready-made components
- 🎨 **6 Built-in Themes** - Light, dark, ocean, forest, sunset, minimal
- 🪝 **Compound Components** - Calendar.Month, Calendar.Week, Calendar.Day
- 📅 **Event System** - Display events from any API or backend
- 🎭 **Full Customization** - Render props for complete control
- 📘 **TypeScript-First** - Strict mode, full type inference
- ♿️ **Accessible** - WCAG 2.1 AA compliant
- ⚡️ **High Performance** - Memoized, virtualization-ready
- 📱 **iOS & Android** - Works on both platforms

## API

### Calendar

Main component with mode switching:

```tsx
<Calendar
  mode="month" // 'month' | 'week' | 'day'
  selected={date}
  onSelect={setDate}
  theme="dark"
  weekStartsOn={1}
/>
```

### Compound Components

```tsx
// Month view
<Calendar.Month
  selected={date}
  onSelect={setDate}
  renderDay={(day) => <CustomDay day={day} />}
/>

// Week view
<Calendar.Week
  selected={date}
  onSelect={setDate}
  showWeekNumber
/>

// Day view
<Calendar.Day value={date} onChange={setDate} />
```

### Themes

Built-in themes: `light`, `dark`, `ocean`, `forest`, `sunset`, `minimal`

```tsx
// Pass theme name
<Calendar theme="dark" />

// Or use ThemeProvider
<ThemeProvider theme="ocean">
  <Calendar />
</ThemeProvider>

// Or pass custom theme object
<Calendar theme={myCustomTheme} />
```

### Headless Hooks (Phase 1)

```tsx
import { useMonthCalendar } from '@calyx/rn';

const calendar = useMonthCalendar({ weekStartsOn: 0 });

// Access: calendar.monthData, calendar.goToNextMonth(), etc.
```

## Customization

### Custom Day Rendering

```tsx
<Calendar.Month
  renderDay={(day) => (
    <View>
      <Text>{day.calendarDate.day}</Text>
      {day.isToday && <Badge>Today</Badge>}
      {hasEvent(day.date) && <Dot />}
    </View>
  )}
/>
```

### Custom Theme

```tsx
const myTheme = {
  colors: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    primary: '#ff6b6b',
    // ... other colors
  },
  spacing: { cellSize: 48, cellGap: 2, padding: 16, headerSpacing: 12 },
  borderRadius: { cell: 24, container: 12 },
  fontSize: { day: 16, weekday: 12, header: 20 },
  fontWeight: { regular: '400', bold: '600' },
};

<Calendar theme={myTheme} />
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run type check
npm run typecheck

# Run example app
npm run ios
npm run android

# Build
npm run build
```

## Roadmap

**Phase 1:** ✅ Core foundation (hooks, engine, store)  
**Phase 2:** ✅ UI component system  
**Phase 3:** ✅ Event management (current)  
**Phase 4:** Advanced views (timeline, agenda)  
**Phase 5:** Theme engine  
**Phase 6:** Animation system  
**Phase 7:** Developer experience (docs, Storybook)  
**Phase 8:** Advanced features (plugins, sync)  
**Phase 9:** Production polish

## License

MIT

## Contributing

See example app for usage patterns. Tests required for all PRs.
