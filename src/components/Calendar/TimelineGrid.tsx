import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CalendarTheme } from '../theme/types';

type TimelineGridProps = {
  startHour: number;
  endHour: number;
  slotDuration: number;
  businessHours?: { start: number; end: number };
  theme: CalendarTheme;
};

export function TimelineGrid({
  startHour,
  endHour,
  slotDuration,
  businessHours = { start: 9, end: 17 },
  theme,
}: TimelineGridProps) {
  const hours = [];
  for (let hour = startHour; hour < endHour; hour++) {
    hours.push(hour);
  }

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const isBusinessHour = (hour: number): boolean => {
    return hour >= businessHours.start && hour < businessHours.end;
  };

  return (
    <View style={styles.container}>
      {hours.map((hour) => (
        <View key={hour} style={styles.hourSlot}>
          <View style={styles.timeLabel}>
            <Text
              style={[styles.timeLabelText, { color: theme.colors.foreground }]}
              accessibilityRole="text"
            >
              {formatHour(hour)}
            </Text>
          </View>
          <View
            style={[
              styles.hourLine,
              {
                backgroundColor: isBusinessHour(hour)
                  ? 'rgba(0, 122, 255, 0.05)'
                  : theme.colors.background,
                borderTopColor: theme.colors.border || '#E0E0E0',
              }
            ]}
          >
            {slotDuration === 30 && (
              <View
                style={[
                  styles.halfHourLine,
                  { borderTopColor: '#F0F0F0' }
                ]}
              />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hourSlot: {
    height: 50, // 50px per hour
    flexDirection: 'row',
  },
  timeLabel: {
    width: 60,
    paddingRight: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  timeLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hourLine: {
    flex: 1,
    borderTopWidth: 1,
  },
  halfHourLine: {
    position: 'absolute',
    top: 25, // Halfway through 50px slot
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
});
