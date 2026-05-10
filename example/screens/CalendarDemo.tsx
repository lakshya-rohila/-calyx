import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarMode } from '../../src';

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<CalendarMode>('month');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calendar Demo</Text>

      <View style={styles.modeButtons}>
        <Button
          title="Month"
          onPress={() => setMode('month')}
          color={mode === 'month' ? '#007AFF' : '#999'}
        />
        <Button
          title="Week"
          onPress={() => setMode('week')}
          color={mode === 'week' ? '#007AFF' : '#999'}
        />
        <Button
          title="Day"
          onPress={() => setMode('day')}
          color={mode === 'day' ? '#007AFF' : '#999'}
        />
      </View>

      <Calendar
        mode={mode}
        selected={selectedDate}
        onSelect={setSelectedDate}
        theme="light"
      />

      {selectedDate && (
        <Text style={styles.selectedText}>
          Selected: {selectedDate.toDateString()}
        </Text>
      )}
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
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});
