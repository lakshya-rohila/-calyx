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
import { BasicExample } from './example/screens/BasicExample';
import { MonthExample } from './example/screens/MonthExample';
import { WeekExample } from './example/screens/WeekExample';

type TabKey = 'basic' | 'month' | 'week';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<TabKey>('basic');

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicExample />;
      case 'month':
        return <MonthExample />;
      case 'week':
        return <WeekExample />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calyx RN - Phase 1</Text>
      </View>

      <View style={styles.tabs}>
        <TabButton
          label="Basic"
          active={activeTab === 'basic'}
          onPress={() => setActiveTab('basic')}
        />
        <TabButton
          label="Month"
          active={activeTab === 'month'}
          onPress={() => setActiveTab('month')}
        />
        <TabButton
          label="Week"
          active={activeTab === 'week'}
          onPress={() => setActiveTab('week')}
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
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
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
    padding: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
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
