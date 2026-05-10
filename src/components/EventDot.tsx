/**
 * EventDot Component
 * Small colored dot indicator for events on calendar days
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

export type EventDotProps = {
  color: string;
  size?: number;
};

export function EventDot({ color, size = 6 }: EventDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    marginHorizontal: 1,
  },
});
