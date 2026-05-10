import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useMonthCalendar } from '../../hooks';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekDays } from './CalendarWeekDays';
import { CalendarDays } from './CalendarDays';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import type { CalendarMonthProps } from './types';
import type { CalendarTheme } from '../theme/types';

export function CalendarMonth({
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
}: CalendarMonthProps) {
  // Resolve theme
  const contextTheme = useTheme();
  const resolvedTheme: CalendarTheme = themeProp
    ? (typeof themeProp === 'string' ? themes[themeProp] : themeProp)
    : contextTheme;

  // Controlled vs uncontrolled viewing date
  const [internalValue, setInternalValue] = useState<Date>(
    value || defaultValue || new Date()
  );
  const currentValue = value !== undefined ? value : internalValue;

  // Controlled vs uncontrolled selection
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(
    selected || defaultSelected
  );
  const currentSelected = selected !== undefined ? selected : internalSelected;

  // Use Phase 1 hook
  const calendar = useMonthCalendar({
    initialDate: currentValue,
    weekStartsOn,
    onMonthChange,
  });

  // Sync with controlled value
  useEffect(() => {
    if (value) {
      calendar.setCurrentDate(value);
    }
  }, [value]);

  // Handle navigation
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

  // Handle day selection
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
        month={calendar.month}
        onPrevious={handlePrevious}
        onNext={handleNext}
        theme={resolvedTheme}
      />

      <CalendarWeekDays
        weekStartsOn={weekStartsOn}
        theme={resolvedTheme}
      />

      <CalendarDays
        monthData={calendar.monthData}
        selected={currentSelected}
        onSelectDate={handleSelectDate}
        renderDay={renderDay}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        disabled={disabled}
        theme={resolvedTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding and backgroundColor set by theme
  },
});
