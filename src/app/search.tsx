import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLAYBOOKS } from '@/content';
import { relativeTime } from '@/lib/date';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { ENTRY_KINDS } from '@/store/types';
import { Chip, IconButton } from '@/ui/controls';
import { Icon, IconName } from '@/ui/Icon';
import { Reveal, Tappable } from '@/ui/motion';
import { Aurora, Card } from '@/ui/surfaces';
import { EmptyState, SectionHeader } from '@/ui/layout';
import { Text } from '@/ui/Text';

/**
 * Search is deliberately forgiving: every term can match anywhere, in any
 * order, across entries, tasks, spaces and playbooks at once. No syntax.
 */
function matches(haystack: string, terms: string[]): boolean {
  const h = haystack.toLowerCase();
  return terms.every((t) => h.includes(t));
}

type Scope = 'all' | 'entries' | 'tasks' | 'spaces' | 'playbooks';

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c, space, radius, type } = useTheme();
  const store = useStore();
  const { s } = store;

  const [q, setQ] = useState('');
  const [scope, setScope] = useState<Scope>('all');

  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const active = terms.length > 0;

  const results = useMemo(() => {
    if (!active) return null;
    const spaceName = (spaceId: string) => s.spaces.find((x) => x.id === spaceId);

    const entries =
      scope === 'all' || scope === 'entries'
        ? s.entries
            .filter((e) => matches(e.text, terms))
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 25)
        : [];
    const tasks =
      scope === 'all' || scope === 'tasks'
        ? s.tasks.filter((t) => matches(t.title, terms)).slice(0, 15)
        : [];
    const spaces =
      scope === 'all' || scope === 'spaces'
        ? s.spaces.filter((x) => matches(`${x.name} ${x.purpose}`, terms))
        : [];
    const playbooks =
      scope === 'all' || scope === 'playbooks'
        ? PLAYBOOKS.filter((p) =>
            matches(
              `${p.title} ${p.deck} ${p.gist} ${p.category} ${p.sections.map((x) => x.heading).join(' ')}`,
              terms
            )
          ).slice(0, 10)
        : [];
    return { entries, tasks, spaces, playbooks, total: entries.length + tasks.length + spaces.length + playbooks.length };
  }, [active, terms.join(' '), scope, s.entries, s.tasks, s.spaces]);

  const commit = () => {
    if (q.trim()) store.pushRecentSearch(q);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <Aurora intensity={0.7} />
      <View style={{ flex: 1, paddingTop: insets.top + space.sm }}>
        {/* Search bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.sm,
            paddingHorizontal: space.lg,
            marginBottom: space.sm,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: c.surface,
              borderRadius: radius.pill,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: c.border,
              paddingHorizontal: space.md,
              height: 48,
            }}
          >
            <Icon name="search" size={17} color={c.textTertiary} />
            <TextInput
              value={q}
              onChangeText={setQ}
              onSubmitEditing={commit}
              placeholder="Search everything…"
              placeholderTextColor={c.textTertiary}
              autoFocus
              returnKeyType="search"
              style={[
                type.body,
                { flex: 1, color: c.text, paddingVertical: 0 },
                Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
              ]}
            />
            {q ? (
              <Tappable onPress={() => setQ('')} feedback="tap">
                <Icon name="x-circle" size={16} color={c.textTertiary} />
              </Tappable>
            ) : null}
          </View>
          <IconButton name="x" onPress={() => router.back()} accessibilityLabel="Close search" />
        </View>

        {/* Scope chips */}
        <View style={{ paddingHorizontal: space.lg, marginBottom: space.sm }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {(
              [
                ['all', 'Everything'],
                ['entries', 'Entries'],
                ['tasks', 'Tasks'],
                ['spaces', 'Spaces'],
                ['playbooks', 'Playbooks'],
              ] as [Scope, string][]
            ).map(([k, label]) => (
              <Chip key={k} small label={label} active={scope === k} onPress={() => setScope(k)} />
            ))}
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: insets.bottom + space.xl, gap: space.sm }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!active ? (
            s.recentSearches.length > 0 ? (
              <>
                <SectionHeader
                  title="Recent searches"
                  action="Clear"
                  onAction={() => store.clearRecentSearches()}
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {s.recentSearches.map((r) => (
                    <Chip key={r} label={r} icon="clock" onPress={() => setQ(r)} />
                  ))}
                </View>
              </>
            ) : (
              <EmptyState
                icon="search"
                title="Find anything, instantly"
                body="Entries, tasks, spaces and playbooks — one box, no syntax, matched as you type."
              />
            )
          ) : results && results.total === 0 ? (
            <EmptyState
              icon="wind"
              title={`Nothing for “${q.trim()}”`}
              body="Try fewer or shorter words — every word has to match somewhere."
            />
          ) : results ? (
            <>
              {results.spaces.length > 0 ? (
                <Reveal>
                  <SectionHeader title="Spaces" icon="grid" />
                  <View style={{ gap: 8 }}>
                    {results.spaces.map((sp) => (
                      <Tappable
                        key={sp.id}
                        onPress={() => {
                          commit();
                          router.push(`/space/${sp.id}`);
                        }}
                        scaleTo={0.985}
                      >
                        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                          <Text style={{ fontSize: 20 }}>{sp.emoji}</Text>
                          <View style={{ flex: 1 }}>
                            <Text variant="headline">{sp.name}</Text>
                            {sp.purpose ? (
                              <Text variant="caption" color={c.textTertiary}>
                                {sp.purpose}
                              </Text>
                            ) : null}
                          </View>
                          <Icon name="chevron-right" size={16} color={c.textTertiary} />
                        </Card>
                      </Tappable>
                    ))}
                  </View>
                </Reveal>
              ) : null}

              {results.entries.length > 0 ? (
                <Reveal delay={40}>
                  <SectionHeader title="Entries" icon="edit-3" />
                  <View style={{ gap: 8 }}>
                    {results.entries.map((e) => {
                      const sp = s.spaces.find((x) => x.id === e.spaceId);
                      const kind = ENTRY_KINDS.find((k) => k.key === e.kind)!;
                      const tone = hueColor(c, kind.hue);
                      return (
                        <Tappable
                          key={e.id}
                          onPress={() => {
                            commit();
                            if (sp) router.push(`/space/${sp.id}`);
                          }}
                          scaleTo={0.985}
                        >
                          <Card style={{ gap: 6 }}>
                            <Text variant="body" numberOfLines={3}>
                              {e.text}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Icon name={kind.icon as IconName} size={11} color={tone.fg} />
                              <Text variant="caption" color={c.textTertiary}>
                                {sp ? `${sp.emoji} ${sp.name}` : 'Removed space'} · {relativeTime(e.createdAt)}
                              </Text>
                            </View>
                          </Card>
                        </Tappable>
                      );
                    })}
                  </View>
                </Reveal>
              ) : null}

              {results.tasks.length > 0 ? (
                <Reveal delay={80}>
                  <SectionHeader title="Tasks" icon="check-circle" />
                  <Card padded={false}>
                    {results.tasks.map((t, i) => (
                      <View key={t.id}>
                        {i > 0 ? (
                          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginLeft: 48 }} />
                        ) : null}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md }}>
                          <Icon
                            name={t.done ? 'check-circle' : 'circle'}
                            size={17}
                            color={t.done ? c.mint : c.textTertiary}
                          />
                          <Text
                            variant="bodyMedium"
                            style={[{ flex: 1 }, t.done && { textDecorationLine: 'line-through' }]}
                            color={t.done ? c.textTertiary : c.text}
                            numberOfLines={1}
                          >
                            {t.title}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Card>
                </Reveal>
              ) : null}

              {results.playbooks.length > 0 ? (
                <Reveal delay={120}>
                  <SectionHeader title="Playbooks" icon="book-open" />
                  <View style={{ gap: 8 }}>
                    {results.playbooks.map((p) => {
                      const tone = hueColor(c, p.hue);
                      return (
                        <Tappable
                          key={p.id}
                          onPress={() => {
                            commit();
                            router.push(`/playbook/${p.id}`);
                          }}
                          scaleTo={0.985}
                        >
                          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                            <View
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: radius.xs,
                                backgroundColor: tone.bg,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Icon name={p.icon} size={15} color={tone.fg} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text variant="bodyMedium" numberOfLines={1}>
                                {p.title}
                              </Text>
                              <Text variant="caption" color={c.textTertiary}>
                                {p.category} · {p.minutes} min
                              </Text>
                            </View>
                            {p.pro && !s.premium.isPremium ? (
                              <Icon name="lock" size={13} color={c.accentText} />
                            ) : null}
                          </Card>
                        </Tappable>
                      );
                    })}
                  </View>
                </Reveal>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}
