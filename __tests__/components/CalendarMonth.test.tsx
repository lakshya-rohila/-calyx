import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarMonth } from '../../src/components/Calendar/CalendarMonth';

describe('CalendarMonth', () => {
  it('renders current month', () => {
    const { getByText } = render(
      <CalendarMonth defaultValue={new Date('2026-05-15')} theme="light" />
    );

    expect(getByText('May 2026')).toBeDefined();
  });

  it('navigates to next month', () => {
    const { getByText, getByLabelText } = render(
      <CalendarMonth defaultValue={new Date('2026-05-15')} theme="light" />
    );

    fireEvent.press(getByLabelText('Next'));
    expect(getByText('June 2026')).toBeDefined();
  });

  it('selects date on day press', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <CalendarMonth
        defaultValue={new Date('2026-05-15')}
        onSelect={onSelect}
        theme="light"
      />
    );

    fireEvent.press(getByText('15'));
    expect(onSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it('calls onMonthChange when navigating', () => {
    const onMonthChange = jest.fn();
    const { getByLabelText } = render(
      <CalendarMonth
        defaultValue={new Date('2026-05-15')}
        onMonthChange={onMonthChange}
        theme="light"
      />
    );

    fireEvent.press(getByLabelText('Next'));
    expect(onMonthChange).toHaveBeenCalledWith(2026, 6);
  });
});
