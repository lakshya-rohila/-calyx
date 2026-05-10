import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useCalendar } from '../../src';

export function BasicExample() {
  const calendar = useCalendar({
    weekStartsOn: 0,
    onDateChange: (date) => console.log('Date changed:', date.toDateString()),
    onDateSelect: (date) => console.log('Date selected:', date?.toDateString() ?? 'none'),
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>useCalendar Demo</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Current Date:</Text>
        <Text style={styles.value}>{calendar.currentDate.toDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Selected Date:</Text>
        <Text style={styles.value}>
          {calendar.selectedDate?.toDateString() ?? 'None'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Week Starts On:</Text>
        <Text style={styles.value}>
          {calendar.weekConfig.weekStartsOn === 0 ? 'Sunday' : 'Monday'}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Today" onPress={calendar.goToToday} />
        <Button
          title="Select Tomorrow"
          onPress={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            calendar.selectDate(tomorrow);
          }}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Clear Selection"
          onPress={calendar.clearSelection}
        />
        <Button
          title="Next Month"
          onPress={() => {
            const nextMonth = new Date(calendar.currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            calendar.setCurrentDate(nextMonth);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
});
