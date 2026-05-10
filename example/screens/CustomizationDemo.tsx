import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { DayData } from '../../src';

export function CustomizationDemo() {
  const renderDay = (day: DayData) => (
    <View style={styles.customDay}>
      <Text style={styles.dayNumber}>{day.calendarDate.day}</Text>
      {day.isToday && <Text style={styles.todayBadge}>Today</Text>}
      {day.isWeekend && <View style={styles.weekendDot} />}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Custom Rendering</Text>

      <Calendar.Month
        theme="light"
        renderDay={renderDay}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  customDay: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 16,
  },
  todayBadge: {
    fontSize: 8,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  weekendDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9500',
    position: 'absolute',
    bottom: 4,
  },
});
