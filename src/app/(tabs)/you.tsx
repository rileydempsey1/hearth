import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { PLAYBOOKS } from '@/content';
import { addDays, dayKey, formatTime, WEEKDAYS } from '@/lib/date';
import { haptic } from '@/lib/haptics';
import { rescheduleAll, requestPermission } from '@/lib/notifications';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { Chip, Segmented, TimePicker, Toggle } from '@/ui/controls';
import { Icon } from '@/ui/Icon';
import { isWeb, Reveal, Tappable } from '@/ui/motion';
import { Card, Glass } from '@/ui/surfaces';
import { Group, Row, Screen, SectionHeader } from '@/ui/layout';
import { Text } from '@/ui/Text';

export default function You() {
  const router = useRouter();
  const { c, mode, space, radius } = useTheme();
  const store = useStore();
  const { s } = store;
  const [expanded, setExpanded] = useState<'morning' | 'evening' | 'weekly' | null>(null);

  const stats = useMemo(() => {
    const entries = s.entries.length;
    const tasksDone = s.tasks.filter((t) => t.done).length;
    const read = s.readPlaybooks.filter((id) => PLAYBOOKS.some((p) => p.id === id)).length;
    return { entries, tasksDone, read };
  }, [s.entries, s.tasks, s.readPlaybooks]);

  // Last 14 days of activity for the mini heat strip.
  const strip = useMemo(() => {
    const today = dayKey();
    const days: { key: string; active: boolean }[] = [];
    for (let i = 13; i >= 0; i--) {
      const k = addDays(today, -i);
      days.push({ key: k, active: s.streak.days.includes(k) });
    }
    return days;
  }, [s.streak.days]);

  const setNotifAndSchedule = async (patch: Partial<typeof s.notif>) => {
    const next = { ...s.notif, ...patch };
    store.setNotif(patch);
    await rescheduleAll(next);
  };

  const toggleMaster = async (on: boolean) => {
    if (!on) {
      await setNotifAndSchedule({ enabled: false });
      return;
    }
    const perm = await requestPermission();
    if (perm === 'granted') {
      await setNotifAndSchedule({ enabled: true, permission: perm });
      haptic.success();
    } else {
      store.setNotif({ permission: perm });
      if (perm === 'denied' && !isWeb) {
        Alert.alert(
          'Notifications are off for Hearth',
          'Turn them on in iOS Settings and try again.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    }
  };

  const confirmErase = () => {
    if (isWeb) {
      store.eraseEverything();
      return;
    }
    Alert.alert(
      'Erase everything?',
      'All spaces, entries, tasks and settings on this device will be deleted. There is no cloud copy and no undo.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase',
          style: 'destructive',
          onPress: async () => {
            await store.eraseEverything();
            haptic.warn();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const TimeRow = ({
    id,
    icon,
    title,
    conf,
    patch,
  }: {
    id: 'morning' | 'evening' | 'weekly';
    icon: any;
    title: string;
    conf: { on: boolean; h: number; m: number; weekday?: number };
    patch: (p: any) => Promise<void>;
  }) => (
    <View>
      <Row
        icon={icon}
        title={title}
        subtitle={
          conf.on
            ? `${conf.weekday !== undefined ? WEEKDAYS[(conf.weekday - 1 + 7) % 7] + 's, ' : 'Daily, '}${formatTime(conf.h, conf.m)}`
            : 'Off'
        }
        right={
          <Toggle
            value={conf.on}
            onChange={(v) => {
              patch({ on: v });
              if (v) setExpanded(id);
            }}
            accessibilityLabel={title}
          />
        }
        onPress={() => setExpanded(expanded === id ? null : id)}
      />
      {expanded === id && conf.on ? (
        <View style={{ paddingHorizontal: space.md, paddingBottom: space.md, gap: space.sm }}>
          <TimePicker h={conf.h} m={conf.m} onChange={(h, m) => patch({ h, m })} />
          {conf.weekday !== undefined ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {WEEKDAYS.map((d, i) => (
                <Chip
                  key={d}
                  small
                  label={d}
                  active={conf.weekday === i + 1}
                  onPress={() => patch({ weekday: i + 1 })}
                />
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  return (
    <Screen scroll contentStyle={{ gap: space.md, paddingBottom: 130 }}>
      <Reveal>
        <View style={{ marginTop: space.sm }}>
          <Text variant="title1">
            {s.user.name || 'You'}
          </Text>
          <Text variant="footnote" color={c.textTertiary} style={{ marginTop: 2 }}>
            {s.user.role || 'Working well'} · everything on this device
          </Text>
        </View>
      </Reveal>

      {/* Streak + stats */}
      <Reveal delay={60}>
        <Glass>
          <View style={{ gap: space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.md,
                  backgroundColor: c.amberSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 26 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="numeral">{s.streak.current}</Text>
                <Text variant="footnote" color={c.textSecondary}>
                  day streak · longest {s.streak.longest}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {strip.map((d) => (
                <View
                  key={d.key}
                  style={{
                    flex: 1,
                    height: 26,
                    borderRadius: 6,
                    backgroundColor: d.active ? c.accent : c.skeleton,
                    opacity: d.active ? 0.9 : 1,
                  }}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: space.xs,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: c.border,
              }}
            >
              {(
                [
                  [stats.entries, 'entries'],
                  [stats.tasksDone, 'tasks done'],
                  [stats.read, 'playbooks read'],
                ] as [number, string][]
              ).map(([n, label]) => (
                <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                  <Text variant="title3">{n}</Text>
                  <Text variant="caption" color={c.textTertiary}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Glass>
      </Reveal>

      {/* Premium */}
      <Reveal delay={100}>
        {s.premium.isPremium ? (
          <Card tint={c.accentSofter} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
            <Icon name="award" size={20} color={c.accentText} />
            <View style={{ flex: 1 }}>
              <Text variant="headline">Hearth Pro is active</Text>
              <Text variant="caption" color={c.textTertiary}>
                {s.premium.plan === 'yearly' ? 'Yearly plan' : 'Weekly plan'} · thanks for the support
              </Text>
            </View>
          </Card>
        ) : (
          <Tappable onPress={() => router.push('/paywall')} scaleTo={0.98}>
            <Card
              level={2}
              style={{
                backgroundColor: mode === 'dark' ? '#241A12' : '#2A1C12',
                borderColor: 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                gap: space.sm,
              }}
            >
              <Text style={{ fontSize: 24 }}>🔥</Text>
              <View style={{ flex: 1 }}>
                <Text variant="headline" color="#F6EDE4">
                  Upgrade to Hearth Pro
                </Text>
                <Text variant="caption" color="rgba(246,237,228,0.65)">
                  Unlimited spaces · full library · 7 days free
                </Text>
              </View>
              <Icon name="arrow-right" size={17} color="#F6EDE4" />
            </Card>
          </Tappable>
        )}
      </Reveal>

      {/* Reminders */}
      <Reveal delay={140}>
        <SectionHeader title="Daily reminders" icon="bell" />
        <Group>
          <Row
            icon="bell"
            title="Reminders"
            subtitle={
              s.notif.enabled
                ? 'On — only what you schedule below'
                : s.notif.permission === 'denied'
                  ? 'Blocked in system settings'
                  : 'Off — Hearth stays silent'
            }
            right={<Toggle value={s.notif.enabled} onChange={toggleMaster} accessibilityLabel="Reminders" />}
          />
          {s.notif.enabled ? (
            <>
              <TimeRow
                id="morning"
                icon="sunrise"
                title="Morning check-in"
                conf={s.notif.morning}
                patch={(p) => setNotifAndSchedule({ morning: { ...s.notif.morning, ...p } })}
              />
              <TimeRow
                id="evening"
                icon="sunset"
                title="Evening wrap-up"
                conf={s.notif.evening}
                patch={(p) => setNotifAndSchedule({ evening: { ...s.notif.evening, ...p } })}
              />
              <TimeRow
                id="weekly"
                icon="calendar"
                title="Weekly review"
                conf={s.notif.weekly}
                patch={(p) => setNotifAndSchedule({ weekly: { ...s.notif.weekly, ...p } })}
              />
            </>
          ) : null}
        </Group>
      </Reveal>

      {/* Appearance */}
      <Reveal delay={180}>
        <SectionHeader title="Appearance" icon="sliders" />
        <Card style={{ gap: space.sm }}>
          <Text variant="eyebrow" color={c.textTertiary}>
            Theme
          </Text>
          <Segmented
            options={[
              { key: 'system', label: 'System' },
              { key: 'light', label: 'Light' },
              { key: 'dark', label: 'Dark' },
            ]}
            value={s.prefs.theme}
            onChange={(t) => store.setTheme(t)}
          />
        </Card>
        <View style={{ height: space.xs }} />
        <Group>
          <Row
            icon="smartphone"
            title="Haptic feedback"
            right={
              <Toggle
                value={s.prefs.hapticsOn}
                onChange={(v) => store.setPrefs({ hapticsOn: v })}
                accessibilityLabel="Haptics"
              />
            }
          />
        </Group>
      </Reveal>

      {/* Data */}
      <Reveal delay={220}>
        <SectionHeader title="Your data" icon="shield" />
        <Group>
          <Row
            icon="hard-drive"
            title="Everything lives on this device"
            subtitle="No account, no cloud, no analytics. Deleting the app deletes the data."
          />
          <Row icon="trash-2" title="Erase everything" danger onPress={confirmErase} />
        </Group>
      </Reveal>

      <Reveal delay={260}>
        <Text variant="caption" color={c.textTertiary} center style={{ marginTop: space.sm }}>
          Hearth 1.0 · made to be calm
        </Text>
      </Reveal>
    </Screen>
  );
}
