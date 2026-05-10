import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationButton } from '../primitives';
import type { CalendarHeaderProps } from './types';

export function CalendarHeader({
  year,
  month,
  weekNumber,
  onPrevious,
  onNext,
  onToday,
  theme,
}: CalendarHeaderProps) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const displayText = month !== undefined
    ? `${monthNames[month - 1]} ${year}`
    : weekNumber !== undefined
    ? `Week ${weekNumber}, ${year}`
    : `${year}`;

  return (
    <View
      accessibilityRole="header"
      style={[
        styles.header,
        {
          marginBottom: theme.spacing.headerSpacing,
        },
      ]}
    >
      <NavigationButton
        direction="left"
        onPress={onPrevious}
        theme={theme}
      />

      <Text
        style={[
          styles.title,
          {
            fontSize: theme.fontSize.header,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.foreground,
          },
        ]}
      >
        {displayText}
      </Text>

      <NavigationButton
        direction="right"
        onPress={onNext}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
