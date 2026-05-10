/**
 * EventDots Component
 * Container for multiple event dots with max limit
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EventDot } from './EventDot';
import type { CalendarEvent } from '../types/events';

export type EventDotsProps = {
  events: CalendarEvent[];
  maxDots?: number;
  dotSize?: number;
};

export function EventDots({ events, maxDots = 3, dotSize = 6 }: EventDotsProps) {
  if (events.length === 0) {
    return null;
  }

  const displayEvents = events.slice(0, maxDots);

  return (
    <View style={styles.container}>
      {displayEvents.map((event) => (
        <EventDot key={event.id} color={event.color} size={dotSize} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 8,
  },
});
