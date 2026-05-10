import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DayCell } from '../../src/components/primitives/DayCell';
import { themes } from '../../src/components/theme/themes';
import type { DayData } from '../../src/types';

const mockDay: DayData = {
  date: new Date('2026-05-10'),
  calendarDate: { year: 2026, month: 5, day: 10 },
  isToday: false,
  isWeekend: true,
  isCurrentMonth: true,
  dayOfWeek: 0,
};

describe('DayCell', () => {
  it('renders day number', () => {
    const { getByText } = render(
      <DayCell day={mockDay} theme={themes.light} />
    );

    expect(getByText('10')).toBeDefined();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DayCell day={mockDay} onPress={onPress} theme={themes.light} />
    );

    fireEvent.press(getByText('10'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies selected style', () => {
    const result = render(
      <DayCell day={mockDay} selected theme={themes.light} />
    );

    const cell = result.getByTestId('day-cell');
    const styleArray = Array.isArray(cell.props.style) ? cell.props.style : [cell.props.style];
    const flatStyle = Object.assign({}, ...styleArray);
    expect(flatStyle.backgroundColor).toBe(themes.light.colors.selected);
  });

  it('applies today style', () => {
    const todayDay = { ...mockDay, isToday: true };
    const result = render(
      <DayCell day={todayDay} theme={themes.light} />
    );

    const cell = result.getByTestId('day-cell');
    const styleArray = Array.isArray(cell.props.style) ? cell.props.style : [cell.props.style];
    const flatStyle = Object.assign({}, ...styleArray);
    expect(flatStyle.borderColor).toBe(themes.light.colors.today);
  });

  it('applies disabled style', () => {
    const { getByText } = render(
      <DayCell day={mockDay} disabled theme={themes.light} />
    );

    const text = getByText('10');
    const styleArray = Array.isArray(text.props.style) ? text.props.style : [text.props.style];
    const flatStyle = Object.assign({}, ...styleArray);
    expect(flatStyle.color).toBe(themes.light.colors.disabled);
  });

  it('applies overflow style for non-current month', () => {
    const overflowDay = { ...mockDay, isCurrentMonth: false };
    const { getByText } = render(
      <DayCell day={overflowDay} theme={themes.light} />
    );

    const text = getByText('10');
    const styleArray = Array.isArray(text.props.style) ? text.props.style : [text.props.style];
    const flatStyle = Object.assign({}, ...styleArray);
    expect(flatStyle.opacity).toBe(0.4);
  });

  it('has accessibility label', () => {
    const result = render(
      <DayCell day={mockDay} theme={themes.light} />
    );

    expect(result.getByLabelText(/10.*May.*2026.*Sunday/)).toBeDefined();
  });
});
