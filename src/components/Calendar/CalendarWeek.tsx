import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useWeekCalendar } from '../../hooks';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekDays } from './CalendarWeekDays';
import { DayCell } from '../primitives';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import { isSameDay } from '../../engine/calendar-math';
import type { CalendarWeekProps } from './types';
import type { CalendarTheme } from '../theme/types';

export function CalendarWeek({
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
  style,
}: CalendarWeekProps) {
  // Resolve theme
  const contextTheme = useTheme();
  const resolvedTheme: CalendarTheme = themeProp
    ? (typeof themeProp === 'string' ? themes[themeProp] : themeProp)
    : contextTheme;

  // Controlled vs uncontrolled
  const [internalValue, setInternalValue] = useState<Date>(
    value || defaultValue || new Date()
  );
  const currentValue = value !== undefined ? value : internalValue;

  const [internalSelected, setInternalSelected] = useState<Date | undefined>(
    selected || defaultSelected
  );
  const currentSelected = selected !== undefined ? selected : internalSelected;

  // Use Phase 1 hook
  const calendar = useWeekCalendar({
    initialDate: currentValue,
    weekStartsOn,
    onWeekChange,
  });

  // Sync with controlled value
  useEffect(() => {
    if (value) {
      calendar.setCurrentDate(value);
    }
  }, [value]);

  // Handle navigation
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

  // Handle selection
  const handleSelectDate = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    } else {
      setInternalSelected(date);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          padding: resolvedTheme.spacing.padding,
          backgroundColor: resolvedTheme.colors.background,
          borderRadius: resolvedTheme.borderRadius.container,
        },
        style,
      ]}
    >
      <CalendarHeader
        year={calendar.year}
        weekNumber={showWeekNumber ? calendar.weekNumber : undefined}
        onPrevious={handlePrevious}
        onNext={handleNext}
        theme={resolvedTheme}
      />

      <CalendarWeekDays
        weekStartsOn={weekStartsOn}
        theme={resolvedTheme}
      />

      <View style={styles.week}>
        {calendar.weekData.days.map((day, index) => {
          const isSelected = currentSelected ? isSameDay(day.date, currentSelected) : false;

          if (renderDay) {
            return (
              <View key={index} style={{ width: resolvedTheme.spacing.cellSize }}>
                {renderDay(day)}
              </View>
            );
          }

          return (
            <DayCell
              key={index}
              day={day}
              selected={isSelected}
              onPress={() => handleSelectDate(day.date)}
              theme={resolvedTheme}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // styled by theme
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
