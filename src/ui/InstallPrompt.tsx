import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Reveal, Tappable } from './motion';
import { Glass } from './surfaces';
import { Text } from './Text';
import { Button } from './controls';

const DISMISS_KEY = 'hearth.installPrompt.dismissedAt';
const REPROMPT_DAYS = 4;

function isStandalone(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return true;
  const nav = window.navigator as any;
  return (
    nav.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
  );
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && 'ontouchend' in document);
}

/**
 * Web only: invites the visitor to put Hearth on their home screen so it
 * runs full-screen like a native app. On Android/Chrome it triggers the
 * real install prompt; on iOS Safari it walks through Share → Add to
 * Home Screen (Apple offers no API for this).
 */
export function InstallPrompt() {
  const insets = useSafeAreaInsets();
  const { c, space, radius } = useTheme();
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<any>(null);
  const ios = isIOS();

  useEffect(() => {
    if (Platform.OS !== 'web' || isStandalone()) return;
    try {
      const at = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
      if (at && Date.now() - at < REPROMPT_DAYS * 86_400_000) return;
    } catch {
      /* private mode — just show it */
    }

    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    const timer = setTimeout(() => setVisible(true), 2200);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  if (Platform.OS !== 'web' || !visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* fine */
    }
  };

  const install = async () => {
    if (deferred) {
      deferred.prompt();
      try {
        await deferred.userChoice;
      } catch {
        /* user closed it */
      }
      dismiss();
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }]}
    >
      <Reveal from={40} style={{ padding: space.md, paddingBottom: insets.bottom + 96 }}>
        <Glass radiusKey="xl" intensity={44}>
          <View style={{ gap: space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: radius.sm,
                  backgroundColor: c.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 22 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="headline">Put Hearth on your Home Screen</Text>
                <Text variant="caption" color={c.textTertiary}>
                  Full screen, works offline — just like an app
                </Text>
              </View>
              <Tappable onPress={dismiss} feedback="tap" accessibilityLabel="Dismiss">
                <Icon name="x" size={18} color={c.textTertiary} />
              </Tappable>
            </View>

            {deferred ? (
              <Button label="Add to Home Screen" icon="download" onPress={install} size="md" />
            ) : ios ? (
              <View style={{ gap: 8 }}>
                {[
                  ['share', 'Tap the Share button in Safari’s toolbar'],
                  ['plus-square', 'Choose “Add to Home Screen”'],
                  ['zap', 'Open Hearth from your Home Screen'],
                ].map(([icon, label], i) => (
                  <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: c.accentSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text variant="caption" color={c.accentText}>
                        {i + 1}
                      </Text>
                    </View>
                    <Icon name={icon as any} size={15} color={c.accentText} />
                    <Text variant="footnote" color={c.textSecondary} style={{ flex: 1 }}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text variant="footnote" color={c.textSecondary}>
                Open your browser’s menu and choose “Add to Home Screen” or “Install app”.
              </Text>
            )}
          </View>
        </Glass>
      </Reveal>
    </View>
  );
}
