import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../../../src/components/theme';
import { themes } from '../../../src/components/theme/themes';

function ThemeConsumer() {
  const theme = useTheme();
  return <Text testID="theme-bg">{theme.colors.background}</Text>;
}

describe('ThemeProvider', () => {
  it('provides light theme by default', () => {
    const result = render(
      <ThemeProvider theme="light">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(result.getByTestId('theme-bg').props.children).toBe('#FFFFFF');
  });

  it('provides dark theme when specified', () => {
    const result = render(
      <ThemeProvider theme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(result.getByTestId('theme-bg').props.children).toBe('#1C1C1E');
  });

  it('provides custom theme object', () => {
    const customTheme = { ...themes.light, colors: { ...themes.light.colors, background: '#FF0000' } };
    const result = render(
      <ThemeProvider theme={customTheme}>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(result.getByTestId('theme-bg').props.children).toBe('#FF0000');
  });

  it('returns light theme when no provider', () => {
    const result = render(<ThemeConsumer />);

    expect(result.getByTestId('theme-bg').props.children).toBe('#FFFFFF');
  });
});
