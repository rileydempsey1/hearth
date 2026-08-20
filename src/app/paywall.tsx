import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptic } from '@/lib/haptics';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, IconButton } from '@/ui/controls';
import { Icon, IconName } from '@/ui/Icon';
import { Confetti, isWeb, Reveal, Tappable } from '@/ui/motion';
import { Aurora, Card } from '@/ui/surfaces';
import { Text } from '@/ui/Text';

const PERKS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'grid', title: 'Unlimited spaces', body: 'The free tier holds three. Pro removes the ceiling.' },
  { icon: 'book-open', title: 'The full library', body: 'Every advanced playbook, including all new ones.' },
  { icon: 'trending-up', title: 'Insights', body: 'Your streak history and activity, beautifully charted.' },
  { icon: 'heart', title: 'Support the work', body: 'Hearth has no ads and sells no data. Pro is the business model.' },
];

export default function Paywall() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const insets = useSafeAreaInsets();
  const { c, mode, space, radius, elev } = useTheme();
  const store = useStore();

  const [plan, setPlan] = useState<'yearly' | 'weekly'>('yearly');
  const [processing, setProcessing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [burst, setBurst] = useState(0);

  const subscribe = () => {
    setProcessing(true);
    // Mocked purchase: a short beat so the transition feels deliberate.
    setTimeout(() => {
      store.unlockPremium(plan);
      setProcessing(false);
      setUnlocked(true);
      setBurst(Date.now());
      haptic.success();
    }, 900);
  };

  const restore = () => {
    const found = store.restorePremium();
    if (isWeb) return;
    if (found) {
      Alert.alert('Restored', 'Your Pro unlock was found on this device.');
    } else {
      Alert.alert('Nothing to restore', 'No previous purchase was found on this device.');
    }
  };

  const headline =
    reason === 'spaces'
      ? 'Your fourth space is ready when you are'
      : reason === 'playbook'
        ? 'Go deeper than the basics'
        : 'Do your best work, calmly';

  if (unlocked) {
    return (
      <View style={{ flex: 1, backgroundColor: c.canvas }}>
        <Aurora intensity={1.6} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: space.xl,
            gap: space.md,
          }}
        >
          <Reveal from={26}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 32,
                backgroundColor: c.accent,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: c.accent,
                shadowOpacity: 0.5,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 12 },
              }}
            >
              <Text style={{ fontSize: 46 }}>🔥</Text>
            </View>
          </Reveal>
          <Reveal delay={120}>
            <Text variant="hero" center>
              Welcome to Pro.
            </Text>
          </Reveal>
          <Reveal delay={220}>
            <Text variant="body" color={c.textSecondary} center style={{ maxWidth: 300 }}>
              Everything is unlocked — every playbook, unlimited spaces, and insights. Enjoy the
              quiet.
            </Text>
          </Reveal>
          <Reveal delay={320} style={{ alignSelf: 'stretch', marginTop: space.md }}>
            <Button label="Start exploring" icon="arrow-right" onPress={() => router.back()} />
          </Reveal>
        </View>
        <Confetti fireKey={burst} count={64} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <Aurora intensity={1.3} />
      <ScrollView
        contentContainerStyle={{
          padding: space.xl,
          paddingTop: space.xl,
          paddingBottom: insets.bottom + space.xl,
          gap: space.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <IconButton name="x" onPress={() => router.back()} accessibilityLabel="Close" />
        </View>

        <Reveal>
          <View style={{ gap: 8 }}>
            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: c.accentSoft,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: radius.pill,
              }}
            >
              <Text style={{ fontSize: 13 }}>🔥</Text>
              <Text variant="caption" color={c.accentText}>
                HEARTH PRO
              </Text>
            </View>
            <Text variant="hero">{headline}</Text>
          </View>
        </Reveal>

        <View style={{ gap: 10 }}>
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={80 + i * 70}>
              <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: radius.sm,
                    backgroundColor: c.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={p.icon} size={17} color={c.accentText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="headline">{p.title}</Text>
                  <Text variant="callout" color={c.textSecondary}>
                    {p.body}
                  </Text>
                </View>
              </View>
            </Reveal>
          ))}
        </View>

        {/* Plans */}
        <Reveal delay={380}>
          <View style={{ gap: 10, marginTop: space.xs }}>
            <Tappable onPress={() => setPlan('yearly')} feedback="select" scaleTo={0.985}>
              <View
                style={[
                  {
                    borderRadius: radius.lg,
                    padding: space.md,
                    backgroundColor: c.surface,
                    borderWidth: plan === 'yearly' ? 2 : StyleSheet.hairlineWidth,
                    borderColor: plan === 'yearly' ? c.accent : c.border,
                  },
                  plan === 'yearly' ? elev(2) : null,
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: plan === 'yearly' ? c.accent : c.borderStrong,
                      backgroundColor: plan === 'yearly' ? c.accent : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {plan === 'yearly' ? <Icon name="check" size={12} color={c.onAccent} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text variant="headline">Yearly</Text>
                      <View
                        style={{
                          backgroundColor: c.mintSoft,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: radius.pill,
                        }}
                      >
                        <Text variant="caption" color={c.mint}>
                          7 DAYS FREE · SAVE 78%
                        </Text>
                      </View>
                    </View>
                    <Text variant="caption" color={c.textTertiary}>
                      $39.99 / year — about $0.77 a week
                    </Text>
                  </View>
                </View>
              </View>
            </Tappable>

            <Tappable onPress={() => setPlan('weekly')} feedback="select" scaleTo={0.985}>
              <View
                style={{
                  borderRadius: radius.lg,
                  padding: space.md,
                  backgroundColor: c.surface,
                  borderWidth: plan === 'weekly' ? 2 : StyleSheet.hairlineWidth,
                  borderColor: plan === 'weekly' ? c.accent : c.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: plan === 'weekly' ? c.accent : c.borderStrong,
                      backgroundColor: plan === 'weekly' ? c.accent : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {plan === 'weekly' ? <Icon name="check" size={12} color={c.onAccent} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="headline">Weekly</Text>
                    <Text variant="caption" color={c.textTertiary}>
                      $3.49 / week — cancel any time
                    </Text>
                  </View>
                </View>
              </View>
            </Tappable>
          </View>
        </Reveal>

        <Reveal delay={440}>
          <View style={{ gap: space.sm, marginTop: space.xs }}>
            <Button
              label={plan === 'yearly' ? 'Start 7 days free' : 'Continue'}
              icon="arrow-right"
              onPress={subscribe}
              loading={processing}
            />
            <Text variant="caption" color={c.textTertiary} center>
              {plan === 'yearly'
                ? 'Free for 7 days, then $39.99/year. Cancel any time.'
                : '$3.49/week, billed weekly. Cancel any time.'}
            </Text>
            <Text
              variant="footnote"
              color={c.accentText}
              center
              onPress={restore}
              suppressHighlighting
              style={{ paddingVertical: 6 }}
            >
              Restore purchase
            </Text>
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}
