import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { dailyPlaybook, getPlaybook } from '@/content';
import { dailyPrompt } from '@/content/quotes';
import { dayKey, dueState, greeting, relativeTime } from '@/lib/date';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { ENTRY_KINDS } from '@/store/types';
import { IconButton, Chip } from '@/ui/controls';
import { Icon } from '@/ui/Icon';
import { Confetti, Reveal, Tappable } from '@/ui/motion';
import { Card, Glass } from '@/ui/surfaces';
import { Screen, SectionHeader, EmptyState, ProgressRing, SkeletonCard } from '@/ui/layout';
import { Text } from '@/ui/Text';

export default function Today() {
  const router = useRouter();
  const { c, mode, space, radius } = useTheme();
  const store = useStore();
  const { s, hydrated } = store;
  const [burst, setBurst] = useState(0);

  const today = dayKey();
  const playbook = useMemo(() => dailyPlaybook(today), [today]);
  const prompt = useMemo(() => dailyPrompt(today), [today]);

  const openTasks = useMemo(
    () =>
      s.tasks
        .filter((t) => !t.done)
        .sort((a, b) => {
          const rank = { overdue: 0, today: 1, soon: 2, later: 3, none: 4 };
          const d = rank[dueState(a.due)] - rank[dueState(b.due)];
          if (d !== 0) return d;
          const pr = { high: 0, med: 1, low: 2 };
          return pr[a.priority] - pr[b.priority];
        })
        .slice(0, 4),
    [s.tasks]
  );

  const doneToday = s.tasks.filter((t) => t.done && t.doneAt && dayKey(t.doneAt) === today).length;
  const dueToday = s.tasks.filter((t) => !t.done && t.due === today).length;
  const totalToday = doneToday + dueToday;

  const recentEntries = useMemo(
    () =>
      [...s.entries]
        .filter((e) => !e.parentId)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3),
    [s.entries]
  );

  const spaceById = (id: string) => s.spaces.find((x) => x.id === id);

  if (!hydrated) {
    return (
      <Screen scroll contentStyle={{ gap: space.md, paddingBottom: 120 }}>
        <View style={{ height: 60 }} />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Screen>
    );
  }

  return (
    <>
      <Screen scroll contentStyle={{ gap: space.md, paddingBottom: 130 }}>
        {store.storageError ? (
          <Reveal>
            <Card tint={c.roseSoft} style={{ borderColor: 'transparent', flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: space.sm }}>
              <Icon name="alert-triangle" size={16} color={c.rose} />
              <Text variant="footnote" color={c.rose} style={{ flex: 1 }}>
                {store.storageError}
              </Text>
            </Card>
          </Reveal>
        ) : null}

        {/* Header */}
        <Reveal>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: space.sm,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="footnote" color={c.textTertiary}>
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text variant="title1" style={{ marginTop: 2 }}>
                {greeting()},{'\n'}
                {s.user.name || 'there'}.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton name="search" onPress={() => router.push('/search')} accessibilityLabel="Search" />
            </View>
          </View>
        </Reveal>

        {/* Streak + today ring */}
        <Reveal delay={70}>
          <Glass>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
              <ProgressRing
                progress={totalToday === 0 ? 0 : doneToday / totalToday}
                size={64}
                color={c.accent}
              >
                <Text variant="title3">{doneToday}</Text>
              </ProgressRing>
              <View style={{ flex: 1, gap: 3 }}>
                <Text variant="headline">
                  {doneToday === 0 && dueToday === 0
                    ? 'A clear runway today'
                    : dueToday === 0
                      ? 'Everything due today is done'
                      : `${dueToday} task${dueToday === 1 ? '' : 's'} still due today`}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="zap" size={13} color={s.streak.current > 0 ? c.amber : c.textTertiary} />
                  <Text variant="footnote" color={c.textSecondary}>
                    {s.streak.current > 0
                      ? `${s.streak.current}-day streak · best ${s.streak.longest}`
                      : 'Log anything today to start a streak'}
                  </Text>
                </View>
              </View>
            </View>
          </Glass>
        </Reveal>

        {/* Daily prompt */}
        <Reveal delay={140}>
          <Card tint={c.accentSofter} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Icon name="feather" size={13} color={c.accentText} />
              <Text variant="eyebrow" color={c.accentText}>
                Today’s prompt
              </Text>
            </View>
            <Text variant="title2" style={{ lineHeight: 30 }}>
              {prompt}
            </Text>
            <Tappable
              onPress={() =>
                s.spaces.length > 0
                  ? router.push(`/space/${(s.spaces.find((x) => x.pinned) ?? s.spaces[0]).id}`)
                  : router.push('/new-space')
              }
              feedback="tap"
              style={{ alignSelf: 'flex-start' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 }}>
                <Text variant="footnote" color={c.accentText}>
                  Answer it in a space
                </Text>
                <Icon name="arrow-right" size={14} color={c.accentText} />
              </View>
            </Tappable>
          </Card>
        </Reveal>

        {/* Up next tasks */}
        <Reveal delay={210}>
          <SectionHeader
            title="Up next"
            icon="check-circle"
            action={s.tasks.length > 0 ? 'All tasks' : undefined}
            onAction={() => router.push('/(tabs)/tasks')}
          />
          {openTasks.length === 0 ? (
            <Card padded={false}>
              <EmptyState
                compact
                icon="wind"
                title="Nothing queued"
                body="Add a task from the Tasks tab and the most urgent ones will surface here."
              />
            </Card>
          ) : (
            <Card padded={false}>
              {openTasks.map((t, i) => {
                const ds = dueState(t.due);
                const sp = t.spaceId ? spaceById(t.spaceId) : null;
                return (
                  <View key={t.id}>
                    {i > 0 ? (
                      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginLeft: 56 }} />
                    ) : null}
                    <Tappable
                      onPress={() => {
                        const r = store.toggleTask(t.id);
                        if (r.streakExtended) setBurst(Date.now());
                      }}
                      feedback="press"
                      scaleTo={0.985}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md }}>
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: ds === 'overdue' ? c.rose : c.borderStrong,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text variant="bodyMedium" numberOfLines={1}>
                            {t.title}
                          </Text>
                          <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                            {ds !== 'none' ? (
                              <Text
                                variant="caption"
                                color={ds === 'overdue' ? c.rose : ds === 'today' ? c.accentText : c.textTertiary}
                              >
                                {ds === 'overdue' ? 'Overdue' : ds === 'today' ? 'Due today' : 'Coming up'}
                              </Text>
                            ) : null}
                            {sp ? (
                              <Text variant="caption" color={c.textTertiary}>
                                {sp.emoji} {sp.name}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        {t.priority === 'high' ? (
                          <Icon name="alert-circle" size={15} color={c.amber} />
                        ) : null}
                      </View>
                    </Tappable>
                  </View>
                );
              })}
            </Card>
          )}
        </Reveal>

        {/* Daily playbook */}
        <Reveal delay={280}>
          <SectionHeader title="Playbook of the day" icon="book-open" />
          <Tappable onPress={() => router.push(`/playbook/${playbook.id}`)} scaleTo={0.98}>
            <Card level={2} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.sm,
                    backgroundColor: hueColor(c, playbook.hue).bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={playbook.icon} size={17} color={hueColor(c, playbook.hue).fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" color={c.textTertiary}>
                    {playbook.category} · {playbook.minutes} min read
                  </Text>
                </View>
                {playbook.pro && !s.premium.isPremium ? (
                  <Chip label="Pro" small tone={{ fg: c.accentText, bg: c.accentSoft }} icon="lock" />
                ) : null}
              </View>
              <Text variant="title2">{playbook.title}</Text>
              <Text variant="callout" color={c.textSecondary}>
                {playbook.deck}
              </Text>
            </Card>
          </Tappable>
        </Reveal>

        {/* Recent activity */}
        <Reveal delay={350}>
          <SectionHeader title="Recent in your spaces" icon="clock" />
          {recentEntries.length === 0 ? (
            <Card padded={false}>
              <EmptyState
                compact
                icon="edit-3"
                title="No entries yet"
                body="Open a space and log a note, a decision, or a win. Your recent activity shows up here."
              />
            </Card>
          ) : (
            <View style={{ gap: 8 }}>
              {recentEntries.map((e) => {
                const sp = spaceById(e.spaceId);
                const kind = ENTRY_KINDS.find((k) => k.key === e.kind)!;
                const tone = hueColor(c, kind.hue);
                return (
                  <Tappable key={e.id} onPress={() => sp && router.push(`/space/${sp.id}`)} scaleTo={0.985}>
                    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: radius.xs,
                          backgroundColor: tone.bg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name={kind.icon as any} size={14} color={tone.fg} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodyMedium" numberOfLines={1}>
                          {e.text}
                        </Text>
                        <Text variant="caption" color={c.textTertiary}>
                          {sp ? `${sp.emoji} ${sp.name}` : 'Space removed'} · {relativeTime(e.createdAt)}
                        </Text>
                      </View>
                    </Card>
                  </Tappable>
                );
              })}
            </View>
          )}
        </Reveal>

        {/* Pro upsell — only when free */}
        {!s.premium.isPremium ? (
          <Reveal delay={420}>
            <Tappable onPress={() => router.push('/paywall')} scaleTo={0.98}>
              <Card
                level={2}
                style={{
                  backgroundColor: mode === 'dark' ? '#241A12' : '#2A1C12',
                  borderColor: 'transparent',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <Text style={{ fontSize: 26 }}>🔥</Text>
                  <View style={{ flex: 1 }}>
                    <Text variant="headline" color="#F6EDE4">
                      Hearth Pro
                    </Text>
                    <Text variant="caption" color="rgba(246,237,228,0.65)">
                      Unlimited spaces, the full playbook library, and insights
                    </Text>
                  </View>
                  <Icon name="arrow-right" size={18} color="#F6EDE4" />
                </View>
              </Card>
            </Tappable>
          </Reveal>
        ) : null}
      </Screen>
      <Confetti fireKey={burst} />
    </>
  );
}
