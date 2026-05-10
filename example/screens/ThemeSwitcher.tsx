import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Calendar, ThemeProvider, themes } from '../../src';
import type { ThemeName } from '../../src';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>('light');
  const themeNames: ThemeName[] = ['light', 'dark', 'ocean', 'forest', 'sunset', 'minimal'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Theme Switcher</Text>

      <View style={styles.themeButtons}>
        {themeNames.map((name) => (
          <Button
            key={name}
            title={name}
            onPress={() => setTheme(name)}
            color={theme === name ? '#007AFF' : '#999'}
          />
        ))}
      </View>

      <ThemeProvider theme={theme}>
        <Calendar mode="month" />
      </ThemeProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  themeButtons: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
});
