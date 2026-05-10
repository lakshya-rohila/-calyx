import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useMonthCalendar } from '../../src';
import { SimpleMonthView } from '../components/SimpleMonthView';

export function MonthExample() {
  const calendar = useMonthCalendar({
    weekStartsOn: 0,
    onMonthChange: (year, month) => {
      console.log(`Viewing ${year}-${month}`);
    },
  });

  const monthName = new Date(calendar.year, calendar.month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button title="<" onPress={calendar.goToPreviousMonth} />
        <Text style={styles.monthTitle}>{monthName}</Text>
        <Button title=">" onPress={calendar.goToNextMonth} />
      </View>

      <Button title="Today" onPress={calendar.goToToday} />

      <SimpleMonthView
        monthData={calendar.monthData}
        selectedDate={calendar.selectedDate}
        onDayPress={calendar.selectDate}
      />

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
          Month has {calendar.monthData.totalDays} days
        </Text>
        <Text style={styles.debugText}>
          Displaying {calendar.monthData.weeks.length} weeks
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
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
