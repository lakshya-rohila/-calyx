/**
 * CalendarWithAPIDemo
 * Example showing how to integrate calendar with external API data
 *
 * This demonstrates the RECOMMENDED pattern for production apps:
 * - Events come from your API (simulated here with mock fetch)
 * - Calendar is fully controlled
 * - No dependency on built-in store
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarEvent } from '../../src';
import { EventBottomSheet } from '../../src/components/EventBottomSheet';

// Simulated API response
const mockAPIResponse = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily sync with engineering team',
    start_time: new Date(2026, 4, 10, 9, 0).toISOString(),
    end_time: new Date(2026, 4, 10, 9, 30).toISOString(),
    all_day: false,
    color: '#007AFF',
    category: 'Work',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Client Meeting',
    description: 'Q2 review with client stakeholders',
    start_time: new Date(2026, 4, 11, 14, 0).toISOString(),
    end_time: new Date(2026, 4, 11, 15, 30).toISOString(),
    all_day: false,
    color: '#FF9500',
    category: 'Work',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Company All-Hands',
    start_time: new Date(2026, 4, 15, 0, 0).toISOString(),
    end_time: new Date(2026, 4, 16, 0, 0).toISOString(),
    all_day: true,
    color: '#FF2D55',
    category: 'Company',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Transform API data to CalendarEvent format
function transformAPIEvent(apiEvent: typeof mockAPIResponse[0]): CalendarEvent {
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description,
    startDate: new Date(apiEvent.start_time),
    endDate: new Date(apiEvent.end_time),
    isAllDay: apiEvent.all_day,
    color: apiEvent.color,
    category: apiEvent.category,
    createdAt: new Date(apiEvent.created_at),
    updatedAt: new Date(apiEvent.updated_at),
  };
}

export function CalendarWithAPIDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Simulated API fetch
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In real app, this would be:
        // const response = await fetch('https://api.example.com/events');
        // const data = await response.json();

        const transformedEvents = mockAPIResponse.map(transformAPIEvent);
        setEvents(transformedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const getEventsByDate = (date: Date): CalendarEvent[] => {
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nextDay = new Date(targetDay);
    nextDay.setDate(nextDay.getDate() + 1);

    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart < nextDay && eventEnd >= targetDay;
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const eventsOnDate = getEventsByDate(date);
    if (eventsOnDate.length > 0) {
      setShowBottomSheet(true);
    }
  };

  const selectedDateEvents = getEventsByDate(selectedDate);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading events from API...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calendar with API Data</Text>
      <Text style={styles.subtitle}>
        This example shows events fetched from an external API
      </Text>

      <View style={styles.statsBox}>
        <Text style={styles.statsText}>
          📊 Loaded {events.length} events from API
        </Text>
      </View>

      <Calendar
        mode="month"
        selected={selectedDate}
        onSelect={handleDateSelect}
        theme="light"
        events={events}
      />

      {selectedDate && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>Selected Date:</Text>
          <Text style={styles.selectedText}>
            {selectedDate.toDateString()}
          </Text>
          {selectedDateEvents.length > 0 ? (
            <Text style={styles.eventCount}>
              {selectedDateEvents.length} event{selectedDateEvents.length > 1 ? 's' : ''}
            </Text>
          ) : (
            <Text style={styles.noEvents}>No events</Text>
          )}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Implementation Notes:</Text>
        <Text style={styles.infoText}>
          • Events fetched from mock API (simulated)
        </Text>
        <Text style={styles.infoText}>
          • Data transformed to CalendarEvent format
        </Text>
        <Text style={styles.infoText}>
          • Calendar is fully controlled by parent
        </Text>
        <Text style={styles.infoText}>
          • No dependency on built-in store
        </Text>
      </View>

      <EventBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        events={selectedDateEvents}
        date={selectedDate}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  statsBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  selectedBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  selectedText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  eventCount: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  noEvents: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});
