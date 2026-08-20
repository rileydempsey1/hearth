import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dayKey, dayLabel, relativeTime } from '@/lib/date';
import { haptic } from '@/lib/haptics';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { Entry, ENTRY_KINDS, EntryKind } from '@/store/types';
import { Chip, IconButton } from '@/ui/controls';
import { Icon, IconName } from '@/ui/Icon';
import { Confetti, Reveal, Tappable, isWeb } from '@/ui/motion';
import { Aurora, Card, Glass } from '@/ui/surfaces';
import { EmptyState, NavBar } from '@/ui/layout';
import { Text } from '@/ui/Text';

type ListItem =
  | { type: 'day'; key: string; label: string }
  | { type: 'entry'; key: string; entry: Entry; replies: Entry[] };

export default function SpaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c, mode, space, radius, type } = useTheme();
  const store = useStore();
  const { s } = store;

  const sp = s.spaces.find((x) => x.id === id);

  const [draft, setDraft] = useState('');
  const [kind, setKind] = useState<EntryKind>('note');
  const [replyTo, setReplyTo] = useState<Entry | null>(null);
  const [filter, setFilter] = useState<EntryKind | 'all' | 'pinned'>('all');
  const [burst, setBurst] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);

  const entries = useMemo(
    () => s.entries.filter((e) => e.spaceId === id).sort((a, b) => a.createdAt - b.createdAt),
    [s.entries, id]
  );

  const items = useMemo<ListItem[]>(() => {
    const roots = entries.filter((e) => {
      if (e.parentId) return false;
      if (filter === 'all') return true;
      if (filter === 'pinned') return e.pinned;
      return e.kind === filter;
    });
    const out: ListItem[] = [];
    let lastDay = '';
    for (const e of roots) {
      const dk = dayKey(e.createdAt);
      if (dk !== lastDay) {
        out.push({ type: 'day', key: `day-${dk}`, label: dayLabel(dk) });
        lastDay = dk;
      }
      out.push({
        type: 'entry',
        key: e.id,
        entry: e,
        replies: entries.filter((r) => r.parentId === e.id),
      });
    }
    return out.reverse(); // inverted list renders newest at the visual bottom
  }, [entries, filter]);

  const pinnedCount = entries.filter((e) => !e.parentId && e.pinned).length;

  if (!sp) {
    return (
      <View style={{ flex: 1, backgroundColor: c.canvas }}>
        <Aurora />
        <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: space.lg }}>
          <NavBar back title="Space" />
          <EmptyState
            icon="alert-circle"
            title="This space is gone"
            body="It may have been deleted. Head back and pick another one."
          />
        </View>
      </View>
    );
  }

  const tone = hueColor(c, sp.hue);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const { streakExtended } = store.addEntry({
      spaceId: sp.id,
      text,
      kind: replyTo ? 'note' : kind,
      parentId: replyTo?.id ?? null,
    });
    setDraft('');
    setReplyTo(null);
    haptic.success();
    if (streakExtended) setBurst(Date.now());
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  };

  const entryActions = (e: Entry) => {
    const opts = [
      { text: e.pinned ? 'Unpin' : 'Pin to top', onPress: () => store.updateEntry(e.id, { pinned: !e.pinned }) },
      { text: e.saved ? 'Unsave' : 'Save for later', onPress: () => store.updateEntry(e.id, { saved: !e.saved }) },
      {
        text: 'Make it a task',
        onPress: () => {
          store.addTask({ title: e.text.slice(0, 120), spaceId: sp.id });
          haptic.success();
        },
      },
      {
        text: 'Delete',
        style: 'destructive' as const,
        onPress: () => store.removeEntry(e.id),
      },
      { text: 'Cancel', style: 'cancel' as const },
    ];
    if (isWeb) {
      // Web preview fallback: simple confirm-free menu via prompt order
      store.updateEntry(e.id, { pinned: !e.pinned });
      return;
    }
    Alert.alert('Entry', e.text.slice(0, 80), opts);
  };

  const KindBadge = ({ k }: { k: EntryKind }) => {
    if (k === 'note') return null;
    const def = ENTRY_KINDS.find((x) => x.key === k)!;
    const kt = hueColor(c, def.hue);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: kt.bg,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: radius.pill,
          alignSelf: 'flex-start',
        }}
      >
        <Icon name={def.icon as IconName} size={10} color={kt.fg} />
        <Text variant="caption" color={kt.fg}>
          {def.label}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'day') {
      return (
        <View style={{ alignItems: 'center', marginVertical: space.sm }}>
          <View
            style={{
              backgroundColor: c.surfaceSunken,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: radius.pill,
            }}
          >
            <Text variant="caption" color={c.textTertiary}>
              {item.label}
            </Text>
          </View>
        </View>
      );
    }
    const e = item.entry;
    return (
      <View style={{ marginBottom: 10 }}>
        <Tappable onLongPress={() => entryActions(e)} onPress={() => setReplyTo(e)} scaleTo={0.99} feedback="none">
          <Card
            style={{
              gap: 8,
              borderLeftWidth: e.pinned ? 3 : 0,
              borderLeftColor: c.amber,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <KindBadge k={e.kind} />
              <View style={{ flex: 1 }} />
              {e.saved ? <Icon name="bookmark" size={13} color={c.accentText} /> : null}
              {e.pinned ? <Icon name="star" size={13} color={c.amber} /> : null}
              <Text variant="caption" color={c.textTertiary}>
                {new Date(e.createdAt).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text variant="body">{e.text}</Text>
            {item.replies.length > 0 ? (
              <View
                style={{
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: c.border,
                  paddingTop: 8,
                  gap: 8,
                }}
              >
                {item.replies.map((r) => (
                  <View key={r.id} style={{ flexDirection: 'row', gap: 8 }}>
                    <View style={{ width: 2, borderRadius: 1, backgroundColor: tone.fg, opacity: 0.5 }} />
                    <View style={{ flex: 1 }}>
                      <Text variant="callout">{r.text}</Text>
                      <Text variant="caption" color={c.textTertiary}>
                        {relativeTime(r.createdAt)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </Card>
        </Tappable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <Aurora intensity={0.7} />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: space.lg }}>
          <NavBar
            back
            title={`${sp.emoji} ${sp.name}`}
            subtitle={sp.purpose || undefined}
            right={
              <IconButton
                name="more-horizontal"
                accessibilityLabel="Space options"
                onPress={() => {
                  if (isWeb) {
                    store.updateSpace(sp.id, { pinned: !sp.pinned });
                    return;
                  }
                  Alert.alert(sp.name, sp.purpose || undefined, [
                    {
                      text: sp.pinned ? 'Unpin space' : 'Pin space',
                      onPress: () => store.updateSpace(sp.id, { pinned: !sp.pinned }),
                    },
                    {
                      text: sp.archived ? 'Unarchive' : 'Archive',
                      onPress: () => store.updateSpace(sp.id, { archived: !sp.archived }),
                    },
                    {
                      text: 'Delete space',
                      style: 'destructive',
                      onPress: () =>
                        Alert.alert('Delete this space?', 'Its entries and tasks go with it. This cannot be undone.', [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                              store.removeSpace(sp.id);
                              router.back();
                            },
                          },
                        ]),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
              />
            }
          />
        </View>

        {/* Filters */}
        <View style={{ paddingHorizontal: space.lg, marginBottom: space.xs }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              { key: 'all', label: 'All' },
              { key: 'pinned', label: `Pinned${pinnedCount ? ` · ${pinnedCount}` : ''}` },
              ...ENTRY_KINDS.map((k) => ({ key: k.key, label: k.label })),
            ]}
            keyExtractor={(x) => x.key}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item: f }) => (
              <Chip
                small
                label={f.label}
                active={filter === f.key}
                onPress={() => setFilter(f.key as any)}
              />
            )}
          />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {items.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <EmptyState
                icon={filter === 'all' ? 'edit-3' : 'filter'}
                title={filter === 'all' ? 'The log starts here' : 'Nothing matches'}
                body={
                  filter === 'all'
                    ? 'Write the first line — what is happening with this project right now?'
                    : 'No entries of this kind yet. Switch back to All to see everything.'
                }
              />
            </View>
          ) : (
            <FlatList
              ref={listRef}
              inverted
              data={items}
              keyExtractor={(x) => x.key}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: space.lg, paddingVertical: space.md }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {/* Composer */}
          <View style={{ paddingHorizontal: space.md, paddingBottom: insets.bottom + space.sm }}>
            {replyTo ? (
              <Reveal from={6}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: c.surfaceSunken,
                    borderTopLeftRadius: radius.md,
                    borderTopRightRadius: radius.md,
                    paddingHorizontal: space.md,
                    paddingVertical: 8,
                    marginBottom: -6,
                    paddingBottom: 14,
                  }}
                >
                  <Icon name="corner-down-right" size={13} color={c.textTertiary} />
                  <Text variant="caption" color={c.textSecondary} numberOfLines={1} style={{ flex: 1 }}>
                    Replying to “{replyTo.text.slice(0, 60)}”
                  </Text>
                  <Tappable onPress={() => setReplyTo(null)} feedback="tap">
                    <Icon name="x" size={14} color={c.textTertiary} />
                  </Tappable>
                </View>
              </Reveal>
            ) : (
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                {ENTRY_KINDS.map((k) => {
                  const kt = hueColor(c, k.hue);
                  const active = kind === k.key;
                  return (
                    <Chip
                      key={k.key}
                      small
                      label={k.label}
                      icon={k.icon as IconName}
                      active={active}
                      tone={active ? undefined : { fg: kt.fg, bg: kt.bg }}
                      onPress={() => setKind(k.key)}
                    />
                  );
                })}
              </View>
            )}
            <Glass padded={false} radiusKey="lg" intensity={30}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', padding: 8, gap: 8 }}>
                <TextInput
                  ref={inputRef}
                  value={draft}
                  onChangeText={setDraft}
                  placeholder={replyTo ? 'Write a reply…' : 'What’s happening?'}
                  placeholderTextColor={c.textTertiary}
                  multiline
                  maxLength={2000}
                  style={[
                    type.body,
                    {
                      flex: 1,
                      color: c.text,
                      maxHeight: 120,
                      paddingHorizontal: 10,
                      paddingTop: 10,
                      paddingBottom: 10,
                    },
                    Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
                  ]}
                />
                <Tappable
                  onPress={send}
                  feedback="press"
                  scaleTo={0.88}
                  accessibilityLabel="Send"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: draft.trim() ? c.accent : c.surfaceSunken,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="arrow-up" size={19} color={draft.trim() ? c.onAccent : c.textTertiary} />
                </Tappable>
              </View>
            </Glass>
          </View>
        </KeyboardAvoidingView>
      </View>
      <Confetti fireKey={burst} />
    </View>
  );
}
