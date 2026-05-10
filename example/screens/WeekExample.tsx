import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useWeekCalendar } from '../../src';
import { DayCell } from '../components/DayCell';

export function WeekExample() {
  const calendar = useWeekCalendar({
    weekStartsOn: 1, // Start on Monday
    onWeekChange: (weekNum, year) => {
      console.log(`Viewing Week ${weekNum} of ${year}`);
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button title="<" onPress={calendar.goToPreviousWeek} />
        <Text style={styles.weekTitle}>
          Week {calendar.weekNumber} - {calendar.year}
        </Text>
        <Button title=">" onPress={calendar.goToNextWeek} />
      </View>

      <Button title="Today" onPress={calendar.goToToday} />

      <View style={styles.weekContainer}>
        <View style={styles.headerRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <Text key={day} style={styles.headerText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysRow}>
          {calendar.weekData.days.map((day, index) => (
            <DayCell
              key={index}
              day={day}
              isSelected={calendar.isDateSelected(day.date)}
              onPress={() => calendar.selectDate(day.date)}
            />
          ))}
        </View>
      </View>

      {calendar.selectedDate && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Selected: {calendar.selectedDate.toDateString()}
          </Text>
          <Button title="Clear Selection" onPress={calendar.clearSelection} />
        </View>
      )}

      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          ISO Week Number: {calendar.weekNumber}
        </Text>
        <Text style={styles.debugText}>
          First day: {calendar.weekData.days[0]?.date.toDateString()}
        </Text>
        <Text style={styles.debugText}>
          Last day: {calendar.weekData.days[6]?.date.toDateString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekContainer: {
    padding: 20,
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
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectedInfo: {
    padding: 20,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    marginBottom: 10,
  },
  debugInfo: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    margin: 20,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
