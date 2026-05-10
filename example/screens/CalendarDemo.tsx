import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from '../../src';
import type { CalendarMode, ThemeName } from '../../src';

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<CalendarMode>('month');
  const [theme, setTheme] = useState<ThemeName>('light');

  const themeNames: ThemeName[] = ['light', 'dark', 'ocean', 'forest', 'sunset', 'minimal'];

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

      <Calendar
        mode={mode}
        selected={selectedDate}
        onSelect={setSelectedDate}
        theme={theme}
      />

      {selectedDate && (
        <Text style={styles.selectedText}>
          Selected: {selectedDate.toDateString()}
        </Text>
      )}
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
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});
