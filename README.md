# Calyx RN

Premium headless calendar library for React Native.

**Phase 1:** Core Foundation - Pure engine, Zustand store, and three React hooks.

## Installation

```bash
npm install @calyx/rn
# or
yarn add @calyx/rn
```

## Quick Start

### Simple Month Calendar

```tsx
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
```

### Week Calendar

```tsx
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
```

## Features

- **Headless Architecture** - Zero UI opinions, complete rendering control
- **Three Core Hooks** - useCalendar, useMonthCalendar, useWeekCalendar
- **TypeScript-First** - Strict mode, full type inference
- **High Performance** - Memoized calculations, virtualization support
- **Zero UI** - Bring your own components and styling
- **Configurable** - Week start day, locale support via date-fns
- **Well Tested** - >85% coverage

## API

### useCalendar

Base calendar hook for state management and navigation.

```tsx
const calendar = useCalendar({
  initialDate: new Date('2026-05-01'),
  weekStartsOn: 0, // 0 = Sunday, 1 = Monday
  onDateChange: (date) => console.log('Date changed:', date),
  onDateSelect: (date) => console.log('Selected:', date),
});
```

**Returns:**
- `currentDate`: Current viewing date
- `selectedDate`: User-selected date (null if none)
- `weekConfig`: Week configuration
- `setCurrentDate(date)`: Update current date
- `selectDate(date)`: Select a date
- `clearSelection()`: Clear selection
- `goToToday()`: Jump to today
- `isDateSelected(date)`: Check if date is selected

### useMonthCalendar

Extends useCalendar with month-specific functionality.

```tsx
const calendar = useMonthCalendar({
  weekStartsOn: 0,
  onMonthChange: (year, month) => console.log(`Viewing ${year}-${month}`),
});
```

**Returns:** All from useCalendar plus:
- `monthData`: Complete month structure with weeks
- `year`: Current year
- `month`: Current month (1-12)
- `goToNextMonth()`: Navigate to next month
- `goToPreviousMonth()`: Navigate to previous month
- `goToMonth(year, month)`: Jump to specific month
- `generateMonthAtOffset(offset)`: For infinite scroll
- `getMonthKey(offset)`: Unique key for FlashList

### useWeekCalendar

Extends useCalendar with week-specific functionality.

```tsx
const calendar = useWeekCalendar({
  weekStartsOn: 1,
  onWeekChange: (weekNum, year) => console.log(`Week ${weekNum}`),
});
```

**Returns:** All from useCalendar plus:
- `weekData`: Complete week structure (7 days)
- `weekNumber`: ISO week number
- `year`: Current year
- `goToNextWeek()`: Navigate to next week
- `goToPreviousWeek()`: Navigate to previous week
- `goToWeek(weekNum, year)`: Jump to specific week
- `generateWeekAtOffset(offset)`: For horizontal scroll
- `getWeekKey(offset)`: Unique key for FlashList

## Advanced Usage

### Custom Store

Create isolated calendar instances:

```tsx
import { createCalendarStore } from '@calyx/rn';

const customStore = createCalendarStore({ weekStartsOn: 1 });

function MyCalendar() {
  const calendar = useMonthCalendar({ store: customStore });
  // ...
}
```

### Direct Engine Access

Use pure functions for custom logic:

```tsx
import { generateMonthData, addMonths } from '@calyx/rn';

const nextMonth = addMonths(new Date(), 1);
const monthData = generateMonthData(nextMonth, { weekStartsOn: 0 });
```

## Development

```bash
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
```

## Roadmap

**Phase 1 (Current):** Core foundation - engine, store, hooks  
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

See example app in `App.tsx` for usage patterns.
