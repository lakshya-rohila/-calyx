/**
 * EventBottomSheet Component
 * Bottom sheet with slide-up animation for displaying events
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import type { CalendarEvent } from '../types/events';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

export type EventBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  date: Date;
};

export function EventBottomSheet({
  visible,
  onClose,
  events,
  date,
}: EventBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <Pressable style={styles.backdropTouchable} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>{date.toDateString()}</Text>
            <Text style={styles.eventCount}>
              {events.length} event{events.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={[styles.eventColor, { backgroundColor: event.color }]} />
                  <View style={styles.eventMain}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {!event.isAllDay && (
                      <Text style={styles.eventTime}>
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </Text>
                    )}
                    {event.isAllDay && (
                      <Text style={styles.eventTime}>All Day</Text>
                    )}
                  </View>
                </View>

                {event.description && (
                  <Text style={styles.eventDescription}>{event.description}</Text>
                )}

                {event.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{event.category}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventColor: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
    minHeight: 40,
  },
  eventMain: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  closeButton: {
    margin: 20,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
