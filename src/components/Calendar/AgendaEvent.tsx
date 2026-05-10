import React, { useRef } from 'react';
import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import type { CalendarEvent } from '../../types/events';
import type { CalendarTheme } from '../theme/types';

type AgendaEventProps = {
  event: CalendarEvent;
  onPress?: (event: CalendarEvent) => void;
  onLongPress?: (event: CalendarEvent) => void;
  theme: CalendarTheme;
};

export function AgendaEvent({
  event,
  onPress,
  onLongPress,
  theme,
}: AgendaEventProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
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
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
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

  const timeDisplay = event.isAllDay
    ? 'All Day'
    : `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;

  const accessibilityLabel = `${event.title}, ${timeDisplay}${event.description ? `, ${event.description}` : ''}${event.category ? `, ${event.category} category` : ''}`;

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFF', '#F5F5F5'],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress?.(event)}
        onLongPress={() => onLongPress?.(event)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view event details"
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor },
          ]}
        >
          <View style={styles.leftSection}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: event.color },
              ]}
            />
            <View style={styles.content}>
              <Text style={styles.time}>{timeDisplay}</Text>
              <Text style={styles.title} numberOfLines={1}>
                {event.title}
              </Text>
              {event.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {event.description}
                </Text>
              )}
              {event.category && (
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: `${event.color}20` },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: event.color }]}>
                    {event.category}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
