import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CATEGORIES, Category, PLAYBOOKS } from '@/content';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { Chip, IconButton } from '@/ui/controls';
import { Icon } from '@/ui/Icon';
import { Reveal, Tappable } from '@/ui/motion';
import { Card } from '@/ui/surfaces';
import { EmptyState, ProgressRing, Screen, SectionHeader } from '@/ui/layout';
import { Text } from '@/ui/Text';

export default function Library() {
  const router = useRouter();
  const { c, space, radius } = useTheme();
  const { s } = useStore();
  const [cat, setCat] = useState<Category | 'all' | 'saved'>('all');

  const list = useMemo(() => {
    if (cat === 'saved') return PLAYBOOKS.filter((p) => s.savedPlaybooks.includes(p.id));
    if (cat === 'all') return PLAYBOOKS;
    return PLAYBOOKS.filter((p) => p.category === cat);
  }, [cat, s.savedPlaybooks]);

  const readCount = s.readPlaybooks.filter((id) => PLAYBOOKS.some((p) => p.id === id)).length;

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
          <View>
            <Text variant="title1">Library</Text>
            <Text variant="footnote" color={c.textTertiary} style={{ marginTop: 2 }}>
              {PLAYBOOKS.length} playbooks for working well
            </Text>
          </View>
          <ProgressRing progress={readCount / PLAYBOOKS.length} size={54} stroke={5}>
            <Text variant="caption">{readCount}</Text>
          </ProgressRing>
        </View>
      </Reveal>

      <Reveal delay={60}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="All" active={cat === 'all'} onPress={() => setCat('all')} />
          <Chip label="Saved" icon="bookmark" active={cat === 'saved'} onPress={() => setCat('saved')} />
          {CATEGORIES.map((k) => (
            <Chip
              key={k.key}
              label={k.label}
              icon={k.icon}
              active={cat === k.key}
              onPress={() => setCat(k.key)}
            />
          ))}
        </ScrollView>
      </Reveal>

      {list.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="Nothing saved yet"
          body="Tap the bookmark on any playbook and it will wait for you here."
        />
      ) : (
        <View style={{ gap: 10 }}>
          {list.map((p, i) => {
            const tone = hueColor(c, p.hue);
            const locked = p.pro && !s.premium.isPremium;
            const read = s.readPlaybooks.includes(p.id);
            return (
              <Reveal key={p.id} delay={Math.min(i, 6) * 55}>
                <Tappable onPress={() => router.push(`/playbook/${p.id}`)} scaleTo={0.98}>
                  <Card style={{ gap: 10 }}>
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
                        <Icon name={p.icon} size={19} color={tone.fg} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="caption" color={c.textTertiary}>
                          {p.category} · {p.minutes} min
                          {read ? '  ·  read' : ''}
                        </Text>
                        <Text variant="headline" style={{ marginTop: 2 }}>
                          {p.title}
                        </Text>
                      </View>
                      {locked ? (
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: c.accentSoft,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon name="lock" size={13} color={c.accentText} />
                        </View>
                      ) : s.savedPlaybooks.includes(p.id) ? (
                        <Icon name="bookmark" size={16} color={c.accentText} />
                      ) : null}
                    </View>
                    <Text variant="callout" color={c.textSecondary}>
                      {p.deck}
                    </Text>
                  </Card>
                </Tappable>
              </Reveal>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
