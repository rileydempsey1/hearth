import { Platform } from 'react-native';
import * as H from 'expo-haptics';

let enabled = true;
const supported = Platform.OS === 'ios' || Platform.OS === 'android';

export function setHapticsEnabled(v: boolean) {
  enabled = v;
}

const safe = (fn: () => Promise<unknown>) => {
  if (!enabled || !supported) return;
  fn().catch(() => {
    /* haptics are a nicety; never let them surface as an error */
  });
};

export const haptic = {
  tap: () => safe(() => H.impactAsync(H.ImpactFeedbackStyle.Light)),
  press: () => safe(() => H.impactAsync(H.ImpactFeedbackStyle.Medium)),
  heavy: () => safe(() => H.impactAsync(H.ImpactFeedbackStyle.Heavy)),
  select: () => safe(() => H.selectionAsync()),
  success: () => safe(() => H.notificationAsync(H.NotificationFeedbackType.Success)),
  warn: () => safe(() => H.notificationAsync(H.NotificationFeedbackType.Warning)),
  error: () => safe(() => H.notificationAsync(H.NotificationFeedbackType.Error)),
};
