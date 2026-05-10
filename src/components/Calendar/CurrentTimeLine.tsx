import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type CurrentTimeLineProps = {
  startHour: number;
  showToday: boolean; // Only show if viewing today
};

export function CurrentTimeLine({ startHour, showToday }: CurrentTimeLineProps) {
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const topAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showToday) return;

    // Fade in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update time every minute
    const interval = setInterval(() => {
      const now = new Date();
      const newMinutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(newMinutes);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [showToday, fadeAnim]);

  useEffect(() => {
    // Animate position changes
    const pixelsPerMinute = 50 / 60; // 50px per hour
    const top = (currentMinutes - startHour * 60) * pixelsPerMinute;

    Animated.timing(topAnim, {
      toValue: top,
      duration: 500,
      useNativeDriver: false, // Can't use native driver for top
    }).start();
  }, [currentMinutes, startHour, topAnim]);

  if (!showToday) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          top: topAnim,
        },
      ]}
      accessibilityLabel={`Current time: ${Math.floor(currentMinutes / 60)}:${(currentMinutes % 60).toString().padStart(2, '0')}`}
    >
      <View style={styles.dot} />
      <View style={styles.line} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 100,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 56, // After time label gutter
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#FF3B30',
  },
});
