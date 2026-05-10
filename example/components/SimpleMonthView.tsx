import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayCell } from './DayCell';
import type { MonthData } from '../../src/types';

type SimpleMonthViewProps = {
  monthData: MonthData;
  selectedDate: Date | null;
  onDayPress: (date: Date) => void;
};

export function SimpleMonthView({ monthData, selectedDate, onDayPress }: SimpleMonthViewProps) {
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <View style={styles.container}>
      {/* Header with day names */}
      <View style={styles.headerRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.headerText}>{day}</Text>
        ))}
      </View>

      {/* Weeks */}
      {monthData.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.days.map((day, dayIndex) => (
            <DayCell
              key={dayIndex}
              day={day}
              isSelected={isDateSelected(day.date)}
              onPress={() => onDayPress(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  headerText: {
    width: 48,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
