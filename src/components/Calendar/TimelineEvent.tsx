import React, { useRef } from 'react';
import { Pressable, Text, View, StyleSheet, Animated } from 'react-native';
import type { CalendarEvent } from '../../types/events';
import type { TimelineEventLayout } from '../../types/timeline';
import type { CalendarTheme } from '../theme/types';

type TimelineEventProps = {
  layout: TimelineEventLayout;
  onPress?: (event: CalendarEvent) => void;
  onLongPress?: (event: CalendarEvent) => void;
  theme: CalendarTheme;
};

export function TimelineEvent({
  layout,
  onPress,
  onLongPress,
  theme,
}: TimelineEventProps) {
  const { event, top, height, left, width } = layout;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const showDetails = height >= 40;
  const showDescription = height >= 60;

  const accessibilityLabel = `${event.title}, ${formatTime(event.startDate)} to ${formatTime(event.endDate)}${event.category ? `, ${event.category} category` : ''}`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          position: 'absolute',
          top,
          height: Math.max(30, height),
          left: `${left}%`,
          width: `${width}%`,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={() => onPress?.(event)}
        onLongPress={() => onLongPress?.(event)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.eventCard,
          {
            backgroundColor: event.color,
            borderLeftColor: event.color,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view event details"
      >
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {showDetails && (
          <Text style={styles.time} numberOfLines={1}>
            {formatTime(event.startDate)} - {formatTime(event.endDate)}
          </Text>
        )}
        {showDescription && event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
  },
  eventCard: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  time: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  description: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
