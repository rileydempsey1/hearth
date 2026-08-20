import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { relativeTime } from '@/lib/date';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { FREE_SPACE_LIMIT } from '@/store/types';
import { Button, IconButton } from '@/ui/controls';
import { Icon } from '@/ui/Icon';
import { Reveal, Tappable } from '@/ui/motion';
import { Card } from '@/ui/surfaces';
import { EmptyState, Screen, SectionHeader } from '@/ui/layout';
import { Text } from '@/ui/Text';

export default function Spaces() {
  const router = useRouter();
  const { c, space, radius } = useTheme();
  const { s, canCreateSpace } = useStore();

  const sorted = useMemo(() => {
    const active = s.spaces.filter((x) => !x.archived);
    return [...active].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
  }, [s.spaces]);

  const archived = s.spaces.filter((x) => x.archived);

  const lastEntry = (spaceId: string) =>
    [...s.entries]
      .filter((e) => e.spaceId === spaceId)
      .sort((a, b) => b.createdAt - a.createdAt)[0];

  const openTaskCount = (spaceId: string) =>
    s.tasks.filter((t) => t.spaceId === spaceId && !t.done).length;

  const onNew = () => {
    if (canCreateSpace) router.push('/new-space');
    else router.push('/paywall?reason=spaces');
  };

  return (
    <Screen scroll contentStyle={{ gap: space.md, paddingBottom: 130 }}>
      <Reveal>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: space.sm,
          }}
        >
          <Text variant="title1">Spaces</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton name="search" onPress={() => router.push('/search')} accessibilityLabel="Search" />
            <IconButton name="plus" tone="accent" onPress={onNew} accessibilityLabel="New space" />
          </View>
        </View>
      </Reveal>

      {!s.premium.isPremium ? (
        <Reveal delay={50}>
          <Text variant="footnote" color={c.textTertiary}>
            {s.spaces.length} of {FREE_SPACE_LIMIT} free spaces used
          </Text>
        </Reveal>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon="grid"
          title="No spaces yet"
          body="A space holds one project or theme — its log, its decisions, its tasks. Make your first one."
          action={<Button label="Create a space" icon="plus" onPress={onNew} full={false} />}
        />
      ) : (
        <View style={{ gap: 10 }}>
          {sorted.map((sp, i) => {
            const tone = hueColor(c, sp.hue);
            const last = lastEntry(sp.id);
            const tasks = openTaskCount(sp.id);
            return (
              <Reveal key={sp.id} delay={i * 60}>
                <Tappable onPress={() => router.push(`/space/${sp.id}`)} scaleTo={0.98}>
                  <Card style={{ gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: radius.md,
                          backgroundColor: tone.bg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 22 }}>{sp.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text variant="headline" numberOfLines={1} style={{ flexShrink: 1 }}>
                            {sp.name}
                          </Text>
                          {sp.pinned ? <Icon name="star" size={13} color={c.amber} /> : null}
                        </View>
                        <Text variant="caption" color={c.textTertiary} numberOfLines={1}>
                          {sp.purpose || 'No description'}
                        </Text>
                      </View>
                      <Icon name="chevron-right" size={18} color={c.textTertiary} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: space.md,
                        paddingTop: 10,
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: c.border,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Icon name="edit-3" size={12} color={tone.fg} />
                        <Text variant="caption" color={c.textSecondary}>
                          {last ? relativeTime(last.createdAt) : 'No entries'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Icon name="check-circle" size={12} color={tone.fg} />
                        <Text variant="caption" color={c.textSecondary}>
                          {tasks} open task{tasks === 1 ? '' : 's'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </Tappable>
              </Reveal>
            );
          })}
        </View>
      )}

      {archived.length > 0 ? (
        <>
          <SectionHeader title="Archived" icon="archive" />
          <View style={{ gap: 8 }}>
            {archived.map((sp) => (
              <Tappable key={sp.id} onPress={() => router.push(`/space/${sp.id}`)} scaleTo={0.99}>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, opacity: 0.6 }}>
                  <Text style={{ fontSize: 18 }}>{sp.emoji}</Text>
                  <Text variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
                    {sp.name}
                  </Text>
                  <Icon name="archive" size={14} color={c.textTertiary} />
                </Card>
              </Tappable>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}
