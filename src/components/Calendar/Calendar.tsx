import React from 'react';
import { CalendarMonth } from './CalendarMonth';
import { CalendarWeek } from './CalendarWeek';
import { CalendarDay } from './CalendarDay';
import { CalendarTimeline } from './CalendarTimeline';
import { CalendarAgenda } from './CalendarAgenda';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekDays } from './CalendarWeekDays';
import { CalendarDays } from './CalendarDays';
import type { CalendarProps } from './types';

export function Calendar(props: CalendarProps) {
  const { mode = 'month', showWeekNumbers, ...rest } = props;

  if (mode === 'month') {
    return <CalendarMonth {...rest} />;
  }

  if (mode === 'week') {
    return <CalendarWeek {...rest} showWeekNumber={showWeekNumbers} />;
  }

  if (mode === 'day') {
    return <CalendarDay {...rest} />;
  }

  if (mode === 'timeline') {
    return <CalendarTimeline {...rest} />;
  }

  if (mode === 'agenda') {
    return <CalendarAgenda {...rest} />;
  }

  return <CalendarMonth {...rest} />;
}

// Compound component pattern
Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.Day = CalendarDay;
Calendar.Timeline = CalendarTimeline;
Calendar.Agenda = CalendarAgenda;
Calendar.Header = CalendarHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.Days = CalendarDays;
