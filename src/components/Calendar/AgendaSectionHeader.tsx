import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CalendarTheme } from '../theme/types';

type AgendaSectionHeaderProps = {
  title: string;
  eventCount: number;
  theme: CalendarTheme;
};

export function AgendaSectionHeader({
  title,
  eventCount,
  theme,
}: AgendaSectionHeaderProps) {
  const accessibilityLabel = `Section, ${title}, ${eventCount} event${eventCount !== 1 ? 's' : ''}`;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: '#F5F5F5' }
      ]}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={[styles.title, { color: theme.colors.foreground }]}>
        {title}
      </Text>
      <Text style={styles.count}>
        {eventCount} event{eventCount !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
