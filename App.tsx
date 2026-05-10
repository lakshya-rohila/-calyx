import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  useColorScheme,
} from 'react-native';
import { CalendarDemo } from './example/screens/CalendarDemo';
import { ThemeSwitcher } from './example/screens/ThemeSwitcher';
import { CustomizationDemo } from './example/screens/CustomizationDemo';
import { CalendarWithAPIDemo } from './example/screens/CalendarWithAPIDemo';
import { TimelineDemo } from './example/screens/TimelineDemo';
import { AgendaDemo } from './example/screens/AgendaDemo';

type TabKey = 'demo' | 'themes' | 'custom' | 'timeline' | 'agenda';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<TabKey>('demo');

  const renderContent = () => {
    switch (activeTab) {
      case 'demo':
        return <CalendarDemo />;
      case 'themes':
        return <ThemeSwitcher />;
      case 'custom':
        return <CustomizationDemo />;
      case 'timeline':
        return <TimelineDemo />;
      case 'agenda':
        return <AgendaDemo />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calyx RN </Text>
      </View>

      <View style={styles.tabs}>
        <TabButton
          label="Demo"
          active={activeTab === 'demo'}
          onPress={() => setActiveTab('demo')}
        />
        <TabButton
          label="Timeline"
          active={activeTab === 'timeline'}
          onPress={() => setActiveTab('timeline')}
        />
        <TabButton
          label="Agenda"
          active={activeTab === 'agenda'}
          onPress={() => setActiveTab('agenda')}
        />
        <TabButton
          label="Themes"
          active={activeTab === 'themes'}
          onPress={() => setActiveTab('themes')}
        />
        <TabButton
          label="Custom"
          active={activeTab === 'custom'}
          onPress={() => setActiveTab('custom')}
        />
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text
        style={[styles.tabText, active && styles.tabTextActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});

export default App;
