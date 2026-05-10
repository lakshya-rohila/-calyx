# Calyx RN - Phase 2: UI Component System Design

**Date:** 2026-05-10  
**Phase:** Phase 2 of 9  
**Version:** 0.2.0 target  
**Status:** Design approved, ready for implementation

---

## Executive Summary

Phase 2 builds the UI component layer on top of Phase 1's headless hooks. This phase delivers actual calendar components users can drop into their apps with minimal configuration, while maintaining deep customization through compound components and render props.

**What we're building:** A flexible, theme-able, accessible calendar component system using compound component pattern. Users get both convenience (`<Calendar />`) and power (compound components with render props).

**What we're NOT building yet:** Events (Phase 3), Timeline/Agenda views (Phase 4), advanced theme engine (Phase 5), Reanimated animations (Phase 6).

---

## Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Styling | React Native StyleSheet | Zero dependencies, widest compatibility |
| Component Pattern | Compound Components | Flexibility + convenience, industry standard |
| Control Mode | Both controlled & uncontrolled | Maximum flexibility like HTML inputs |
| Themes | 5-6 built-in themes | Good variety without scope creep |
| Customization | Full render props | Users can replace any part |
| Animations | Basic press feedback | Polished feel without complexity |

---

## Architecture Overview

### Component Hierarchy

```
┌─────────────────────────────────────────┐
│            <Calendar />                 │  Main component + mode switcher
│  - Smart wrapper                        │
│  - Exports compound components          │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┬──────────────┬──────────────┐
    │                     │              │              │
┌───▼────────┐  ┌────────▼──────┐  ┌───▼──────┐  ┌───▼──────┐
│ Calendar.  │  │  Calendar.    │  │Calendar. │  │Calendar. │
│   Month    │  │    Week       │  │   Day    │  │  Header  │
└────────────┘  └───────────────┘  └──────────┘  └──────────┘
     │
     └─── Uses useMonthCalendar (Phase 1)
     └─── Renders DayCell primitives
     └─── Applies theme
```

### Layer Integration

Phase 2 components sit on top of Phase 1:

```
┌─────────────────────────────────────┐
│     UI Components (Phase 2)         │  ← Calendar, CalendarMonth, DayCell
│  - Render components                │
│  - Theme application                │
│  - User interactions                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Hooks Layer (Phase 1)       │  ← useCalendar, useMonthCalendar
│  - React state management           │
│  - Component lifecycle              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Store Layer (Phase 1)          │  ← Zustand
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Engine Layer (Phase 1)           │  ← Pure functions
└─────────────────────────────────────┘
```

---

## Project Structure

```
src/
  components/
    Calendar/
      Calendar.tsx              # Main component + compound exports
      CalendarMonth.tsx         # <Calendar.Month>
      CalendarWeek.tsx          # <Calendar.Week>
      CalendarDay.tsx           # <Calendar.Day>
      CalendarHeader.tsx        # <Calendar.Header>
      CalendarWeekDays.tsx      # <Calendar.WeekDays>
      CalendarDays.tsx          # <Calendar.Days>
      types.ts                  # Component prop types
      index.ts                  # Exports
    
    primitives/
      DayCell.tsx               # Pressable day cell
      NavigationButton.tsx      # Arrow buttons
      MonthYearDisplay.tsx      # "May 2026" text
      index.ts
    
    theme/
      types.ts                  # Theme type definitions
      themes.ts                 # Built-in themes
      ThemeProvider.tsx         # Context provider
      useTheme.ts               # Theme hook
      index.ts
    
    index.ts                    # All component exports
  
  engine/                       # Phase 1 - unchanged
  store/                        # Phase 1 - unchanged
  hooks/                        # Phase 1 - unchanged
  types/                        # Phase 1 - unchanged
  index.ts                      # Updated with component exports

__tests__/
  components/
    Calendar.test.tsx
    CalendarMonth.test.tsx
    CalendarWeek.test.tsx
    DayCell.test.tsx
    theme/
      ThemeProvider.test.tsx
      themes.test.ts

example/
  screens/
    CalendarDemo.tsx            # Updated with new components
    ThemeSwitcher.tsx           # Theme switching demo
    CustomizationDemo.tsx       # Render prop examples
```

---

## Theme System Specification

### Theme Type Definition

```typescript
export type CalendarTheme = {
  colors: {
    // Core
    background: string;
    foreground: string;
    border: string;
    
    // Interactive states
    primary: string;
    primaryForeground: string;
    selected: string;
    selectedForeground: string;
    
    // Day states
    today: string;
    todayForeground: string;
    disabled: string;
    weekend: string;
    overflow: string;        // Days from other months
    
    // Interaction feedback
    hover: string;
    pressed: string;
  };
  
  spacing: {
    cellSize: number;        // Day cell size (48)
    cellGap: number;         // Gap between cells (2)
    padding: number;         // Container padding (16)
    headerSpacing: number;   // Header bottom margin (12)
  };
  
  borderRadius: {
    cell: number;            // Day cell radius (24 = circular)
    container: number;       // Calendar container (12)
  };
  
  fontSize: {
    day: number;             // Day number (16)
    weekday: number;         // Weekday labels (12)
    header: number;          // Month/year (20)
  };
  
  fontWeight: {
    regular: '400' | '500' | '600';
    bold: '600' | '700' | '800';
  };
};
```

### Built-in Themes

**1. Light Theme**
```typescript
{
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#E5E5E5',
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    selected: '#007AFF',
    selectedForeground: '#FFFFFF',
    today: '#007AFF',
    todayForeground: '#007AFF',
    disabled: '#D1D1D6',
    weekend: '#8E8E93',
    overflow: '#C7C7CC',
    hover: '#F2F2F7',
    pressed: '#E5E5EA',
  },
  // ... spacing, borderRadius, fontSize
}
```

**2. Dark Theme**
```typescript
{
  colors: {
    background: '#1C1C1E',
    foreground: '#FFFFFF',
    border: '#38383A',
    primary: '#0A84FF',
    primaryForeground: '#FFFFFF',
    selected: '#0A84FF',
    selectedForeground: '#FFFFFF',
    today: '#0A84FF',
    todayForeground: '#0A84FF',
    disabled: '#48484A',
    weekend: '#8E8E93',
    overflow: '#636366',
    hover: '#2C2C2E',
    pressed: '#3A3A3C',
  },
  // ... spacing, borderRadius, fontSize
}
```

**3. Ocean Theme**
```typescript
{
  colors: {
    background: '#F0F9FF',
    foreground: '#0C4A6E',
    border: '#BAE6FD',
    primary: '#0284C7',
    selected: '#0284C7',
    today: '#0EA5E9',
    // ... teal/blue palette
  }
}
```

**4. Forest Theme**
```typescript
{
  colors: {
    background: '#F0FDF4',
    foreground: '#14532D',
    border: '#BBF7D0',
    primary: '#16A34A',
    selected: '#16A34A',
    today: '#22C55E',
    // ... green/earthy palette
  }
}
```

**5. Sunset Theme**
```typescript
{
  colors: {
    background: '#FFF7ED',
    foreground: '#7C2D12',
    border: '#FED7AA',
    primary: '#EA580C',
    selected: '#EA580C',
    today: '#F97316',
    // ... orange/pink warm palette
  }
}
```

**6. Minimal Theme**
```typescript
{
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#000000',
    primary: '#000000',
    selected: '#000000',
    today: '#000000',
    // ... pure black/white high contrast
  }
}
```

### Theme Usage

```typescript
// Theme provider wraps app or screen
<ThemeProvider theme="dark">
  <Calendar />
</ThemeProvider>

// Or pass theme name as prop
<Calendar theme="ocean" />

// Or pass custom theme object
<Calendar theme={myCustomTheme} />

// Access theme in custom components
const theme = useTheme();
```

---

## Component API Specification

### Calendar (Main Component)

**Purpose:** Smart wrapper that renders Month/Week/Day based on mode. Provides simple API for common use cases.

```typescript
type CalendarProps = {
  // Display mode
  mode?: 'month' | 'week' | 'day';
  
  // Controlled state (for current viewing date)
  value?: Date;
  onChange?: (date: Date) => void;
  
  // Uncontrolled state
  defaultValue?: Date;
  
  // Selection (separate from viewing date)
  selected?: Date;
  onSelect?: (date: Date) => void;
  defaultSelected?: Date;
  
  // Configuration
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  theme?: CalendarTheme | 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'minimal';
  
  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabled?: boolean;
  
  // Customization
  renderDay?: (day: DayData) => React.ReactNode;
  renderHeader?: (props: HeaderProps) => React.ReactNode;
  renderWeekday?: (day: string) => React.ReactNode;
  
  // Behavior
  showWeekNumbers?: boolean;
  highlightToday?: boolean;
  
  // Callbacks
  onMonthChange?: (year: number, month: number) => void;
  onWeekChange?: (weekNumber: number, year: number) => void;
  
  // Style
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};
```

**Example usage:**

```tsx
// Simple month calendar
<Calendar
  mode="month"
  selected={selectedDate}
  onSelect={setSelectedDate}
  theme="dark"
/>

// Week view with custom day rendering
<Calendar
  mode="week"
  value={currentDate}
  onChange={setCurrentDate}
  renderDay={(day) => (
    <CustomDayCell day={day} hasEvent={hasEvent(day.date)} />
  )}
/>

// Controlled with date range constraints
<Calendar
  mode="month"
  value={viewDate}
  onChange={setViewDate}
  selected={selectedDate}
  onSelect={setSelectedDate}
  minDate={new Date('2026-01-01')}
  maxDate={new Date('2026-12-31')}
  weekStartsOn={1}
/>
```

---

### Calendar.Month (Compound Component)

**Purpose:** Month grid view with full customization through composition.

```typescript
type CalendarMonthProps = {
  // Controlled/uncontrolled
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
  
  // Selection
  selected?: Date;
  onSelect?: (date: Date) => void;
  
  // Config
  weekStartsOn?: 0 | 1;
  theme?: CalendarTheme | string;
  
  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  
  // Customization via render props
  renderDay?: (day: DayData) => React.ReactNode;
  renderHeader?: (props: HeaderProps) => React.ReactNode;
  
  // Callbacks
  onMonthChange?: (year: number, month: number) => void;
  
  // Children (compound sub-components)
  children?: React.ReactNode;
  
  // Style
  style?: ViewStyle;
};
```

**Example usage:**

```tsx
// Composed with sub-components
<Calendar.Month value={date} onChange={setDate}>
  <Calendar.Header />
  <Calendar.WeekDays />
  <Calendar.Days
    renderDay={(day) => <CustomDay day={day} />}
  />
</Calendar.Month>

// Or use defaults
<Calendar.Month
  selected={date}
  onSelect={setDate}
  theme="ocean"
/>
```

---

### Calendar.Week (Compound Component)

**Purpose:** Horizontal week strip view.

```typescript
type CalendarWeekProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
  
  selected?: Date;
  onSelect?: (date: Date) => void;
  
  weekStartsOn?: 0 | 1;
  theme?: CalendarTheme | string;
  
  showWeekNumber?: boolean;
  
  renderDay?: (day: DayData) => React.ReactNode;
  
  onWeekChange?: (weekNumber: number, year: number) => void;
  
  style?: ViewStyle;
};
```

---

### Calendar.Day (Compound Component)

**Purpose:** Single day detail view (foundation for Phase 4 timeline).

```typescript
type CalendarDayProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
  
  theme?: CalendarTheme | string;
  
  renderHeader?: (date: Date) => React.ReactNode;
  
  style?: ViewStyle;
};
```

---

### DayCell (Primitive Component)

**Purpose:** Individual pressable day cell. Building block for custom renders.

```typescript
type DayCellProps = {
  day: DayData;
  
  // State
  selected?: boolean;
  disabled?: boolean;
  
  // Interaction
  onPress?: () => void;
  onLongPress?: () => void;
  
  // Theme
  theme: CalendarTheme;
  
  // Customization
  children?: React.ReactNode;
  
  // Style
  style?: ViewStyle;
  textStyle?: TextStyle;
};
```

**Behavior:**
- Press animation: scale 1.0 → 0.95, opacity fade
- Visual states: default, selected, today, disabled, overflow
- Minimum touch target: 48x48
- Accessibility labels included

**Example:**

```tsx
<DayCell
  day={dayData}
  selected={isSelected}
  onPress={() => onSelectDate(dayData.date)}
  theme={theme}
/>

// Custom rendering
<DayCell day={dayData} theme={theme}>
  <View>
    <Text>{dayData.calendarDate.day}</Text>
    {hasEvent && <View style={styles.eventDot} />}
  </View>
</DayCell>
```

---

## Implementation Details

### Calendar.tsx (Main Component)

**Responsibilities:**
- Mode switching (renders Month/Week/Day)
- Manages controlled/uncontrolled state
- Provides default theme if none specified
- Exports compound components as static properties

**Implementation pattern:**

```typescript
function Calendar(props: CalendarProps) {
  const { mode = 'month', theme = 'light', ...rest } = props;
  
  // Render appropriate view based on mode
  if (mode === 'month') return <CalendarMonth {...rest} theme={theme} />;
  if (mode === 'week') return <CalendarWeek {...rest} theme={theme} />;
  if (mode === 'day') return <CalendarDay {...rest} theme={theme} />;
}

// Compound component pattern
Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.Day = CalendarDay;
Calendar.Header = CalendarHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.Days = CalendarDays;

export { Calendar };
```

---

### CalendarMonth.tsx

**Responsibilities:**
- Uses `useMonthCalendar` hook from Phase 1
- Renders header, weekday labels, day grid
- Handles date selection
- Supports render prop customization
- Applies theme

**Layout:**
```
┌─────────────────────────────────┐
│      < May 2026 >               │ ← CalendarHeader
├─────────────────────────────────┤
│ Sun Mon Tue Wed Thu Fri Sat     │ ← CalendarWeekDays
├─────────────────────────────────┤
│  26  27  28  29  30   1   2     │
│   3   4   5   6   7   8   9     │ ← CalendarDays (7×5 grid)
│  10  11  12  13  14  15  16     │
│  17  18  19  20  21  22  23     │
│  24  25  26  27  28  29  30     │
└─────────────────────────────────┘
```

**Key implementation:**
- FlatList or View with flex for day grid
- Each week is a row (flexDirection: 'row')
- Each day is a DayCell component
- Overflow days have reduced opacity

---

### CalendarWeek.tsx

**Responsibilities:**
- Uses `useWeekCalendar` hook
- Horizontal layout of 7 days
- Optional week number display
- Navigation buttons

**Layout:**
```
┌───────────────────────────────────────┐
│  < Week 20 >                          │ ← Header with week number
├───────────────────────────────────────┤
│  Sun Mon Tue Wed Thu Fri Sat          │ ← Week days
│   10  11  12  13  14  15  16          │ ← Day cells
└───────────────────────────────────────┘
```

---

### CalendarHeader.tsx

**Responsibilities:**
- Displays current month/year or week number
- Navigation buttons (prev/next)
- Optional "Today" button

**API:**

```typescript
type CalendarHeaderProps = {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday?: () => void;
  theme: CalendarTheme;
};
```

---

### Theme System Implementation

**ThemeProvider.tsx:**

```typescript
const ThemeContext = createContext<CalendarTheme | null>(null);

export function ThemeProvider({ 
  theme, 
  children 
}: { 
  theme: CalendarTheme | keyof typeof themes; 
  children: React.ReactNode;
}) {
  const resolvedTheme = typeof theme === 'string' ? themes[theme] : theme;
  
  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**useTheme.ts:**

```typescript
export function useTheme(): CalendarTheme {
  const theme = useContext(ThemeContext);
  
  if (!theme) {
    // Return default light theme if no provider
    return themes.light;
  }
  
  return theme;
}
```

---

## Accessibility Specification

### WCAG 2.1 AA Compliance

**Requirements:**
- Minimum touch target: 44×44 (iOS HIG) / 48×48 (Material)
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- All interactive elements have accessibility labels
- Support for screen readers (VoiceOver, TalkBack)
- Keyboard navigation (web/TV)
- Dynamic font scaling support

### Implementation

**DayCell accessibility:**

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`${day.calendarDate.day} ${monthName} ${year}, ${dayName}`}
  accessibilityState={{
    selected: isSelected,
    disabled: isDisabled,
  }}
  accessibilityHint="Double tap to select this date"
  style={{ minWidth: 48, minHeight: 48 }}
>
  {/* content */}
</Pressable>
```

**CalendarHeader accessibility:**

```typescript
<View
  accessibilityRole="header"
  accessible
  accessibilityLabel={`${monthName} ${year}`}
>
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Previous month"
    onPress={onPrevious}
  >
    <ArrowLeft />
  </Pressable>
  
  <Text>{monthName} {year}</Text>
  
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Next month"
    onPress={onNext}
  >
    <ArrowRight />
  </Pressable>
</View>
```

**Dynamic font scaling:**
- All Text components use `allowFontScaling={true}` (default)
- Layout adapts to scaled text (no fixed heights)

---

## Animation Specification

### Press Feedback (Basic)

**DayCell press animation:**

```typescript
const scaleAnim = useRef(new Animated.Value(1)).current;
const opacityAnim = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.parallel([
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 0.7,
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
```

**What we're NOT animating (yet):**
- Month transitions (Phase 6)
- Layout animations (Phase 6)
- Gesture-driven animations (Phase 6)

---

## Testing Strategy

### Component Tests

**Calendar.test.tsx:**
- Renders in month mode
- Renders in week mode
- Renders in day mode
- Switches between modes
- Applies theme correctly
- Controlled mode updates on prop change
- Uncontrolled mode maintains internal state

**CalendarMonth.test.tsx:**
- Renders current month
- Navigates to next month
- Navigates to previous month
- Selects date on press
- Renders custom day via renderDay prop
- Respects minDate/maxDate constraints
- Shows disabled dates
- Highlights today
- Shows overflow days

**DayCell.test.tsx:**
- Renders day number
- Shows selected state
- Shows today state
- Shows disabled state
- Shows overflow state (dimmed)
- Calls onPress when tapped
- Has correct accessibility labels
- Press animation triggers

**Theme tests:**
- ThemeProvider provides theme to children
- useTheme returns current theme
- useTheme returns default when no provider
- All 6 built-in themes render correctly
- Custom theme object applies

**Snapshot tests:**
- Calendar in each mode
- Each theme applied
- Selected state
- Disabled state
- Custom rendering

### Coverage Goals

- Component rendering: >90%
- User interactions: >85%
- Theme application: 100%
- Accessibility: >90%

---

## Updated Public API

### Exports from src/index.ts

```typescript
// Phase 1 exports (unchanged)
export { useCalendar, useMonthCalendar, useWeekCalendar } from './hooks';
export type { /* all Phase 1 types */ } from './types';

// Phase 2 exports (NEW)
export { Calendar } from './components';
export { DayCell, NavigationButton } from './components/primitives';
export { ThemeProvider, useTheme } from './components/theme';
export type { 
  CalendarTheme,
  CalendarProps,
  CalendarMonthProps,
  CalendarWeekProps,
  CalendarDayProps,
  DayCellProps,
} from './components';

// Built-in themes
export { themes } from './components/theme';
```

### Migration from Phase 1

**Before (Phase 1 - headless):**
```tsx
const calendar = useMonthCalendar();

return (
  <View>
    {calendar.monthData.weeks.map(week => (
      <View key={week.weekNumber} style={{ flexDirection: 'row' }}>
        {week.days.map(day => (
          <Pressable onPress={() => calendar.selectDate(day.date)}>
            <Text>{day.calendarDate.day}</Text>
          </Pressable>
        ))}
      </View>
    ))}
  </View>
);
```

**After (Phase 2 - with UI components):**
```tsx
return (
  <Calendar
    mode="month"
    selected={selectedDate}
    onSelect={setSelectedDate}
    theme="dark"
  />
);
```

**Both APIs coexist** - Phase 1 hooks are still available for custom UIs.

---

## Example App Updates

### New Screens

**CalendarDemo.tsx:**
```tsx
export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState<'month' | 'week' | 'day'>('month');
  
  return (
    <View>
      <ModeSwitcher mode={mode} onChangeMode={setMode} />
      
      <Calendar
        mode={mode}
        selected={selectedDate}
        onSelect={setSelectedDate}
        theme="light"
      />
      
      <Text>Selected: {selectedDate.toDateString()}</Text>
    </View>
  );
}
```

**ThemeSwitcher.tsx:**
```tsx
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<keyof typeof themes>('light');
  
  return (
    <View>
      <ThemePicker value={theme} onChange={setTheme} />
      
      <ThemeProvider theme={theme}>
        <Calendar mode="month" />
      </ThemeProvider>
    </View>
  );
}
```

**CustomizationDemo.tsx:**
```tsx
export function CustomizationDemo() {
  return (
    <Calendar.Month
      renderDay={(day) => (
        <View>
          <Text style={{ fontSize: 20 }}>{day.calendarDate.day}</Text>
          {day.isToday && <Text style={{ fontSize: 10 }}>TODAY</Text>}
          {hasEvent(day.date) && <View style={styles.dot} />}
        </View>
      )}
    />
  );
}
```

---

## Phase 2 Deliverables Checklist

### Code

- [ ] Calendar.tsx (main component + compound exports)
- [ ] CalendarMonth.tsx with useMonthCalendar
- [ ] CalendarWeek.tsx with useWeekCalendar
- [ ] CalendarDay.tsx with useCalendar
- [ ] CalendarHeader.tsx (navigation + display)
- [ ] CalendarWeekDays.tsx (weekday labels)
- [ ] CalendarDays.tsx (day grid)
- [ ] DayCell.tsx with press animation
- [ ] NavigationButton.tsx primitive
- [ ] Theme system (types, 6 themes, provider, hook)

### Tests

- [ ] Calendar.test.tsx
- [ ] CalendarMonth.test.tsx
- [ ] CalendarWeek.test.tsx
- [ ] DayCell.test.tsx
- [ ] Theme tests
- [ ] Snapshot tests for all themes
- [ ] >85% coverage

### Documentation

- [ ] Updated README with component examples
- [ ] API reference for all components
- [ ] Theme customization guide
- [ ] Migration guide from Phase 1

### Example App

- [ ] CalendarDemo.tsx
- [ ] ThemeSwitcher.tsx
- [ ] CustomizationDemo.tsx
- [ ] Updated App.tsx with new tabs

### Quality

- [ ] TypeScript compiles with no errors
- [ ] All tests passing
- [ ] Accessibility labels on all interactive elements
- [ ] Minimum 48x48 touch targets
- [ ] Press animations working
- [ ] All 6 themes applied correctly

---

## Success Criteria

Phase 2 is **complete** when:

1. ✅ `<Calendar mode="month" />` renders working month calendar
2. ✅ `<Calendar mode="week" />` renders working week calendar
3. ✅ `<Calendar mode="day" />` renders working day view
4. ✅ All 6 themes (light, dark, ocean, forest, sunset, minimal) apply correctly
5. ✅ Date selection works (controlled and uncontrolled)
6. ✅ Navigation works (next/previous month/week)
7. ✅ Render props allow full customization
8. ✅ Press animations feel smooth
9. ✅ Accessibility labels present and correct
10. ✅ Tests passing with >85% coverage
11. ✅ Example app demonstrates all features
12. ✅ TypeScript strict mode passes
13. ✅ Published as `@calyx/rn@0.2.0`

---

## What Phase 2 Does NOT Include

**Explicitly out of scope:**
- ❌ Events and event rendering (Phase 3)
- ❌ Timeline view (Phase 4)
- ❌ Agenda view (Phase 4)
- ❌ Reanimated animations (Phase 6)
- ❌ Gesture system (pinch, swipe with physics) (Phase 6)
- ❌ Advanced theme engine with 10+ themes (Phase 5)
- ❌ Date range selection (future)
- ❌ Multi-date selection (future)

**Phase 2 provides:**
- Basic calendar UI components
- 6 theme options
- Compound component pattern
- Full render prop customization
- Basic press animations
- Accessibility foundation

---

## Architecture Validation

### Does this design support future phases?

**Phase 3 (Events):**
- ✅ DayCell accepts children (can add event indicators)
- ✅ renderDay prop allows custom event rendering
- ✅ Calendar.Days can be extended with event overlay

**Phase 4 (Timeline/Agenda):**
- ✅ Compound pattern extends easily: Calendar.Timeline, Calendar.Agenda
- ✅ CalendarDay.tsx is foundation for timeline
- ✅ Theme system supports new view types

**Phase 5 (Theme Engine):**
- ✅ CalendarTheme type is extensible
- ✅ ThemeProvider architecture supports advanced features
- ✅ Can add theme variants (light-compact, dark-bold, etc.)

**Phase 6 (Animations):**
- ✅ Components use Animated.View where needed
- ✅ Can upgrade to Reanimated without breaking API
- ✅ Animation values can be exposed via context

---

## Open Questions

*None - all requirements clarified during brainstorming.*

---

## Approval & Sign-off

**Design Status:** ✅ Approved  
**Ready for Implementation Plan:** Yes  
**Next Step:** Invoke `writing-plans` skill

---

*End of Phase 2 Design Specification*
