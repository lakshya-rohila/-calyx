import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { AgendaSectionHeader } from './AgendaSectionHeader';
import { AgendaEvent } from './AgendaEvent';
import { useAgendaGrouping } from '../../hooks/useAgendaGrouping';
import { useTheme } from '../theme';
import { themes } from '../theme/themes';
import { addMonths } from 'date-fns';
import type { CalendarEvent } from '../../types/events';
import type { AgendaConfig } from '../../types/agenda';
import type { CalendarTheme } from '../theme/types';
import type { ThemeName } from '../theme/themes';

type CalendarAgendaProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  agendaConfig?: AgendaConfig;
  theme?: CalendarTheme | ThemeName;
  onEventPress?: (event: CalendarEvent) => void;
  onEventLongPress?: (event: CalendarEvent) => void;
  style?: any;
};

type FlatListItem =
  | { type: 'header'; section: any }
  | { type: 'event'; event: CalendarEvent; sectionDate: Date };

export function CalendarAgenda({
  value,
  onChange,
  events = [],
  agendaConfig = {},
  theme: themeProp,
  onEventPress,
  onEventLongPress,
  style,
}: CalendarAgendaProps) {
  const [internalValue, setInternalValue] = useState<Date>(value || new Date());
  const currentValue = value !== undefined ? value : internalValue;
  const [loadedMonths, setLoadedMonths] = useState(agendaConfig.futureMonths || 3);

  // Resolve theme
  const contextTheme = useTheme();
  const resolvedTheme: CalendarTheme = themeProp
    ? (typeof themeProp === 'string' ? themes[themeProp] : themeProp)
    : contextTheme;

  const config = {
    groupBy: agendaConfig.groupBy || 'day',
    showEmptyDays: agendaConfig.showEmptyDays || false,
    futureMonths: loadedMonths,
    dateFormat: agendaConfig.dateFormat,
  };

  const sections = useAgendaGrouping(events, currentValue, config);

  // Flatten sections into FlatList items
  const flatListData: FlatListItem[] = [];
  sections.forEach((section) => {
    flatListData.push({ type: 'header', section });
    section.events.forEach((event) => {
      flatListData.push({ type: 'event', event, sectionDate: section.date });
    });
  });

  const handleLoadMore = () => {
    setLoadedMonths((prev) => prev + 1);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentValue);
    newDate.setMonth(newDate.getMonth() - 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentValue);
    newDate.setMonth(newDate.getMonth() + 1);
    if (onChange) {
      onChange(newDate);
    } else {
      setInternalValue(newDate);
    }
  };

  const renderItem = ({ item }: { item: FlatListItem }) => {
    if (item.type === 'header') {
      return (
        <AgendaSectionHeader
          title={item.section.title}
          eventCount={item.section.events.length}
          theme={resolvedTheme}
        />
      );
    }

    return (
      <AgendaEvent
        event={item.event}
        onPress={onEventPress}
        onLongPress={onEventLongPress}
        theme={resolvedTheme}
      />
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={resolvedTheme.colors.primary} />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme.colors.background,
        },
        style,
      ]}
    >
      <View style={{ padding: resolvedTheme.spacing.padding }}>
        <CalendarHeader
          year={currentValue.getFullYear()}
          month={currentValue.getMonth()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          theme={resolvedTheme}
        />
      </View>

      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'header'
            ? `header-${item.section.date.getTime()}`
            : `event-${item.event.id}-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={15}
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});
