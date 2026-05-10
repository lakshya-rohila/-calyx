import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarEvent, ThemeName } from '../../src';
import { useEventStore } from '../../src/store/event-store';

export function AgendaDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<ThemeName>('light');

  const addEvent = useEventStore((state) => state.addEvent);
  const events = useEventStore((state) => state.events);

  // Add events across multiple days
  useEffect(() => {
    if (events.length === 0) {
      const today = new Date();

      // Today's events
      addEvent({
        title: 'Morning Meeting',
        description: 'Project kickoff',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        isAllDay: false,
        color: '#007AFF',
        category: 'Work',
      });

      addEvent({
        title: 'Lunch Break',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
        isAllDay: false,
        color: '#34C759',
        category: 'Personal',
      });

      // Tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      addEvent({
        title: 'Client Presentation',
        description: 'Q2 review with stakeholders',
        startDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
        endDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0),
        isAllDay: false,
        color: '#FF9500',
        category: 'Business',
      });

      // All-day event next week
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      addEvent({
        title: 'Company Offsite',
        description: 'Team building activities',
        startDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 0, 0),
        endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 1, 0, 0),
        isAllDay: true,
        color: '#FF2D55',
        category: 'Company',
      });

      // Future events
      for (let i = 1; i <= 5; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + (i * 3));

        addEvent({
          title: `Event ${i}`,
          description: `Scheduled event ${i}`,
          startDate: new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 10 + i, 0),
          endDate: new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 11 + i, 0),
          isAllDay: false,
          color: ['#5AC8FA', '#AF52DE', '#FF3B30', '#FFCC00', '#8E8E93'][i - 1],
          category: 'Work',
        });
      }
    }
  }, [addEvent, events.length]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda View Demo</Text>
        <Text style={styles.subtitle}>Chronological list with grouping</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📅 Events grouped by day
        </Text>
        <Text style={styles.infoText}>
          📜 Infinite scroll for future events
        </Text>
        <Text style={styles.infoText}>
          🔵 Color dots and category badges
        </Text>
        <Text style={styles.infoText}>
          ⏱ All-day and timed events
        </Text>
      </View>

      <View style={styles.calendarWrapper}>
        <Calendar
          mode="agenda"
          value={selectedDate}
          onChange={setSelectedDate}
          events={events}
          agendaConfig={{
            groupBy: 'day',
            showEmptyDays: false,
            futureMonths: 3,
          }}
          onEventPress={(event) => console.log('Pressed:', event.title)}
          theme={theme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
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
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 4,
  },
  calendarWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
