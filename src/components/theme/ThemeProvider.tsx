import React, { createContext, useContext } from 'react';
import type { CalendarTheme } from './types';
import { themes, type ThemeName } from './themes';

const ThemeContext = createContext<CalendarTheme | null>(null);

type ThemeProviderProps = {
  theme: CalendarTheme | ThemeName;
  children: React.ReactNode;
};

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const resolvedTheme = typeof theme === 'string' ? themes[theme] : theme;

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): CalendarTheme {
  const theme = useContext(ThemeContext);

  // Default to light theme if no provider
  if (!theme) {
    return themes.light;
  }

  return theme;
}
