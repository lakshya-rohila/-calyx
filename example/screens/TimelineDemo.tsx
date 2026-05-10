import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarEvent, ThemeName } from '../../src';
import { useEventStore } from '../../src/store/event-store';

export function TimelineDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<ThemeName>('light');

  const addEvent = useEventStore((state) => state.addEvent);
  const events = useEventStore((state) => state.events);

  // Add sample events including conflicts
  useEffect(() => {
    if (events.length === 0) {
      const today = new Date();

      // Morning overlapping meetings
      addEvent({
        title: 'Team Standup',
        description: 'Daily sync',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
        isAllDay: false,
        color: '#007AFF',
        category: 'Work',
      });

      addEvent({
        title: '1-on-1 with Manager',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        isAllDay: false,
        color: '#34C759',
        category: 'Work',
      });

      addEvent({
        title: 'Coffee Break',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 45),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 15),
        isAllDay: false,
        color: '#FF9500',
        category: 'Personal',
      });

      // Lunch
      addEvent({
        title: 'Lunch with Client',
        description: 'Discuss Q2 roadmap',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30),
        isAllDay: false,
        color: '#FF2D55',
        category: 'Business',
      });

      // Afternoon
      addEvent({
        title: 'Project Review',
        description: 'Sprint retrospective',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        isAllDay: false,
        color: '#5AC8FA',
        category: 'Work',
      });

      // Long meeting
      addEvent({
        title: 'All-Hands Meeting',
        description: 'Company quarterly update',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
        isAllDay: false,
        color: '#AF52DE',
        category: 'Company',
      });
    }
  }, [addEvent, events.length]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Timeline View Demo</Text>
      <Text style={styles.subtitle}>Hourly grid with conflict detection</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ⏰ Shows events in hourly time slots
        </Text>
        <Text style={styles.infoText}>
          🔴 Red line indicates current time
        </Text>
        <Text style={styles.infoText}>
          ⚡️ Overlapping events shown side-by-side
        </Text>
        <Text style={styles.infoText}>
          💼 Business hours highlighted (9am-5pm)
        </Text>
      </View>

      <View style={styles.calendarWrapper}>
        <Calendar
          mode="timeline"
          value={selectedDate}
          onChange={setSelectedDate}
          events={events}
          timelineConfig={{
            startHour: 8,
            endHour: 20,
            slotDuration: 30,
            showCurrentTime: true,
            businessHours: { start: 9, end: 17 },
            scrollToNow: true,
          }}
          onEventPress={(event) => console.log('Pressed:', event.title)}
          theme={theme}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 4,
  },
  calendarWrapper: {
    height: 600,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
});
