import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { DayData } from '../../src/types';

type DayCellProps = {
  day: DayData;
  isSelected: boolean;
  onPress: () => void;
};

export function DayCell({ day, isSelected, onPress }: DayCellProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        day.isToday && styles.today,
        isSelected && styles.selected,
        !day.isCurrentMonth && styles.otherMonth,
      ]}
    >
      <Text
        style={[
          styles.text,
          day.isToday && styles.todayText,
          isSelected && styles.selectedText,
          !day.isCurrentMonth && styles.otherMonthText,
        ]}
      >
        {day.calendarDate.day}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 24,
  },
  today: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  otherMonth: {
    opacity: 0.3,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFF',
    fontWeight: '600',
  },
  otherMonthText: {
    color: '#999',
  },
});
