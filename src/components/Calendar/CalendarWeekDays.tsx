import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CalendarWeekDaysProps } from './types';

export function CalendarWeekDays({ weekStartsOn, theme }: CalendarWeekDaysProps) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Rotate array based on week start
  const orderedDays = weekStartsOn === 1
    ? [...dayNames.slice(1), dayNames[0]]
    : dayNames;

  return (
    <View style={styles.container}>
      {orderedDays.map((day) => (
        <View
          key={day}
          style={[
            styles.dayCell,
            {
              width: theme.spacing.cellSize,
            },
          ]}
        >
          <Text
            style={[
              styles.dayText,
              {
                fontSize: theme.fontSize.weekday,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.foreground,
                opacity: 0.6,
              },
            ]}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
});
