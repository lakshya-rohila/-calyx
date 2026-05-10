import React17, { createContext, useEffect, useCallback, useMemo, useRef, useContext, useState } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { addWeeks as addWeeks$1, addMonths as addMonths$1, isSameDay as isSameDay$1, isToday as isToday$1, isWeekend as isWeekend$1, isSameMonth as isSameMonth$1, isSameWeek as isSameWeek$1, addDays as addDays$1, startOfMonth as startOfMonth$1, endOfMonth as endOfMonth$1, startOfWeek as startOfWeek$1, endOfWeek as endOfWeek$1, startOfDay as startOfDay$1, endOfDay as endOfDay$1, getDaysInMonth as getDaysInMonth$1, getISOWeek, getDay, format, isTomorrow, isThisWeek } from 'date-fns';
import { StyleSheet, View, Animated, Pressable, Text, ScrollView, FlatList, ActivityIndicator } from 'react-native';

// src/hooks/useCalendar.ts
function isSameDay(dateLeft, dateRight) {
  return isSameDay$1(dateLeft, dateRight);
}
function isToday(date) {
  return isToday$1(date);
}
function isWeekend(date) {
  return isWeekend$1(date);
}
function isSameMonth(dateLeft, dateRight) {
  return isSameMonth$1(dateLeft, dateRight);
}
function isSameWeek(dateLeft, dateRight, config) {
  return isSameWeek$1(dateLeft, dateRight, {
    weekStartsOn: config?.weekStartsOn ?? 0
  });
}
function addMonths(date, amount) {
  return addMonths$1(date, amount);
}
function addWeeks(date, amount) {
  return addWeeks$1(date, amount);
}
function addDays(date, amount) {
  return addDays$1(date, amount);
}
function subMonths(date, amount) {
  return addMonths$1(date, -amount);
}
function subWeeks(date, amount) {
  return addWeeks$1(date, -amount);
}
function subDays(date, amount) {
  return addDays$1(date, -amount);
}
function startOfMonth(date) {
  return startOfMonth$1(date);
}
function endOfMonth(date) {
  return endOfMonth$1(date);
}
function startOfWeek(date, config) {
  return startOfWeek$1(date, { weekStartsOn: config?.weekStartsOn ?? 0 });
}
function endOfWeek(date, config) {
  return endOfWeek$1(date, { weekStartsOn: config?.weekStartsOn ?? 0 });
}
function startOfDay(date) {
  return startOfDay$1(date);
}
function endOfDay(date) {
  return endOfDay$1(date);
}
function getDaysInMonth(yearOrDate, month) {
  if (yearOrDate instanceof Date) {
    return getDaysInMonth$1(yearOrDate);
  }
  return getDaysInMonth$1(new Date(yearOrDate, (month ?? 1) - 1, 1));
}
function getWeekNumber(date) {
  return getISOWeek(date);
}
function getDayOfWeek(date) {
  return getDay(date);
}
function toCalendarDate(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    // Convert from 0-based to 1-based
    day: date.getDate()
  };
}
function fromCalendarDate(calendarDate) {
  return new Date(
    calendarDate.year,
    calendarDate.month - 1,
    // Convert from 1-based to 0-based
    calendarDate.day,
    0,
    0,
    0,
    0
  );
}

// src/store/calendar-store.ts
var createCalendarStore = (initialConfig) => {
  return create()(
    immer((set) => ({
      // Initial state
      currentDate: /* @__PURE__ */ new Date(),
      selectedDate: null,
      weekConfig: {
        weekStartsOn: initialConfig?.weekStartsOn ?? 0,
        locale: initialConfig?.locale
      },
      // Navigation actions
      setCurrentDate: (date) => set((state) => {
        state.currentDate = date;
      }),
      goToToday: () => set((state) => {
        state.currentDate = /* @__PURE__ */ new Date();
      }),
      goToNextMonth: () => set((state) => {
        state.currentDate = addMonths(state.currentDate, 1);
      }),
      goToPreviousMonth: () => set((state) => {
        state.currentDate = addMonths(state.currentDate, -1);
      }),
      goToNextWeek: () => set((state) => {
        state.currentDate = addWeeks(state.currentDate, 1);
      }),
      goToPreviousWeek: () => set((state) => {
        state.currentDate = addWeeks(state.currentDate, -1);
      }),
      goToDate: (date) => set((state) => {
        state.currentDate = date;
      }),
      // Selection actions
      setSelectedDate: (date) => set((state) => {
        state.selectedDate = date;
      }),
      clearSelection: () => set((state) => {
        state.selectedDate = null;
      }),
      // Configuration actions
      setWeekConfig: (config) => set((state) => {
        state.weekConfig = config;
      }),
      setWeekStartsOn: (day) => set((state) => {
        state.weekConfig.weekStartsOn = day;
      })
    }))
  );
};
var useCalendarStore = createCalendarStore();

// src/hooks/useCalendar.ts
function useCalendar(options = {}) {
  const {
    initialDate,
    weekStartsOn,
    onDateChange,
    onDateSelect,
    store = useCalendarStore
  } = options;
  const currentDate = store((state) => state.currentDate);
  const selectedDate = store((state) => state.selectedDate);
  const weekConfig = store((state) => state.weekConfig);
  const setCurrentDateAction = store((state) => state.setCurrentDate);
  const setSelectedDateAction = store((state) => state.setSelectedDate);
  const clearSelectionAction = store((state) => state.clearSelection);
  const goToTodayAction = store((state) => state.goToToday);
  const goToDateAction = store((state) => state.goToDate);
  const setWeekStartsOnAction = store((state) => state.setWeekStartsOn);
  useEffect(() => {
    if (initialDate) {
      setCurrentDateAction(initialDate);
    }
    if (weekStartsOn !== void 0) {
      setWeekStartsOnAction(weekStartsOn);
    }
  }, []);
  useEffect(() => {
    onDateChange?.(currentDate);
  }, [currentDate, onDateChange]);
  useEffect(() => {
    if (selectedDate !== null) {
      onDateSelect?.(selectedDate);
    }
  }, [selectedDate, onDateSelect]);
  const setCurrentDate = useCallback((date) => {
    setCurrentDateAction(date);
  }, [setCurrentDateAction]);
  const selectDate = useCallback((date) => {
    setSelectedDateAction(date);
  }, [setSelectedDateAction]);
  const clearSelection = useCallback(() => {
    clearSelectionAction();
  }, [clearSelectionAction]);
  const goToToday = useCallback(() => {
    goToTodayAction();
  }, [goToTodayAction]);
  const goToDate = useCallback((date) => {
    goToDateAction(date);
  }, [goToDateAction]);
  const isDateSelected = useCallback((date) => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  }, [selectedDate]);
  const isDateCurrent = useCallback((date) => {
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
    isDateCurrent
  };
}

// src/engine/month-generator.ts
function generateMonthData(date, config) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const totalDays = getDaysInMonth(year, month);
  const calendarStart = startOfWeek(monthStart, config);
  const calendarEnd = endOfWeek(monthEnd, config);
  const weeks = [];
  let currentWeekStart = calendarStart;
  while (currentWeekStart <= calendarEnd) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(currentWeekStart, i);
      days.push({
        date: currentDay,
        calendarDate: toCalendarDate(currentDay),
        isToday: isToday(currentDay),
        isWeekend: isWeekend(currentDay),
        isCurrentMonth: isSameMonth(currentDay, date),
        dayOfWeek: getDayOfWeek(currentDay)
      });
    }
    weeks.push({
      weekNumber: getWeekNumber(currentWeekStart),
      days
    });
    currentWeekStart = addDays(currentWeekStart, 7);
  }
  return {
    year,
    month,
    weeks,
    totalDays
  };
}

// src/hooks/useMonthCalendar.ts
function useMonthCalendar(options = {}) {
  const { onMonthChange, store = useCalendarStore, ...calendarOptions } = options;
  const calendar = useCalendar({ ...calendarOptions, store });
  const goToNextMonthAction = store((state) => state.goToNextMonth);
  const goToPreviousMonthAction = store((state) => state.goToPreviousMonth);
  const monthData = useMemo(() => {
    return generateMonthData(calendar.currentDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  const year = monthData.year;
  const month = monthData.month;
  useEffect(() => {
    onMonthChange?.(year, month);
  }, [year, month, onMonthChange]);
  const goToNextMonth = useCallback(() => {
    goToNextMonthAction();
  }, [goToNextMonthAction]);
  const goToPreviousMonth = useCallback(() => {
    goToPreviousMonthAction();
  }, [goToPreviousMonthAction]);
  const goToMonth = useCallback((targetYear, targetMonth) => {
    const targetDate = new Date(targetYear, targetMonth - 1, 1);
    calendar.setCurrentDate(targetDate);
  }, [calendar]);
  const generateMonthAtOffset = useCallback((offset) => {
    const targetDate = addMonths(calendar.currentDate, offset);
    return generateMonthData(targetDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  const getMonthKey = useCallback((offset) => {
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
    getMonthKey
  };
}

// src/engine/week-generator.ts
function generateWeekData(date, config) {
  const weekStart = startOfWeek(date, config);
  const weekNum = getWeekNumber(date);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);
    days.push({
      date: currentDay,
      calendarDate: toCalendarDate(currentDay),
      isToday: isToday(currentDay),
      isWeekend: isWeekend(currentDay),
      isCurrentMonth: true,
      // Week view doesn't distinguish months
      dayOfWeek: getDayOfWeek(currentDay)
    });
  }
  return {
    weekNumber: weekNum,
    days
  };
}

// src/hooks/useWeekCalendar.ts
function useWeekCalendar(options = {}) {
  const { onWeekChange, store = useCalendarStore, ...calendarOptions } = options;
  const calendar = useCalendar({ ...calendarOptions, store });
  const goToNextWeekAction = store((state) => state.goToNextWeek);
  const goToPreviousWeekAction = store((state) => state.goToPreviousWeek);
  const weekData = useMemo(() => {
    return generateWeekData(calendar.currentDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  const weekNumber = weekData.weekNumber;
  const year = calendar.currentDate.getFullYear();
  useEffect(() => {
    onWeekChange?.(weekNumber, year);
  }, [weekNumber, year, onWeekChange]);
  const goToNextWeek = useCallback(() => {
    goToNextWeekAction();
  }, [goToNextWeekAction]);
  const goToPreviousWeek = useCallback(() => {
    goToPreviousWeekAction();
  }, [goToPreviousWeekAction]);
  const goToWeek = useCallback((targetWeekNumber, targetYear) => {
    const jan4 = new Date(targetYear, 0, 4);
    const weeksToAdd = targetWeekNumber - getWeekNumber(jan4);
    const targetDate = addWeeks(jan4, weeksToAdd);
    calendar.setCurrentDate(targetDate);
  }, [calendar]);
  const generateWeekAtOffset = useCallback((offset) => {
    const targetDate = addWeeks(calendar.currentDate, offset);
    return generateWeekData(targetDate, calendar.weekConfig);
  }, [calendar.currentDate, calendar.weekConfig]);
  const getWeekKey = useCallback((offset) => {
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
    getWeekKey
  };
}
function isSameDay2(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}
function useTimelineLayout(events, date, config) {
  return useMemo(() => {
    const { startHour = 0, endHour = 24 } = config;
    const pixelsPerHour = 50;
    const dayEvents = events.filter((event) => {
      return isSameDay2(event.startDate, date) || event.startDate < date && event.endDate >= date;
    });
    if (dayEvents.length === 0) {
      return [];
    }
    const sorted = [...dayEvents].sort((a, b) => {
      const startDiff = a.startDate.getTime() - b.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      const durationA = a.endDate.getTime() - a.startDate.getTime();
      const durationB = b.endDate.getTime() - b.startDate.getTime();
      return durationB - durationA;
    });
    const eventToColumn = /* @__PURE__ */ new Map();
    const columns = [];
    for (const event of sorted) {
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        const hasConflict = columns[columnIndex].some(
          (existingEvent) => existingEvent.startDate < event.endDate && existingEvent.endDate > event.startDate
        );
        if (!hasConflict) {
          break;
        }
        columnIndex++;
      }
      if (columnIndex === columns.length) {
        columns.push([]);
      }
      columns[columnIndex].push(event);
      eventToColumn.set(event.id, columnIndex);
    }
    const layouts = [];
    for (const event of sorted) {
      const columnIndex = eventToColumn.get(event.id);
      const startMinutes = event.startDate.getHours() * 60 + event.startDate.getMinutes();
      const endMinutes = event.endDate.getHours() * 60 + event.endDate.getMinutes();
      const durationMinutes = endMinutes - startMinutes;
      const top = (startMinutes / 60 - startHour) * pixelsPerHour;
      const height = Math.max(30, durationMinutes / 60 * pixelsPerHour);
      const overlappingEvents = sorted.filter(
        (e) => e.startDate < event.endDate && e.endDate > event.startDate
      );
      const maxColumns = Math.max(...overlappingEvents.map((e) => {
        return eventToColumn.get(e.id) + 1;
      }));
      const totalColumns = Math.max(maxColumns, 1);
      layouts.push({
        event,
        top,
        height,
        left: columnIndex / totalColumns * 100,
        width: 1 / totalColumns * 100,
        columnIndex,
        totalColumns
      });
    }
    return layouts;
  }, [events, date, config]);
}
function isSameDay3(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}
function formatSectionTitle(date) {
  if (isToday$1(date)) {
    return `TODAY - ${format(date, "MMMM d, yyyy")}`;
  }
  if (isTomorrow(date)) {
    return `TOMORROW - ${format(date, "MMMM d, yyyy")}`;
  }
  if (isThisWeek(date, { weekStartsOn: 0 })) {
    return `${format(date, "EEEE")} - ${format(date, "MMMM d, yyyy")}`;
  }
  return format(date, "MMMM d, yyyy").toUpperCase();
}
function useAgendaGrouping(events, startDate, config) {
  return useMemo(() => {
    const {
      groupBy = "day",
      showEmptyDays = false,
      futureMonths = 3
    } = config;
    const endDate = addMonths$1(startDate, futureMonths);
    const allDates = [];
    let currentDate = startOfDay$1(startDate);
    const finalDate = endOfDay$1(endDate);
    while (currentDate <= finalDate) {
      allDates.push(currentDate);
      currentDate = addDays$1(currentDate, 1);
    }
    const sections = allDates.map((date) => {
      const dayEvents = events.filter((event) => {
        return isSameDay3(event.startDate, date) || event.startDate < date && event.endDate >= date;
      }).sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return a.startDate.getTime() - b.startDate.getTime();
      });
      return {
        title: formatSectionTitle(date),
        date,
        events: dayEvents
      };
    });
    const filtered = showEmptyDays ? sections : sections.filter((s) => s.events.length > 0);
    return filtered;
  }, [events, startDate, config]);
}
function EventDot({ color, size = 6 }) {
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles.dot,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2
        }
      ]
    }
  );
}
var styles = StyleSheet.create({
  dot: {
    marginHorizontal: 1
  }
});

// src/components/EventDots.tsx
function EventDots({ events, maxDots = 3, dotSize = 6 }) {
  if (events.length === 0) {
    return null;
  }
  const displayEvents = events.slice(0, maxDots);
  return /* @__PURE__ */ React17.createElement(View, { style: styles2.container }, displayEvents.map((event) => /* @__PURE__ */ React17.createElement(EventDot, { key: event.id, color: event.color, size: dotSize })));
}
var styles2 = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    minHeight: 8
  }
});

// src/components/primitives/DayCell.tsx
function DayCell({
  day,
  selected = false,
  disabled = false,
  onPress,
  onLongPress,
  theme,
  events = []
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };
  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const accessibilityLabel = `${day.calendarDate.day} ${monthNames[day.calendarDate.month - 1]} ${day.calendarDate.year}, ${dayNames[day.dayOfWeek]}`;
  return /* @__PURE__ */ React17.createElement(
    Animated.View,
    {
      style: [
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
      ]
    },
    /* @__PURE__ */ React17.createElement(
      Pressable,
      {
        testID: "day-cell",
        accessibilityRole: "button",
        accessibilityLabel,
        accessibilityState: { selected, disabled },
        accessibilityHint: !disabled ? "Double tap to select this date" : void 0,
        onPress: disabled ? void 0 : onPress,
        onLongPress: disabled ? void 0 : onLongPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        style: [
          styles3.cell,
          {
            width: theme.spacing.cellSize,
            height: theme.spacing.cellSize,
            borderRadius: theme.borderRadius.cell,
            backgroundColor: selected ? theme.colors.selected : "transparent",
            borderWidth: day.isToday && !selected ? 2 : 0,
            borderColor: day.isToday ? theme.colors.today : "transparent"
          }
        ]
      },
      /* @__PURE__ */ React17.createElement(View, { style: styles3.cellContent }, /* @__PURE__ */ React17.createElement(
        Text,
        {
          style: [
            styles3.text,
            {
              fontSize: theme.fontSize.day,
              fontWeight: theme.fontWeight.regular,
              color: disabled ? theme.colors.disabled : selected ? theme.colors.selectedForeground : day.isToday ? theme.colors.todayForeground : day.isWeekend ? theme.colors.weekend : theme.colors.foreground,
              opacity: !day.isCurrentMonth ? 0.4 : 1
            }
          ]
        },
        day.calendarDate.day
      ), events.length > 0 && /* @__PURE__ */ React17.createElement(EventDots, { events, maxDots: 3 }))
    )
  );
}
var styles3 = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center"
  },
  cellContent: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center"
  }
});
function NavigationButton({
  direction,
  onPress,
  theme,
  disabled = false
}) {
  const arrow = direction === "left" ? "\u25C0" : "\u25B6";
  const label = direction === "left" ? "Previous" : "Next";
  return /* @__PURE__ */ React17.createElement(
    Pressable,
    {
      accessibilityRole: "button",
      accessibilityLabel: label,
      onPress: disabled ? void 0 : onPress,
      disabled,
      style: [
        styles4.button,
        {
          opacity: disabled ? 0.3 : 1
        }
      ]
    },
    /* @__PURE__ */ React17.createElement(
      Text,
      {
        style: [
          styles4.arrow,
          {
            color: theme.colors.primary,
            fontSize: theme.fontSize.header
          }
        ]
      },
      arrow
    )
  );
}
var styles4 = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44
  },
  arrow: {
    fontWeight: "600"
  }
});

// src/components/Calendar/CalendarHeader.tsx
function CalendarHeader({
  year,
  month,
  weekNumber,
  onPrevious,
  onNext,
  onToday,
  theme
}) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const displayText = month !== void 0 ? `${monthNames[month - 1]} ${year}` : weekNumber !== void 0 ? `Week ${weekNumber}, ${year}` : `${year}`;
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      accessibilityRole: "header",
      style: [
        styles5.header,
        {
          marginBottom: theme.spacing.headerSpacing
        }
      ]
    },
    /* @__PURE__ */ React17.createElement(
      NavigationButton,
      {
        direction: "left",
        onPress: onPrevious,
        theme
      }
    ),
    /* @__PURE__ */ React17.createElement(
      Text,
      {
        style: [
          styles5.title,
          {
            fontSize: theme.fontSize.header,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.foreground
          }
        ]
      },
      displayText
    ),
    /* @__PURE__ */ React17.createElement(
      NavigationButton,
      {
        direction: "right",
        onPress: onNext,
        theme
      }
    )
  );
}
var styles5 = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    flex: 1,
    textAlign: "center"
  }
});
function CalendarWeekDays({ weekStartsOn, theme }) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const orderedDays = weekStartsOn === 1 ? [...dayNames.slice(1), dayNames[0]] : dayNames;
  return /* @__PURE__ */ React17.createElement(View, { style: styles6.container }, orderedDays.map((day) => /* @__PURE__ */ React17.createElement(
    View,
    {
      key: day,
      style: [
        styles6.dayCell,
        {
          width: theme.spacing.cellSize
        }
      ]
    },
    /* @__PURE__ */ React17.createElement(
      Text,
      {
        style: [
          styles6.dayText,
          {
            fontSize: theme.fontSize.weekday,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.foreground,
            opacity: 0.6
          }
        ]
      },
      day
    )
  )));
}
var styles6 = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8
  },
  dayCell: {
    justifyContent: "center",
    alignItems: "center"
  },
  dayText: {
    textAlign: "center"
  }
});
function CalendarDays({
  monthData,
  selected,
  onSelectDate,
  renderDay,
  minDate,
  maxDate,
  disabledDates = [],
  disabled = false,
  theme,
  events = []
}) {
  const isDateDisabled = (date) => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disabledDates.some((d) => isSameDay(d, date))) return true;
    return false;
  };
  const isDateSelected = (date) => {
    if (!selected) return false;
    return isSameDay(date, selected);
  };
  const getEventsForDate = (date) => {
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nextDay = new Date(targetDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart < nextDay && eventEnd >= targetDay;
    });
  };
  return /* @__PURE__ */ React17.createElement(View, { style: styles7.container }, monthData.weeks.map((week, weekIndex) => /* @__PURE__ */ React17.createElement(View, { key: weekIndex, style: styles7.week }, week.days.map((day, dayIndex) => {
    const isSelected = isDateSelected(day.date);
    const isDisabled = isDateDisabled(day.date);
    const dayEvents = getEventsForDate(day.date);
    if (renderDay) {
      return /* @__PURE__ */ React17.createElement(View, { key: dayIndex, style: { width: theme.spacing.cellSize } }, renderDay(day));
    }
    return /* @__PURE__ */ React17.createElement(
      DayCell,
      {
        key: dayIndex,
        day,
        selected: isSelected,
        disabled: isDisabled,
        onPress: () => !isDisabled && onSelectDate?.(day.date),
        theme,
        events: dayEvents
      }
    );
  }))));
}
var styles7 = StyleSheet.create({
  container: {
    gap: 0
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

// src/components/theme/themes.ts
var lightTheme = {
  colors: {
    background: "#FFFFFF",
    foreground: "#000000",
    border: "#E5E5E5",
    primary: "#007AFF",
    primaryForeground: "#FFFFFF",
    selected: "#007AFF",
    selectedForeground: "#FFFFFF",
    today: "#007AFF",
    todayForeground: "#007AFF",
    disabled: "#D1D1D6",
    weekend: "#8E8E93",
    overflow: "#C7C7CC",
    hover: "#F2F2F7",
    pressed: "#E5E5EA"
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12
  },
  borderRadius: {
    cell: 24,
    container: 12
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20
  },
  fontWeight: {
    regular: "400",
    bold: "600"
  }
};
var darkTheme = {
  colors: {
    background: "#1C1C1E",
    foreground: "#FFFFFF",
    border: "#38383A",
    primary: "#0A84FF",
    primaryForeground: "#FFFFFF",
    selected: "#0A84FF",
    selectedForeground: "#FFFFFF",
    today: "#0A84FF",
    todayForeground: "#0A84FF",
    disabled: "#48484A",
    weekend: "#8E8E93",
    overflow: "#636366",
    hover: "#2C2C2E",
    pressed: "#3A3A3C"
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12
  },
  borderRadius: {
    cell: 24,
    container: 12
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20
  },
  fontWeight: {
    regular: "400",
    bold: "600"
  }
};
var oceanTheme = {
  colors: {
    background: "#F0F9FF",
    foreground: "#0C4A6E",
    border: "#BAE6FD",
    primary: "#0284C7",
    primaryForeground: "#FFFFFF",
    selected: "#0284C7",
    selectedForeground: "#FFFFFF",
    today: "#0EA5E9",
    todayForeground: "#0EA5E9",
    disabled: "#CBD5E1",
    weekend: "#64748B",
    overflow: "#94A3B8",
    hover: "#E0F2FE",
    pressed: "#BAE6FD"
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12
  },
  borderRadius: {
    cell: 24,
    container: 12
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20
  },
  fontWeight: {
    regular: "400",
    bold: "600"
  }
};
var forestTheme = {
  colors: {
    background: "#F0FDF4",
    foreground: "#14532D",
    border: "#BBF7D0",
    primary: "#16A34A",
    primaryForeground: "#FFFFFF",
    selected: "#16A34A",
    selectedForeground: "#FFFFFF",
    today: "#22C55E",
    todayForeground: "#22C55E",
    disabled: "#D1D5DB",
    weekend: "#6B7280",
    overflow: "#9CA3AF",
    hover: "#DCFCE7",
    pressed: "#BBF7D0"
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12
  },
  borderRadius: {
    cell: 24,
    container: 12
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20
  },
  fontWeight: {
    regular: "400",
    bold: "600"
  }
};
var sunsetTheme = {
  colors: {
    background: "#FFF7ED",
    foreground: "#7C2D12",
    border: "#FED7AA",
    primary: "#EA580C",
    primaryForeground: "#FFFFFF",
    selected: "#EA580C",
    selectedForeground: "#FFFFFF",
    today: "#F97316",
    todayForeground: "#F97316",
    disabled: "#D1D5DB",
    weekend: "#78716C",
    overflow: "#A8A29E",
    hover: "#FFEDD5",
    pressed: "#FED7AA"
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12
  },
  borderRadius: {
    cell: 24,
    container: 12
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20
  },
  fontWeight: {
    regular: "400",
    bold: "600"
  }
};
var minimalTheme = {
  colors: {
    background: "#FFFFFF",
    foreground: "#000000",
    border: "#000000",
    primary: "#000000",
    primaryForeground: "#FFFFFF",
    selected: "#000000",
    selectedForeground: "#FFFFFF",
    today: "#000000",
    todayForeground: "#000000",
    disabled: "#A3A3A3",
    weekend: "#525252",
    overflow: "#737373",
    hover: "#F5F5F5",
    pressed: "#E5E5E5"
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12
  },
  borderRadius: {
    cell: 24,
    container: 12
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20
  },
  fontWeight: {
    regular: "400",
    bold: "700"
  }
};
var themes = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  minimal: minimalTheme
};

// src/components/theme/ThemeProvider.tsx
var ThemeContext = createContext(null);
function ThemeProvider({ theme, children }) {
  const resolvedTheme = typeof theme === "string" ? themes[theme] : theme;
  return /* @__PURE__ */ React17.createElement(ThemeContext.Provider, { value: resolvedTheme }, children);
}
function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    return themes.light;
  }
  return theme;
}

// src/components/Calendar/CalendarMonth.tsx
function CalendarMonth({
  value,
  onChange,
  defaultValue,
  selected,
  onSelect,
  defaultSelected,
  weekStartsOn = 0,
  theme: themeProp,
  minDate,
  maxDate,
  disabledDates,
  disabled,
  renderDay,
  onMonthChange,
  style,
  events = []
}) {
  const contextTheme = useTheme();
  const resolvedTheme = themeProp ? typeof themeProp === "string" ? themes[themeProp] : themeProp : contextTheme;
  const [internalValue, setInternalValue] = useState(
    value || defaultValue || /* @__PURE__ */ new Date()
  );
  const currentValue = value !== void 0 ? value : internalValue;
  const [internalSelected, setInternalSelected] = useState(
    selected || defaultSelected
  );
  const currentSelected = selected !== void 0 ? selected : internalSelected;
  const calendar = useMonthCalendar({
    initialDate: currentValue,
    weekStartsOn,
    onMonthChange
  });
  useEffect(() => {
    if (value) {
      calendar.setCurrentDate(value);
    }
  }, [value]);
  const handlePrevious = () => {
    calendar.goToPreviousMonth();
    if (onChange) {
      onChange(calendar.currentDate);
    } else {
      setInternalValue(calendar.currentDate);
    }
  };
  const handleNext = () => {
    calendar.goToNextMonth();
    if (onChange) {
      onChange(calendar.currentDate);
    } else {
      setInternalValue(calendar.currentDate);
    }
  };
  const handleSelectDate = (date) => {
    if (onSelect) {
      onSelect(date);
    } else {
      setInternalSelected(date);
    }
  };
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles8.container,
        {
          padding: resolvedTheme.spacing.padding,
          backgroundColor: resolvedTheme.colors.background,
          borderRadius: resolvedTheme.borderRadius.container
        },
        style
      ]
    },
    /* @__PURE__ */ React17.createElement(
      CalendarHeader,
      {
        year: calendar.year,
        month: calendar.month,
        onPrevious: handlePrevious,
        onNext: handleNext,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React17.createElement(
      CalendarWeekDays,
      {
        weekStartsOn,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React17.createElement(
      CalendarDays,
      {
        monthData: calendar.monthData,
        selected: currentSelected,
        onSelectDate: handleSelectDate,
        renderDay,
        minDate,
        maxDate,
        disabledDates,
        disabled,
        theme: resolvedTheme,
        events
      }
    )
  );
}
var styles8 = StyleSheet.create({
  container: {
    // padding and backgroundColor set by theme
  }
});
function CalendarWeek({
  value,
  onChange,
  defaultValue,
  selected,
  onSelect,
  defaultSelected,
  weekStartsOn = 0,
  theme: themeProp,
  showWeekNumber = false,
  renderDay,
  onWeekChange,
  style
}) {
  const contextTheme = useTheme();
  const resolvedTheme = themeProp ? typeof themeProp === "string" ? themes[themeProp] : themeProp : contextTheme;
  const [internalValue, setInternalValue] = useState(
    value || defaultValue || /* @__PURE__ */ new Date()
  );
  const currentValue = value !== void 0 ? value : internalValue;
  const [internalSelected, setInternalSelected] = useState(
    selected || defaultSelected
  );
  const currentSelected = selected !== void 0 ? selected : internalSelected;
  const calendar = useWeekCalendar({
    initialDate: currentValue,
    weekStartsOn,
    onWeekChange
  });
  useEffect(() => {
    if (value) {
      calendar.setCurrentDate(value);
    }
  }, [value]);
  const handlePrevious = () => {
    calendar.goToPreviousWeek();
    if (onChange) {
      onChange(calendar.currentDate);
    } else {
      setInternalValue(calendar.currentDate);
    }
  };
  const handleNext = () => {
    calendar.goToNextWeek();
    if (onChange) {
      onChange(calendar.currentDate);
    } else {
      setInternalValue(calendar.currentDate);
    }
  };
  const handleSelectDate = (date) => {
    if (onSelect) {
      onSelect(date);
    } else {
      setInternalSelected(date);
    }
  };
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles9.container,
        {
          padding: resolvedTheme.spacing.padding,
          backgroundColor: resolvedTheme.colors.background,
          borderRadius: resolvedTheme.borderRadius.container
        },
        style
      ]
    },
    /* @__PURE__ */ React17.createElement(
      CalendarHeader,
      {
        year: calendar.year,
        weekNumber: showWeekNumber ? calendar.weekNumber : void 0,
        onPrevious: handlePrevious,
        onNext: handleNext,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React17.createElement(
      CalendarWeekDays,
      {
        weekStartsOn,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React17.createElement(View, { style: styles9.week }, calendar.weekData.days.map((day, index) => {
      const isSelected = currentSelected ? isSameDay(day.date, currentSelected) : false;
      if (renderDay) {
        return /* @__PURE__ */ React17.createElement(View, { key: index, style: { width: resolvedTheme.spacing.cellSize } }, renderDay(day));
      }
      return /* @__PURE__ */ React17.createElement(
        DayCell,
        {
          key: index,
          day,
          selected: isSelected,
          onPress: () => handleSelectDate(day.date),
          theme: resolvedTheme
        }
      );
    }))
  );
}
var styles9 = StyleSheet.create({
  container: {
    // styled by theme
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
function CalendarDay({
  value,
  onChange,
  defaultValue,
  theme: themeProp,
  style
}) {
  const contextTheme = useTheme();
  const resolvedTheme = themeProp ? typeof themeProp === "string" ? themes[themeProp] : themeProp : contextTheme;
  const [internalValue, setInternalValue] = useState(
    value || defaultValue || /* @__PURE__ */ new Date()
  );
  const currentValue = value !== void 0 ? value : internalValue;
  const calendar = useCalendar({
    initialDate: currentValue
  });
  useEffect(() => {
    if (value) {
      calendar.setCurrentDate(value);
    }
  }, [value]);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = calendar.currentDate;
  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const dayNumber = date.getDate();
  const year = date.getFullYear();
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles10.container,
        {
          padding: resolvedTheme.spacing.padding,
          backgroundColor: resolvedTheme.colors.background,
          borderRadius: resolvedTheme.borderRadius.container
        },
        style
      ]
    },
    /* @__PURE__ */ React17.createElement(
      Text,
      {
        style: [
          styles10.dayName,
          {
            fontSize: resolvedTheme.fontSize.weekday,
            fontWeight: resolvedTheme.fontWeight.regular,
            color: resolvedTheme.colors.foreground,
            opacity: 0.6
          }
        ]
      },
      dayName
    ),
    /* @__PURE__ */ React17.createElement(
      Text,
      {
        style: [
          styles10.dayNumber,
          {
            fontSize: 48,
            fontWeight: resolvedTheme.fontWeight.bold,
            color: resolvedTheme.colors.primary
          }
        ]
      },
      dayNumber
    ),
    /* @__PURE__ */ React17.createElement(
      Text,
      {
        style: [
          styles10.monthYear,
          {
            fontSize: resolvedTheme.fontSize.header,
            fontWeight: resolvedTheme.fontWeight.regular,
            color: resolvedTheme.colors.foreground
          }
        ]
      },
      monthName,
      " ",
      year
    )
  );
}
var styles10 = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200
  },
  dayName: {
    marginBottom: 8
  },
  dayNumber: {
    marginBottom: 8
  },
  monthYear: {
    // fontSize set by theme
  }
});
function TimelineGrid({
  startHour,
  endHour,
  slotDuration,
  businessHours = { start: 9, end: 17 },
  theme
}) {
  const hours = [];
  for (let hour = startHour; hour < endHour; hour++) {
    hours.push(hour);
  }
  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };
  const isBusinessHour = (hour) => {
    return hour >= businessHours.start && hour < businessHours.end;
  };
  return /* @__PURE__ */ React17.createElement(View, { style: styles11.container }, hours.map((hour) => /* @__PURE__ */ React17.createElement(View, { key: hour, style: styles11.hourSlot }, /* @__PURE__ */ React17.createElement(View, { style: styles11.timeLabel }, /* @__PURE__ */ React17.createElement(
    Text,
    {
      style: [styles11.timeLabelText, { color: theme.colors.foreground }],
      accessibilityRole: "text"
    },
    formatHour(hour)
  )), /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles11.hourLine,
        {
          backgroundColor: isBusinessHour(hour) ? "rgba(0, 122, 255, 0.05)" : theme.colors.background,
          borderTopColor: theme.colors.border || "#E0E0E0"
        }
      ]
    },
    slotDuration === 30 && /* @__PURE__ */ React17.createElement(
      View,
      {
        style: [
          styles11.halfHourLine,
          { borderTopColor: "#F0F0F0" }
        ]
      }
    )
  ))));
}
var styles11 = StyleSheet.create({
  container: {
    flex: 1
  },
  hourSlot: {
    height: 50,
    // 50px per hour
    flexDirection: "row"
  },
  timeLabel: {
    width: 60,
    paddingRight: 8,
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  timeLabelText: {
    fontSize: 12,
    fontWeight: "500"
  },
  hourLine: {
    flex: 1,
    borderTopWidth: 1
  },
  halfHourLine: {
    position: "absolute",
    top: 25,
    // Halfway through 50px slot
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: "dashed"
  }
});
function TimelineEvent({
  layout,
  onPress,
  onLongPress,
  theme
}) {
  const { event, top, height, left, width } = layout;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };
  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const showDetails = height >= 40;
  const showDescription = height >= 60;
  const accessibilityLabel = `${event.title}, ${formatTime(event.startDate)} to ${formatTime(event.endDate)}${event.category ? `, ${event.category} category` : ""}`;
  return /* @__PURE__ */ React17.createElement(
    Animated.View,
    {
      style: [
        styles12.container,
        {
          position: "absolute",
          top,
          height: Math.max(30, height),
          left: `${left}%`,
          width: `${width}%`,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim
        }
      ]
    },
    /* @__PURE__ */ React17.createElement(
      Pressable,
      {
        onPress: () => onPress?.(event),
        onLongPress: () => onLongPress?.(event),
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        style: [
          styles12.eventCard,
          {
            backgroundColor: event.color,
            borderLeftColor: event.color
          }
        ],
        accessibilityRole: "button",
        accessibilityLabel,
        accessibilityHint: "Double tap to view event details"
      },
      /* @__PURE__ */ React17.createElement(Text, { style: styles12.title, numberOfLines: 1 }, event.title),
      showDetails && /* @__PURE__ */ React17.createElement(Text, { style: styles12.time, numberOfLines: 1 }, formatTime(event.startDate), " - ", formatTime(event.endDate)),
      showDescription && event.description && /* @__PURE__ */ React17.createElement(Text, { style: styles12.description, numberOfLines: 2 }, event.description)
    )
  );
}
var styles12 = StyleSheet.create({
  container: {
    paddingHorizontal: 2
  },
  eventCard: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 4,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF"
  },
  time: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2
  },
  description: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2
  }
});
function CurrentTimeLine({ startHour, showToday }) {
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const topAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!showToday) return;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    const interval = setInterval(() => {
      const now = /* @__PURE__ */ new Date();
      const newMinutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(newMinutes);
    }, 6e4);
    return () => clearInterval(interval);
  }, [showToday, fadeAnim]);
  useEffect(() => {
    const pixelsPerMinute = 50 / 60;
    const top = (currentMinutes - startHour * 60) * pixelsPerMinute;
    Animated.timing(topAnim, {
      toValue: top,
      duration: 500,
      useNativeDriver: false
      // Can't use native driver for top
    }).start();
  }, [currentMinutes, startHour, topAnim]);
  if (!showToday) return null;
  return /* @__PURE__ */ React17.createElement(
    Animated.View,
    {
      style: [
        styles13.container,
        {
          opacity: fadeAnim,
          top: topAnim
        }
      ],
      accessibilityLabel: `Current time: ${Math.floor(currentMinutes / 60)}:${(currentMinutes % 60).toString().padStart(2, "0")}`
    },
    /* @__PURE__ */ React17.createElement(View, { style: styles13.dot }),
    /* @__PURE__ */ React17.createElement(View, { style: styles13.line })
  );
}
var styles13 = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    flexDirection: "row",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 100
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    marginLeft: 56
    // After time label gutter
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#FF3B30"
  }
});

// src/components/Calendar/CalendarTimeline.tsx
function CalendarTimeline({
  value,
  onChange,
  events = [],
  timelineConfig = {},
  theme: themeProp,
  onEventPress,
  onEventLongPress,
  style
}) {
  const [internalValue, setInternalValue] = useState(value || /* @__PURE__ */ new Date());
  const currentValue = value !== void 0 ? value : internalValue;
  const scrollViewRef = useRef(null);
  const contextTheme = useTheme();
  const resolvedTheme = themeProp ? typeof themeProp === "string" ? themes[themeProp] : themeProp : contextTheme;
  const config = {
    startHour: timelineConfig.startHour ?? 0,
    endHour: timelineConfig.endHour ?? 24,
    slotDuration: timelineConfig.slotDuration ?? 30,
    showCurrentTime: timelineConfig.showCurrentTime ?? true,
    businessHours: timelineConfig.businessHours ?? { start: 9, end: 17 },
    scrollToNow: timelineConfig.scrollToNow ?? true
  };
  const layouts = useTimelineLayout(events, currentValue, config);
  const isToday3 = (date) => {
    const today = /* @__PURE__ */ new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  };
  const showCurrentTime = config.showCurrentTime && isToday3(currentValue);
  useEffect(() => {
    if (config.scrollToNow && isToday3(currentValue) && scrollViewRef.current) {
      const now = /* @__PURE__ */ new Date();
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
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles14.container,
        {
          backgroundColor: resolvedTheme.colors.background,
          padding: resolvedTheme.spacing.padding
        },
        style
      ]
    },
    /* @__PURE__ */ React17.createElement(
      CalendarHeader,
      {
        year: currentValue.getFullYear(),
        month: currentValue.getMonth(),
        onPrevious: handlePrevious,
        onNext: handleNext,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React17.createElement(
      ScrollView,
      {
        ref: scrollViewRef,
        style: styles14.scrollView,
        showsVerticalScrollIndicator: true,
        removeClippedSubviews: true
      },
      /* @__PURE__ */ React17.createElement(View, { style: { height: totalHeight } }, /* @__PURE__ */ React17.createElement(
        TimelineGrid,
        {
          startHour: config.startHour,
          endHour: config.endHour,
          slotDuration: config.slotDuration,
          businessHours: config.businessHours,
          theme: resolvedTheme
        }
      ), layouts.map((layout) => /* @__PURE__ */ React17.createElement(
        TimelineEvent,
        {
          key: layout.event.id,
          layout,
          onPress: onEventPress,
          onLongPress: onEventLongPress,
          theme: resolvedTheme
        }
      )), showCurrentTime && /* @__PURE__ */ React17.createElement(
        CurrentTimeLine,
        {
          startHour: config.startHour,
          showToday: true
        }
      ))
    )
  );
}
var styles14 = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});
function AgendaSectionHeader({
  title,
  eventCount,
  theme
}) {
  const accessibilityLabel = `Section, ${title}, ${eventCount} event${eventCount !== 1 ? "s" : ""}`;
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles15.container,
        { backgroundColor: "#F5F5F5" }
      ],
      accessibilityRole: "header",
      accessibilityLabel
    },
    /* @__PURE__ */ React17.createElement(Text, { style: [styles15.title, { color: theme.colors.foreground }] }, title),
    /* @__PURE__ */ React17.createElement(Text, { style: styles15.count }, eventCount, " event", eventCount !== 1 ? "s" : "")
  );
}
var styles15 = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  count: {
    fontSize: 12,
    color: "#666",
    marginTop: 2
  }
});
function AgendaEvent({
  event,
  onPress,
  onLongPress,
  theme
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false
      })
    ]).start();
  };
  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      })
    ]).start();
  };
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const timeDisplay = event.isAllDay ? "All Day" : `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
  const accessibilityLabel = `${event.title}, ${timeDisplay}${event.description ? `, ${event.description}` : ""}${event.category ? `, ${event.category} category` : ""}`;
  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF", "#F5F5F5"]
  });
  return /* @__PURE__ */ React17.createElement(
    Animated.View,
    {
      style: [
        {
          transform: [{ scale: scaleAnim }]
        }
      ]
    },
    /* @__PURE__ */ React17.createElement(
      Pressable,
      {
        onPress: () => onPress?.(event),
        onLongPress: () => onLongPress?.(event),
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        style: styles16.container,
        accessibilityRole: "button",
        accessibilityLabel,
        accessibilityHint: "Double tap to view event details"
      },
      /* @__PURE__ */ React17.createElement(
        Animated.View,
        {
          style: [
            styles16.card,
            { backgroundColor }
          ]
        },
        /* @__PURE__ */ React17.createElement(View, { style: styles16.leftSection }, /* @__PURE__ */ React17.createElement(
          View,
          {
            style: [
              styles16.colorDot,
              { backgroundColor: event.color }
            ]
          }
        ), /* @__PURE__ */ React17.createElement(View, { style: styles16.content }, /* @__PURE__ */ React17.createElement(Text, { style: styles16.time }, timeDisplay), /* @__PURE__ */ React17.createElement(Text, { style: styles16.title, numberOfLines: 1 }, event.title), event.description && /* @__PURE__ */ React17.createElement(Text, { style: styles16.description, numberOfLines: 2 }, event.description), event.category && /* @__PURE__ */ React17.createElement(
          View,
          {
            style: [
              styles16.categoryBadge,
              { backgroundColor: `${event.color}20` }
            ]
          },
          /* @__PURE__ */ React17.createElement(Text, { style: [styles16.categoryText, { color: event.color }] }, event.category)
        )))
      )
    )
  );
}
var styles16 = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  card: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0"
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12
  },
  content: {
    flex: 1
  },
  time: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600"
  }
});

// src/components/Calendar/CalendarAgenda.tsx
function CalendarAgenda({
  value,
  onChange,
  events = [],
  agendaConfig = {},
  theme: themeProp,
  onEventPress,
  onEventLongPress,
  style
}) {
  const [internalValue, setInternalValue] = useState(value || /* @__PURE__ */ new Date());
  const currentValue = value !== void 0 ? value : internalValue;
  const [loadedMonths, setLoadedMonths] = useState(agendaConfig.futureMonths || 3);
  const contextTheme = useTheme();
  const resolvedTheme = themeProp ? typeof themeProp === "string" ? themes[themeProp] : themeProp : contextTheme;
  const config = {
    groupBy: agendaConfig.groupBy || "day",
    showEmptyDays: agendaConfig.showEmptyDays || false,
    futureMonths: loadedMonths,
    dateFormat: agendaConfig.dateFormat
  };
  const sections = useAgendaGrouping(events, currentValue, config);
  const flatListData = [];
  sections.forEach((section) => {
    flatListData.push({ type: "header", section });
    section.events.forEach((event) => {
      flatListData.push({ type: "event", event, sectionDate: section.date });
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
  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return /* @__PURE__ */ React17.createElement(
        AgendaSectionHeader,
        {
          title: item.section.title,
          eventCount: item.section.events.length,
          theme: resolvedTheme
        }
      );
    }
    return /* @__PURE__ */ React17.createElement(
      AgendaEvent,
      {
        event: item.event,
        onPress: onEventPress,
        onLongPress: onEventLongPress,
        theme: resolvedTheme
      }
    );
  };
  const renderFooter = () => {
    return /* @__PURE__ */ React17.createElement(View, { style: styles17.footer }, /* @__PURE__ */ React17.createElement(ActivityIndicator, { size: "small", color: resolvedTheme.colors.primary }));
  };
  return /* @__PURE__ */ React17.createElement(
    View,
    {
      style: [
        styles17.container,
        {
          backgroundColor: resolvedTheme.colors.background
        },
        style
      ]
    },
    /* @__PURE__ */ React17.createElement(View, { style: { padding: resolvedTheme.spacing.padding } }, /* @__PURE__ */ React17.createElement(
      CalendarHeader,
      {
        year: currentValue.getFullYear(),
        month: currentValue.getMonth(),
        onPrevious: handlePrevious,
        onNext: handleNext,
        theme: resolvedTheme
      }
    )),
    /* @__PURE__ */ React17.createElement(
      FlatList,
      {
        data: flatListData,
        renderItem,
        keyExtractor: (item, index) => item.type === "header" ? `header-${item.section.date.getTime()}` : `event-${item.event.id}-${index}`,
        onEndReached: handleLoadMore,
        onEndReachedThreshold: 0.5,
        ListFooterComponent: renderFooter,
        showsVerticalScrollIndicator: true,
        maxToRenderPerBatch: 10,
        windowSize: 5,
        initialNumToRender: 15,
        removeClippedSubviews: true
      }
    )
  );
}
var styles17 = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    padding: 20,
    alignItems: "center"
  }
});

// src/components/Calendar/Calendar.tsx
function Calendar(props) {
  const { mode = "month", showWeekNumbers, ...rest } = props;
  if (mode === "month") {
    return /* @__PURE__ */ React17.createElement(CalendarMonth, { ...rest });
  }
  if (mode === "week") {
    return /* @__PURE__ */ React17.createElement(CalendarWeek, { ...rest, showWeekNumber: showWeekNumbers });
  }
  if (mode === "day") {
    return /* @__PURE__ */ React17.createElement(CalendarDay, { ...rest });
  }
  if (mode === "timeline") {
    return /* @__PURE__ */ React17.createElement(CalendarTimeline, { ...rest });
  }
  if (mode === "agenda") {
    return /* @__PURE__ */ React17.createElement(CalendarAgenda, { ...rest });
  }
  return /* @__PURE__ */ React17.createElement(CalendarMonth, { ...rest });
}
Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.Day = CalendarDay;
Calendar.Timeline = CalendarTimeline;
Calendar.Agenda = CalendarAgenda;
Calendar.Header = CalendarHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.Days = CalendarDays;
var generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
var useEventStore = create()(
  immer((set, get) => ({
    events: [],
    addEvent: (input) => {
      const now = /* @__PURE__ */ new Date();
      const event = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      };
      set((state) => {
        state.events.push(event);
      });
      return event;
    },
    updateEvent: (id, input) => {
      set((state) => {
        const event = state.events.find((e) => e.id === id);
        if (event) {
          Object.assign(event, input);
          event.updatedAt = /* @__PURE__ */ new Date();
        }
      });
    },
    deleteEvent: (id) => {
      set((state) => {
        state.events = state.events.filter((e) => e.id !== id);
      });
    },
    getEventById: (id) => {
      return get().events.find((e) => e.id === id);
    },
    getEventsByDate: (date) => {
      const events = get().events;
      const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const nextDay = new Date(targetDay);
      nextDay.setDate(nextDay.getDate() + 1);
      return events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return eventStart < nextDay && eventEnd >= targetDay;
      });
    },
    getEventsByRange: (start, end) => {
      const events = get().events;
      return events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return eventStart < end && eventEnd >= start;
      });
    }
  }))
);

export { Calendar, CalendarAgenda, CalendarTimeline, DayCell, EventDot, EventDots, NavigationButton, ThemeProvider, addDays, addMonths, addWeeks, createCalendarStore, endOfDay, endOfMonth, endOfWeek, fromCalendarDate, generateMonthData, generateWeekData, getDayOfWeek, getDaysInMonth, getWeekNumber, isSameDay, isSameMonth, isSameWeek, isToday, isWeekend, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, themes, toCalendarDate, useCalendar, useEventStore, useMonthCalendar, useTheme, useWeekCalendar };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map