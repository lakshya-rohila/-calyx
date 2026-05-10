import React, { useRef } from 'react';
import { Pressable, Text, Animated, StyleSheet } from 'react-native';
import type { DayData } from '../../types';
import type { CalendarTheme } from '../theme/types';

type DayCellProps = {
  day: DayData;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  theme: CalendarTheme;
};

export function DayCell({
  day,
  selected = false,
  disabled = false,
  onPress,
  onLongPress,
  theme,
}: DayCellProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
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

  // Accessibility label
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const accessibilityLabel = `${day.calendarDate.day} ${monthNames[day.calendarDate.month - 1]} ${day.calendarDate.year}, ${dayNames[day.dayOfWeek]}`;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      ]}
    >
      <Pressable
        testID="day-cell"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected, disabled }}
        accessibilityHint={!disabled ? "Double tap to select this date" : undefined}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.cell,
          {
            width: theme.spacing.cellSize,
            height: theme.spacing.cellSize,
            borderRadius: theme.borderRadius.cell,
            backgroundColor: selected ? theme.colors.selected : 'transparent',
            borderWidth: day.isToday && !selected ? 2 : 0,
            borderColor: day.isToday ? theme.colors.today : 'transparent',
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: theme.fontSize.day,
              fontWeight: theme.fontWeight.regular,
              color: disabled
                ? theme.colors.disabled
                : selected
                ? theme.colors.selectedForeground
                : day.isToday
                ? theme.colors.todayForeground
                : day.isWeekend
                ? theme.colors.weekend
                : theme.colors.foreground,
              opacity: !day.isCurrentMonth ? 0.4 : 1,
            },
          ]}
        >
          {day.calendarDate.day}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
