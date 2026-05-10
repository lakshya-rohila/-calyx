import type { CalendarTheme } from './types';

export const lightTheme: CalendarTheme = {
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#E5E5E5',
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    selected: '#007AFF',
    selectedForeground: '#FFFFFF',
    today: '#007AFF',
    todayForeground: '#007AFF',
    disabled: '#D1D1D6',
    weekend: '#8E8E93',
    overflow: '#C7C7CC',
    hover: '#F2F2F7',
    pressed: '#E5E5EA',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '600',
  },
};

export const darkTheme: CalendarTheme = {
  colors: {
    background: '#1C1C1E',
    foreground: '#FFFFFF',
    border: '#38383A',
    primary: '#0A84FF',
    primaryForeground: '#FFFFFF',
    selected: '#0A84FF',
    selectedForeground: '#FFFFFF',
    today: '#0A84FF',
    todayForeground: '#0A84FF',
    disabled: '#48484A',
    weekend: '#8E8E93',
    overflow: '#636366',
    hover: '#2C2C2E',
    pressed: '#3A3A3C',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '600',
  },
};

export const oceanTheme: CalendarTheme = {
  colors: {
    background: '#F0F9FF',
    foreground: '#0C4A6E',
    border: '#BAE6FD',
    primary: '#0284C7',
    primaryForeground: '#FFFFFF',
    selected: '#0284C7',
    selectedForeground: '#FFFFFF',
    today: '#0EA5E9',
    todayForeground: '#0EA5E9',
    disabled: '#CBD5E1',
    weekend: '#64748B',
    overflow: '#94A3B8',
    hover: '#E0F2FE',
    pressed: '#BAE6FD',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '600',
  },
};

export const forestTheme: CalendarTheme = {
  colors: {
    background: '#F0FDF4',
    foreground: '#14532D',
    border: '#BBF7D0',
    primary: '#16A34A',
    primaryForeground: '#FFFFFF',
    selected: '#16A34A',
    selectedForeground: '#FFFFFF',
    today: '#22C55E',
    todayForeground: '#22C55E',
    disabled: '#D1D5DB',
    weekend: '#6B7280',
    overflow: '#9CA3AF',
    hover: '#DCFCE7',
    pressed: '#BBF7D0',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '600',
  },
};

export const sunsetTheme: CalendarTheme = {
  colors: {
    background: '#FFF7ED',
    foreground: '#7C2D12',
    border: '#FED7AA',
    primary: '#EA580C',
    primaryForeground: '#FFFFFF',
    selected: '#EA580C',
    selectedForeground: '#FFFFFF',
    today: '#F97316',
    todayForeground: '#F97316',
    disabled: '#D1D5DB',
    weekend: '#78716C',
    overflow: '#A8A29E',
    hover: '#FFEDD5',
    pressed: '#FED7AA',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '600',
  },
};

export const minimalTheme: CalendarTheme = {
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#000000',
    primary: '#000000',
    primaryForeground: '#FFFFFF',
    selected: '#000000',
    selectedForeground: '#FFFFFF',
    today: '#000000',
    todayForeground: '#000000',
    disabled: '#A3A3A3',
    weekend: '#525252',
    overflow: '#737373',
    hover: '#F5F5F5',
    pressed: '#E5E5E5',
  },
  spacing: {
    cellSize: 48,
    cellGap: 2,
    padding: 16,
    headerSpacing: 12,
  },
  borderRadius: {
    cell: 24,
    container: 12,
  },
  fontSize: {
    day: 16,
    weekday: 12,
    header: 20,
  },
  fontWeight: {
    regular: '400',
    bold: '700',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  minimal: minimalTheme,
};

export type ThemeName = keyof typeof themes;
