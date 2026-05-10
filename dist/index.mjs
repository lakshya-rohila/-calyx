import React8, { createContext, useEffect, useCallback, useMemo, useRef, useContext, useState } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { addWeeks as addWeeks$1, addMonths as addMonths$1, isSameDay as isSameDay$1, isToday as isToday$1, isWeekend as isWeekend$1, isSameMonth as isSameMonth$1, isSameWeek as isSameWeek$1, addDays as addDays$1, startOfMonth as startOfMonth$1, endOfMonth as endOfMonth$1, startOfWeek as startOfWeek$1, endOfWeek as endOfWeek$1, startOfDay as startOfDay$1, endOfDay as endOfDay$1, getDaysInMonth as getDaysInMonth$1, getISOWeek, getDay } from 'date-fns';
import { StyleSheet, Animated, Pressable, Text, View } from 'react-native';

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
function DayCell({
  day,
  selected = false,
  disabled = false,
  onPress,
  onLongPress,
  theme
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
  return /* @__PURE__ */ React8.createElement(
    Animated.View,
    {
      style: [
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
      ]
    },
    /* @__PURE__ */ React8.createElement(
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
          styles.cell,
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
      /* @__PURE__ */ React8.createElement(
        Text,
        {
          style: [
            styles.text,
            {
              fontSize: theme.fontSize.day,
              fontWeight: theme.fontWeight.regular,
              color: disabled ? theme.colors.disabled : selected ? theme.colors.selectedForeground : day.isToday ? theme.colors.todayForeground : day.isWeekend ? theme.colors.weekend : theme.colors.foreground,
              opacity: !day.isCurrentMonth ? 0.4 : 1
            }
          ]
        },
        day.calendarDate.day
      )
    )
  );
}
var styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center"
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
  return /* @__PURE__ */ React8.createElement(
    Pressable,
    {
      accessibilityRole: "button",
      accessibilityLabel: label,
      onPress: disabled ? void 0 : onPress,
      disabled,
      style: [
        styles2.button,
        {
          opacity: disabled ? 0.3 : 1
        }
      ]
    },
    /* @__PURE__ */ React8.createElement(
      Text,
      {
        style: [
          styles2.arrow,
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
var styles2 = StyleSheet.create({
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
  return /* @__PURE__ */ React8.createElement(
    View,
    {
      accessibilityRole: "header",
      style: [
        styles3.header,
        {
          marginBottom: theme.spacing.headerSpacing
        }
      ]
    },
    /* @__PURE__ */ React8.createElement(
      NavigationButton,
      {
        direction: "left",
        onPress: onPrevious,
        theme
      }
    ),
    /* @__PURE__ */ React8.createElement(
      Text,
      {
        style: [
          styles3.title,
          {
            fontSize: theme.fontSize.header,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.foreground
          }
        ]
      },
      displayText
    ),
    /* @__PURE__ */ React8.createElement(
      NavigationButton,
      {
        direction: "right",
        onPress: onNext,
        theme
      }
    )
  );
}
var styles3 = StyleSheet.create({
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
  return /* @__PURE__ */ React8.createElement(View, { style: styles4.container }, orderedDays.map((day) => /* @__PURE__ */ React8.createElement(
    View,
    {
      key: day,
      style: [
        styles4.dayCell,
        {
          width: theme.spacing.cellSize
        }
      ]
    },
    /* @__PURE__ */ React8.createElement(
      Text,
      {
        style: [
          styles4.dayText,
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
var styles4 = StyleSheet.create({
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
  theme
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
  return /* @__PURE__ */ React8.createElement(View, { style: styles5.container }, monthData.weeks.map((week, weekIndex) => /* @__PURE__ */ React8.createElement(View, { key: weekIndex, style: styles5.week }, week.days.map((day, dayIndex) => {
    const isSelected = isDateSelected(day.date);
    const isDisabled = isDateDisabled(day.date);
    if (renderDay) {
      return /* @__PURE__ */ React8.createElement(View, { key: dayIndex, style: { width: theme.spacing.cellSize } }, renderDay(day));
    }
    return /* @__PURE__ */ React8.createElement(
      DayCell,
      {
        key: dayIndex,
        day,
        selected: isSelected,
        disabled: isDisabled,
        onPress: () => !isDisabled && onSelectDate?.(day.date),
        theme
      }
    );
  }))));
}
var styles5 = StyleSheet.create({
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
  return /* @__PURE__ */ React8.createElement(ThemeContext.Provider, { value: resolvedTheme }, children);
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
  return /* @__PURE__ */ React8.createElement(
    View,
    {
      style: [
        styles6.container,
        {
          padding: resolvedTheme.spacing.padding,
          backgroundColor: resolvedTheme.colors.background,
          borderRadius: resolvedTheme.borderRadius.container
        },
        style
      ]
    },
    /* @__PURE__ */ React8.createElement(
      CalendarHeader,
      {
        year: calendar.year,
        month: calendar.month,
        onPrevious: handlePrevious,
        onNext: handleNext,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React8.createElement(
      CalendarWeekDays,
      {
        weekStartsOn,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React8.createElement(
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
        theme: resolvedTheme
      }
    )
  );
}
var styles6 = StyleSheet.create({
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
  return /* @__PURE__ */ React8.createElement(
    View,
    {
      style: [
        styles7.container,
        {
          padding: resolvedTheme.spacing.padding,
          backgroundColor: resolvedTheme.colors.background,
          borderRadius: resolvedTheme.borderRadius.container
        },
        style
      ]
    },
    /* @__PURE__ */ React8.createElement(
      CalendarHeader,
      {
        year: calendar.year,
        weekNumber: showWeekNumber ? calendar.weekNumber : void 0,
        onPrevious: handlePrevious,
        onNext: handleNext,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React8.createElement(
      CalendarWeekDays,
      {
        weekStartsOn,
        theme: resolvedTheme
      }
    ),
    /* @__PURE__ */ React8.createElement(View, { style: styles7.week }, calendar.weekData.days.map((day, index) => {
      const isSelected = currentSelected ? isSameDay(day.date, currentSelected) : false;
      if (renderDay) {
        return /* @__PURE__ */ React8.createElement(View, { key: index, style: { width: resolvedTheme.spacing.cellSize } }, renderDay(day));
      }
      return /* @__PURE__ */ React8.createElement(
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
var styles7 = StyleSheet.create({
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
  return /* @__PURE__ */ React8.createElement(
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
    /* @__PURE__ */ React8.createElement(
      Text,
      {
        style: [
          styles8.dayName,
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
    /* @__PURE__ */ React8.createElement(
      Text,
      {
        style: [
          styles8.dayNumber,
          {
            fontSize: 48,
            fontWeight: resolvedTheme.fontWeight.bold,
            color: resolvedTheme.colors.primary
          }
        ]
      },
      dayNumber
    ),
    /* @__PURE__ */ React8.createElement(
      Text,
      {
        style: [
          styles8.monthYear,
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
var styles8 = StyleSheet.create({
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

// src/components/Calendar/Calendar.tsx
function Calendar(props) {
  const { mode = "month", showWeekNumbers, ...rest } = props;
  if (mode === "month") {
    return /* @__PURE__ */ React8.createElement(CalendarMonth, { ...rest });
  }
  if (mode === "week") {
    return /* @__PURE__ */ React8.createElement(CalendarWeek, { ...rest, showWeekNumber: showWeekNumbers });
  }
  if (mode === "day") {
    return /* @__PURE__ */ React8.createElement(CalendarDay, { ...rest });
  }
  return /* @__PURE__ */ React8.createElement(CalendarMonth, { ...rest });
}
Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.Day = CalendarDay;
Calendar.Header = CalendarHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.Days = CalendarDays;

export { Calendar, DayCell, NavigationButton, ThemeProvider, addDays, addMonths, addWeeks, createCalendarStore, endOfDay, endOfMonth, endOfWeek, fromCalendarDate, generateMonthData, generateWeekData, getDayOfWeek, getDaysInMonth, getWeekNumber, isSameDay, isSameMonth, isSameWeek, isToday, isWeekend, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, themes, toCalendarDate, useCalendar, useMonthCalendar, useTheme, useWeekCalendar };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map