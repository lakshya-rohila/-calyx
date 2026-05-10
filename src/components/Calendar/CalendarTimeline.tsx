import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { TimelineGrid } from './TimelineGrid';
import { TimelineEvent } from './TimelineEvent';
import { CurrentTimeLine } from './CurrentTimeLine';
import { useTimelineLayout } from '../../hooks/useTimelineLayout';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import type { CalendarEvent } from '../../types/events';
import type { TimelineConfig } from '../../types/timeline';
import type { CalendarTheme } from '../theme/types';
import type { ThemeName } from '../theme/themes';

type CalendarTimelineProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  selected?: Date;
  onSelect?: (date: Date) => void;
  events?: CalendarEvent[];
  timelineConfig?: TimelineConfig;
  theme?: CalendarTheme | ThemeName;
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  style?: any;
};

export function CalendarTimeline({
  value,
  onChange,
  events = [],
  timelineConfig = {},
  theme: themeProp,
  onEventPress,
  onEventLongPress,
  style,
}: CalendarTimelineProps) {
  const [internalValue, setInternalValue] = useState<Date>(value || new Date());
  const currentValue = value !== undefined ? value : internalValue;

  const scrollViewRef = useRef<ScrollView>(null);

  // Resolve theme
  const contextTheme = useTheme();
  const resolvedTheme: CalendarTheme = themeProp
    ? (typeof themeProp === 'string' ? themes[themeProp] : themeProp)
    : contextTheme;

  const config = {
    startHour: timelineConfig.startHour ?? 0,
    endHour: timelineConfig.endHour ?? 24,
    slotDuration: timelineConfig.slotDuration ?? 30,
    showCurrentTime: timelineConfig.showCurrentTime ?? true,
    businessHours: timelineConfig.businessHours ?? { start: 9, end: 17 },
    scrollToNow: timelineConfig.scrollToNow ?? true,
  };

  const layouts = useTimelineLayout(events, currentValue, config);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const showCurrentTime = config.showCurrentTime && isToday(currentValue);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (config.scrollToNow && isToday(currentValue) && scrollViewRef.current) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const pixelsPerMinute = 50 / 60;
      const scrollY = (currentMinutes - config.startHour * 60) * pixelsPerMinute - 100;

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, scrollY), animated: true });
      }, 300);
    }
  }, []);

  const handlePrevious = () => {
    const newDate = new Date(currentValue);
    newDate.setDate(newDate.getDate() - 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentValue);
    newDate.setDate(newDate.getDate() + 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const totalHeight = (config.endHour - config.startHour) * 50;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme.colors.background,
          padding: resolvedTheme.spacing.padding,
        },
        style,
      ]}
    >
      <CalendarHeader
        year={currentValue.getFullYear()}
        month={currentValue.getMonth()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        theme={resolvedTheme}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
      >
        <View style={{ height: totalHeight }}>
          <TimelineGrid
            startHour={config.startHour}
            endHour={config.endHour}
            slotDuration={config.slotDuration}
            businessHours={config.businessHours}
            theme={resolvedTheme}
          />

          {layouts.map((layout) => (
            <TimelineEvent
              key={layout.event.id}
              layout={layout}
              onPress={onEventPress}
              onLongPress={onEventLongPress}
              theme={resolvedTheme}
            />
          ))}

          {showCurrentTime && (
            <CurrentTimeLine
              startHour={config.startHour}
              showToday={true}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
