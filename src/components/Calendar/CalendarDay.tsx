import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCalendar } from '../../hooks';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import type { CalendarDayProps } from './types';
import type { CalendarTheme } from '../theme/types';

export function CalendarDay({
  value,
  onChange,
  defaultValue,
  theme: themeProp,
  style,
}: CalendarDayProps) {
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

  // Use Phase 1 hook
  const calendar = useCalendar({
    initialDate: currentValue,
  });

  // Sync with controlled value
  useEffect(() => {
    if (value) {
      calendar.setCurrentDate(value);
    }
  }, [value]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = calendar.currentDate;
  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const dayNumber = date.getDate();
  const year = date.getFullYear();

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
      <Text
        style={[
          styles.dayName,
          {
            fontSize: resolvedTheme.fontSize.weekday,
            fontWeight: resolvedTheme.fontWeight.regular,
            color: resolvedTheme.colors.foreground,
            opacity: 0.6,
          },
        ]}
      >
        {dayName}
      </Text>

      <Text
        style={[
          styles.dayNumber,
          {
            fontSize: 48,
            fontWeight: resolvedTheme.fontWeight.bold,
            color: resolvedTheme.colors.primary,
          },
        ]}
      >
        {dayNumber}
      </Text>

      <Text
        style={[
          styles.monthYear,
          {
            fontSize: resolvedTheme.fontSize.header,
            fontWeight: resolvedTheme.fontWeight.regular,
            color: resolvedTheme.colors.foreground,
          },
        ]}
      >
        {monthName} {year}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  dayName: {
    marginBottom: 8,
  },
  dayNumber: {
    marginBottom: 8,
  },
  monthYear: {
    // fontSize set by theme
  },
});
