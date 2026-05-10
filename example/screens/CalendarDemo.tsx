import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarMode, ThemeName } from '../../src';
import { useEventStore } from '../../src/store/event-store';
import { EventBottomSheet } from '../../src/components/EventBottomSheet';

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<CalendarMode>('month');
  const [theme, setTheme] = useState<ThemeName>('light');
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const themeNames: ThemeName[] = ['light', 'dark', 'ocean', 'forest', 'sunset', 'minimal'];

  const addEvent = useEventStore((state) => state.addEvent);
  const events = useEventStore((state) => state.events);
  const getEventsByDate = useEventStore((state) => state.getEventsByDate);

  // Add dummy events on mount
  useEffect(() => {
    if (events.length === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      // Add some dummy events
      addEvent({
        title: 'Team Meeting',
        description: 'Weekly sync with the team',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        isAllDay: false,
        color: '#007AFF',
        category: 'Work',
      });

      addEvent({
        title: 'Lunch Break',
        description: 'Lunch with colleagues',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
        isAllDay: false,
        color: '#34C759',
        category: 'Personal',
      });

      addEvent({
        title: 'Gym Session',
        startDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0),
        endDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 30),
        isAllDay: false,
        color: '#FF9500',
        category: 'Health',
      });

      addEvent({
        title: 'Birthday Party',
        description: 'John\'s birthday celebration',
        startDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate()),
        endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 1),
        isAllDay: true,
        color: '#FF2D55',
        category: 'Social',
      });

      addEvent({
        title: 'Project Deadline',
        description: 'Submit final deliverables',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 18, 0),
        isAllDay: false,
        color: '#FF3B30',
        category: 'Work',
      });

      addEvent({
        title: 'Doctor Appointment',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 0),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 15, 0),
        isAllDay: false,
        color: '#5AC8FA',
        category: 'Health',
      });
    }
  }, [addEvent, events.length]);

  const selectedDateEvents = getEventsByDate(selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const eventsOnDate = getEventsByDate(date);
    if (eventsOnDate.length > 0) {
      setShowBottomSheet(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calendar Demo</Text>

      <Text style={styles.sectionTitle}>Mode</Text>
      <View style={styles.modeButtons}>
        <ModeButton
          label="Month"
          active={mode === 'month'}
          onPress={() => setMode('month')}
        />
        <ModeButton
          label="Week"
          active={mode === 'week'}
          onPress={() => setMode('week')}
        />
        <ModeButton
          label="Day"
          active={mode === 'day'}
          onPress={() => setMode('day')}
        />
      </View>

      <Text style={styles.sectionTitle}>Theme</Text>
      <View style={styles.themeButtons}>
        {themeNames.map((themeName) => (
          <ThemeButton
            key={themeName}
            label={themeName}
            active={theme === themeName}
            onPress={() => setTheme(themeName)}
          />
        ))}
      </View>

      <View style={styles.calendarWrapper}>
        <Calendar
          mode={mode}
          selected={selectedDate}
          onSelect={handleDateSelect}
          theme={theme}
          events={events}
        />
      </View>

      {selectedDate && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>Selected Date:</Text>
          <Text style={styles.selectedText}>
            {selectedDate.toDateString()}
          </Text>
          {selectedDateEvents.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={styles.eventsLabel}>
                {selectedDateEvents.length} event{selectedDateEvents.length > 1 ? 's' : ''}
              </Text>
              {selectedDateEvents.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={[styles.eventDot, { backgroundColor: event.color }]} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {event.description && (
                      <Text style={styles.eventDescription}>{event.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <EventBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        events={selectedDateEvents}
        date={selectedDate}
      />
    </ScrollView>
  );
}

function ModeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.modeButton, active && styles.modeButtonActive]}
    >
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ThemeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.themeButton, active && styles.themeButtonActive]}
    >
      <Text style={[styles.themeButtonText, active && styles.themeButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
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
    marginBottom: 20,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#FFF',
  },
  themeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    textTransform: 'capitalize',
  },
  themeButtonTextActive: {
    color: '#FFF',
  },
  calendarWrapper: {
    marginBottom: 20,
  },
  selectedBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 20,
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
  },
  eventsSection: {
    marginTop: 16,
    width: '100%',
  },
  eventsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 4,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 13,
    color: '#666',
  },
});
