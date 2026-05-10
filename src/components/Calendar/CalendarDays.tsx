import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DayCell } from '../primitives';
import { isSameDay } from '../../engine/calendar-math';
import type { CalendarDaysProps } from './types';

export function CalendarDays({
  monthData,
  selected,
  onSelectDate,
  renderDay,
  minDate,
  maxDate,
  disabledDates = [],
  disabled = false,
  theme,
  events = [],
}: CalendarDaysProps) {
  const isDateDisabled = (date: Date): boolean => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disabledDates.some(d => isSameDay(d, date))) return true;
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selected) return false;
    return isSameDay(date, selected);
  };

  const getEventsForDate = (date: Date) => {
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nextDay = new Date(targetDay);
    nextDay.setDate(nextDay.getDate() + 1);

    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart < nextDay && eventEnd >= targetDay;
    });
  };

  return (
    <View style={styles.container}>
      {monthData.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.days.map((day, dayIndex) => {
            const isSelected = isDateSelected(day.date);
            const isDisabled = isDateDisabled(day.date);
            const dayEvents = getEventsForDate(day.date);

            if (renderDay) {
              return (
                <View key={dayIndex} style={{ width: theme.spacing.cellSize }}>
                  {renderDay(day)}
                </View>
              );
            }

            return (
              <DayCell
                key={dayIndex}
                day={day}
                selected={isSelected}
                disabled={isDisabled}
                onPress={() => !isDisabled && onSelectDate?.(day.date)}
                theme={theme}
                events={dayEvents}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
