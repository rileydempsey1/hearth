import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { NotifPrefs } from '@/store/types';

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function requestPermission(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!supported) return 'unsupported';
  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return 'granted';
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

function insideQuiet(h: number, quiet: NotifPrefs['quiet']): boolean {
  if (!quiet.on) return false;
  const { from, to } = quiet;
  return from < to ? h >= from && h < to : h >= from || h < to;
}

const MORNING_BODIES = [
  'What is the one thing that would make today a good day?',
  'Two minutes of planning now buys back the morning.',
  'Open your spaces and pick today’s one thing.',
];
const EVENING_BODIES = [
  'Close the loops before they follow you home.',
  'One line about today keeps the streak alive.',
  'What happened today that future-you should know?',
];

/**
 * Reschedules everything from scratch. Called whenever notification prefs
 * change. Cancelling first keeps us idempotent.
 */
export async function rescheduleAll(prefs: NotifPrefs): Promise<void> {
  if (!supported) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!prefs.enabled || prefs.permission !== 'granted') return;

    const jobs: { title: string; body: string; hour: number; minute: number; weekday?: number }[] =
      [];

    if (prefs.morning.on && !insideQuiet(prefs.morning.h, prefs.quiet)) {
      jobs.push({
        title: 'Morning check-in',
        body: MORNING_BODIES[new Date().getDate() % MORNING_BODIES.length],
        hour: prefs.morning.h,
        minute: prefs.morning.m,
      });
    }
    if (prefs.evening.on && !insideQuiet(prefs.evening.h, prefs.quiet)) {
      jobs.push({
        title: 'Evening wrap-up',
        body: EVENING_BODIES[new Date().getDate() % EVENING_BODIES.length],
        hour: prefs.evening.h,
        minute: prefs.evening.m,
      });
    }
    if (prefs.weekly.on && !insideQuiet(prefs.weekly.h, prefs.quiet)) {
      jobs.push({
        title: 'Weekly review',
        body: 'Thirty minutes now buys back most of Monday.',
        hour: prefs.weekly.h,
        minute: prefs.weekly.m,
        weekday: prefs.weekly.weekday,
      });
    }

    await Promise.all(
      jobs.map((j) =>
        Notifications.scheduleNotificationAsync({
          content: { title: j.title, body: j.body, sound: false },
          trigger:
            j.weekday !== undefined
              ? ({
                  type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                  weekday: j.weekday,
                  hour: j.hour,
                  minute: j.minute,
                } as Notifications.WeeklyTriggerInput)
              : ({
                  type: Notifications.SchedulableTriggerInputTypes.DAILY,
                  hour: j.hour,
                  minute: j.minute,
                } as Notifications.DailyTriggerInput),
        })
      )
    );
  } catch {
    // Scheduling is best-effort; the settings UI reflects intent either way.
  }
}
