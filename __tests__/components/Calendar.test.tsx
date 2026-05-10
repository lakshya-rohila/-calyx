import React from 'react';
import { render } from '@testing-library/react-native';
import { Calendar } from '../../src/components/Calendar';

describe('Calendar', () => {
  it('renders in month mode by default', () => {
    const { getByText } = render(
      <Calendar defaultValue={new Date('2026-05-15')} theme="light" />
    );

    expect(getByText('May 2026')).toBeDefined();
  });

  it('renders in week mode', () => {
    const { getByText } = render(
      <Calendar
        mode="week"
        defaultValue={new Date('2026-05-15')}
        showWeekNumbers={true}
        theme="light"
      />
    );

    // Week mode shows "Week N, YYYY" when showWeekNumbers is true
    expect(getByText(/Week \d+, 2026/)).toBeDefined();
  });

  it('renders in day mode', () => {
    const { getByText } = render(
      <Calendar
        mode="day"
        defaultValue={new Date('2026-05-15')}
        theme="light"
      />
    );

    expect(getByText('15')).toBeDefined();
    expect(getByText('May 2026')).toBeDefined();
  });

  it('has compound components', () => {
    expect(Calendar.Month).toBeDefined();
    expect(Calendar.Week).toBeDefined();
    expect(Calendar.Day).toBeDefined();
  });
});
