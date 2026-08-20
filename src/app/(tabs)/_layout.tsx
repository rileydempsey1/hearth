import { BlurView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from '@/ui/Icon';
import { InstallPrompt } from '@/ui/InstallPrompt';

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        width: 44,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? c.accentSoft : 'transparent',
      }}
    >
      <Icon name={name} size={20} color={focused ? c.accentText : c.textTertiary} />
    </View>
  );
}

export default function TabsLayout() {
  const { c, mode } = useTheme();
  const { onboarded, hydrated } = useStore();

  if (hydrated && !onboarded) return <Redirect href="/onboarding" />;

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accentText,
        tabBarInactiveTintColor: c.textTertiary,
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontSize: 10.5,
          marginTop: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: c.border,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : c.surface,
          elevation: 0,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 6,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <View style={StyleSheet.absoluteFill}>
              <BlurView
                intensity={40}
                tint={mode === 'dark' ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: c.glass }]} />
            </View>
          ) : null,
        sceneStyle: { backgroundColor: c.canvas },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon name="sun" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="spaces"
        options={{
          title: 'Spaces',
          tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused }) => <TabIcon name="check-circle" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ focused }) => <TabIcon name="book-open" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: 'You',
          tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
        }}
      />
    </Tabs>
    <InstallPrompt />
    </View>
  );
}
