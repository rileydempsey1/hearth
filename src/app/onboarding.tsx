import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rescheduleAll, requestPermission } from '@/lib/notifications';
import { haptic } from '@/lib/haptics';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor, HUES } from '@/theme/tokens';
import { Button, Chip, Field } from '@/ui/controls';
import { Icon, IconName } from '@/ui/Icon';
import { Reveal, Tappable } from '@/ui/motion';
import { Aurora, Card } from '@/ui/surfaces';
import { Text } from '@/ui/Text';

const ROLES = ['Founder', 'Manager', 'Engineer', 'Designer', 'Marketer', 'Ops', 'Student', 'Other'];
const FOCUS: { key: string; label: string; icon: IconName }[] = [
  { key: 'writing', label: 'Clearer writing', icon: 'edit-3' },
  { key: 'meetings', label: 'Fewer, better meetings', icon: 'users' },
  { key: 'focus', label: 'Protecting focus', icon: 'target' },
  { key: 'projects', label: 'Running projects', icon: 'layers' },
  { key: 'leading', label: 'Leading people', icon: 'compass' },
  { key: 'memory', label: 'Remembering decisions', icon: 'bookmark' },
];

const STARTER_SPACES = [
  { name: 'My work', emoji: '🔥', hue: 'ember' as const, purpose: 'The main thread of what I am building' },
  { name: 'Decisions', emoji: '🧭', hue: 'iris' as const, purpose: 'Choices made, and why' },
  { name: 'Someday', emoji: '🌱', hue: 'mint' as const, purpose: 'Ideas that are not ready yet' },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { c, space, radius, type } = useTheme();
  const store = useStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [focus, setFocus] = useState<string[]>([]);
  const [wantsSpaces, setWantsSpaces] = useState(true);
  const [notifChoice, setNotifChoice] = useState<'pending' | 'on' | 'later'>('pending');
  const scrollRef = useRef<ScrollView>(null);

  const steps = useMemo(() => ['welcome', 'name', 'focus', 'spaces', 'reminders'] as const, []);
  const last = step === steps.length - 1;

  const go = (n: number) => setStep(n);

  const finish = async () => {
    if (wantsSpaces) {
      for (const sp of STARTER_SPACES) store.addSpace(sp);
    }
    if (notifChoice === 'on') {
      const perm = await requestPermission();
      store.setNotif({ enabled: perm === 'granted', permission: perm });
      if (perm === 'granted') {
        await rescheduleAll({ ...store.s.notif, enabled: true, permission: perm });
      }
    }
    store.completeOnboarding({
      name: name.trim() || 'there',
      role: role || 'Other',
      focus,
    });
    haptic.success();
    router.replace('/(tabs)');
  };

  const Dots = () => (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {steps.map((_, i) => (
        <View
          key={i}
          style={{
            width: i === step ? 22 : 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: i === step ? c.accent : c.borderStrong,
          }}
        />
      ))}
    </View>
  );

  const pages: React.ReactNode[] = [];
  const page = (children: React.ReactNode) => {
    pages.push(children);
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <Aurora intensity={1.35} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1 }}>
          <View style={{ display: 'none' }}>
          {/* 1 — welcome */}
          {page(
            <View style={{ flex: 1, justifyContent: 'center', gap: space.lg, paddingBottom: 120 }}>
              <Reveal delay={80}>
                <View
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 28,
                    backgroundColor: c.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: c.accent,
                    shadowOpacity: 0.45,
                    shadowRadius: 24,
                    shadowOffset: { width: 0, height: 10 },
                  }}
                >
                  <Text style={{ fontSize: 40 }}>🔥</Text>
                </View>
              </Reveal>
              <Reveal delay={180}>
                <Text variant="hero">Your work,{'\n'}finally in one place.</Text>
              </Reveal>
              <Reveal delay={280}>
                <Text variant="body" color={c.textSecondary}>
                  Hearth is a calm home for everything you are working on — spaces for each
                  project, a running log of decisions, your tasks, and a library of playbooks
                  for working well. All of it private, on this device.
                </Text>
              </Reveal>
              <Reveal delay={380}>
                <View style={{ gap: 10 }}>
                  {[
                    ['zap', 'No account. No signup. Works offline.'],
                    ['lock', 'Everything stays on your phone.'],
                    ['bell', 'Notifications only if — and when — you ask.'],
                  ].map(([icon, label]) => (
                    <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Icon name={icon as IconName} size={15} color={c.accent} />
                      <Text variant="footnote" color={c.textSecondary}>
                        {label}
                      </Text>
                    </View>
                  ))}
                </View>
              </Reveal>
            </View>
          )}

          {/* 2 — name & role */}
          {page(
            <View style={{ flex: 1, gap: space.lg, paddingTop: space.xl }}>
              <Text variant="title1">First, a hello.</Text>
              <Text variant="body" color={c.textSecondary}>
                This stays on your device — it just makes the app feel like yours.
              </Text>
              <Field
                label="What should we call you?"
                placeholder="Your first name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="done"
              />
              <View style={{ gap: 8 }}>
                <Text variant="eyebrow" color={c.textTertiary}>
                  What best describes you?
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {ROLES.map((r) => (
                    <Chip key={r} label={r} active={role === r} onPress={() => setRole(r)} />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* 3 — focus */}
          {page(
            <View style={{ flex: 1, gap: space.lg, paddingTop: space.xl }}>
              <Text variant="title1">What are you trying to get better at?</Text>
              <Text variant="body" color={c.textSecondary}>
                Pick as many as you like. Your library leads with these.
              </Text>
              <View style={{ gap: 10 }}>
                {FOCUS.map((f, i) => {
                  const active = focus.includes(f.key);
                  return (
                    <Reveal key={f.key} delay={i * 60}>
                      <Tappable
                        onPress={() =>
                          setFocus((p) =>
                            active ? p.filter((x) => x !== f.key) : [...p, f.key]
                          )
                        }
                        feedback="select"
                        scaleTo={0.98}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: space.sm,
                            padding: space.md,
                            borderRadius: radius.md,
                            backgroundColor: active ? c.accentSoft : c.surface,
                            borderWidth: active ? 1.5 : StyleSheet.hairlineWidth,
                            borderColor: active ? c.accent : c.border,
                          }}
                        >
                          <Icon name={f.icon} size={18} color={active ? c.accentText : c.textSecondary} />
                          <Text variant="bodyMedium" color={active ? c.accentText : c.text} style={{ flex: 1 }}>
                            {f.label}
                          </Text>
                          {active ? <Icon name="check" size={16} color={c.accentText} /> : null}
                        </View>
                      </Tappable>
                    </Reveal>
                  );
                })}
              </View>
            </View>
          )}

          {/* 4 — starter spaces */}
          {page(
            <View style={{ flex: 1, gap: space.lg, paddingTop: space.xl }}>
              <Text variant="title1">Start with a few spaces?</Text>
              <Text variant="body" color={c.textSecondary}>
                Spaces are where your work lives — one per project or theme. We can set up
                three sensible ones, or you can start from a blank slate.
              </Text>
              <View style={{ gap: 10 }}>
                {STARTER_SPACES.map((sp, i) => {
                  const tone = hueColor(c, sp.hue);
                  return (
                    <Reveal key={sp.name} delay={i * 70}>
                      <Card style={{ opacity: wantsSpaces ? 1 : 0.4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                          <View
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: radius.sm,
                              backgroundColor: tone.bg,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={{ fontSize: 20 }}>{sp.emoji}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text variant="headline">{sp.name}</Text>
                            <Text variant="caption" color={c.textTertiary}>
                              {sp.purpose}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    </Reveal>
                  );
                })}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Chip
                  label="Set these up for me"
                  active={wantsSpaces}
                  onPress={() => setWantsSpaces(true)}
                  icon="check"
                />
                <Chip
                  label="Blank slate"
                  active={!wantsSpaces}
                  onPress={() => setWantsSpaces(false)}
                />
              </View>
            </View>
          )}

          {/* 5 — reminders */}
          {page(
            <View style={{ flex: 1, gap: space.lg, paddingTop: space.xl }}>
              <Text variant="title1">Reminders, on your terms.</Text>
              <Text variant="body" color={c.textSecondary}>
                Hearth can nudge you once in the morning to plan the day, and once in the
                evening to close it out. You pick the times, nothing is on by default, and
                quiet hours are respected. That is the whole notification story — no floods,
                ever.
              </Text>
              <View style={{ gap: 10 }}>
                <Tappable onPress={() => setNotifChoice('on')} feedback="select" scaleTo={0.98}>
                  <View
                    style={{
                      padding: space.md,
                      borderRadius: radius.md,
                      backgroundColor: notifChoice === 'on' ? c.accentSoft : c.surface,
                      borderWidth: notifChoice === 'on' ? 1.5 : StyleSheet.hairlineWidth,
                      borderColor: notifChoice === 'on' ? c.accent : c.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: space.sm,
                    }}
                  >
                    <Icon name="bell" size={18} color={notifChoice === 'on' ? c.accentText : c.textSecondary} />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyMedium">A morning check-in at 8:30</Text>
                      <Text variant="caption" color={c.textTertiary}>
                        Change or turn off any time in Settings
                      </Text>
                    </View>
                  </View>
                </Tappable>
                <Tappable onPress={() => setNotifChoice('later')} feedback="select" scaleTo={0.98}>
                  <View
                    style={{
                      padding: space.md,
                      borderRadius: radius.md,
                      backgroundColor: notifChoice === 'later' ? c.accentSoft : c.surface,
                      borderWidth: notifChoice === 'later' ? 1.5 : StyleSheet.hairlineWidth,
                      borderColor: notifChoice === 'later' ? c.accent : c.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: space.sm,
                    }}
                  >
                    <Icon name="bell-off" size={18} color={notifChoice === 'later' ? c.accentText : c.textSecondary} />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyMedium">Maybe later</Text>
                      <Text variant="caption" color={c.textTertiary}>
                        Hearth stays silent until you say otherwise
                      </Text>
                    </View>
                  </View>
                </Tappable>
              </View>
            </View>
          )}
          </View>
          <ScrollView
            key={step}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: insets.top + space.xxl,
              paddingHorizontal: space.xl,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Reveal from={18} style={{ flex: 1 }}>
              {pages[step]}
            </Reveal>
          </ScrollView>
        </View>

        <View
          style={{
            paddingHorizontal: space.xl,
            paddingBottom: insets.bottom + space.lg,
            gap: space.md,
          }}
        >
          <Dots />
          <Button
            label={last ? 'Light the fire' : step === 0 ? 'Get started' : 'Continue'}
            icon={last ? 'zap' : 'arrow-right'}
            onPress={() => (last ? finish() : go(step + 1))}
            disabled={last && notifChoice === 'pending'}
          />
          {step > 0 ? (
            <Text
              variant="footnote"
              color={c.textTertiary}
              center
              onPress={() => go(step - 1)}
              suppressHighlighting
            >
              Back
            </Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
