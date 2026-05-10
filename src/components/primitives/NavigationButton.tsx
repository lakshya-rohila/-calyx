import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { CalendarTheme } from '../theme/types';

type NavigationButtonProps = {
  direction: 'left' | 'right';
  onPress: () => void;
  theme: CalendarTheme;
  disabled?: boolean;
};

export function NavigationButton({
  direction,
  onPress,
  theme,
  disabled = false,
}: NavigationButtonProps) {
  const arrow = direction === 'left' ? '◀' : '▶';
  const label = direction === 'left' ? 'Previous' : 'Next';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          opacity: disabled ? 0.3 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.arrow,
          {
            color: theme.colors.primary,
            fontSize: theme.fontSize.header,
          },
        ]}
      >
        {arrow}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  arrow: {
    fontWeight: '600',
  },
});
