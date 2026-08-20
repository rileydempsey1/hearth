import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPlaybook } from '@/content';
import { haptic } from '@/lib/haptics';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { IconButton } from '@/ui/controls';
import { Icon } from '@/ui/Icon';
import { Reveal, Tappable } from '@/ui/motion';
import { Aurora, Card, Divider, LockedVeil } from '@/ui/surfaces';
import { EmptyState, NavBar } from '@/ui/layout';
import { Text } from '@/ui/Text';

export default function PlaybookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c, space, radius } = useTheme();
  const store = useStore();
  const { s } = store;
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const p = useMemo(() => (id ? getPlaybook(id) : undefined), [id]);
  const locked = !!p && p.pro && !s.premium.isPremium;

  useEffect(() => {
    if (p && !locked) store.markPlaybookRead(p.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.id, locked]);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: c.canvas }}>
        <Aurora />
        <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: space.lg }}>
          <NavBar back title="Playbook" />
          <EmptyState icon="alert-circle" title="Not found" body="This playbook does not exist." />
        </View>
      </View>
    );
  }

  const tone = hueColor(c, p.hue);
  const saved = s.savedPlaybooks.includes(p.id);
  const visibleSections = locked ? p.sections.slice(0, 1) : p.sections;

  const saveTemplateToSpace = () => {
    if (!p.template) return;
    const target = s.spaces.find((x) => x.pinned && !x.archived) ?? s.spaces.find((x) => !x.archived);
    if (!target) {
      router.push('/new-space');
      return;
    }
    store.addEntry({
      spaceId: target.id,
      text: `${p.template.title.toUpperCase()} — template from “${p.title}”\n\n${p.template.body}`,
      kind: 'note',
    });
    setCopiedTemplate(true);
    haptic.success();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <Aurora intensity={0.8} />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: space.lg }}>
          <NavBar
            back
            right={
              <IconButton
                name={saved ? 'bookmark' : 'bookmark'}
                color={saved ? c.accentText : undefined}
                tone={saved ? 'accent' : 'surface'}
                onPress={() => store.togglePlaybookSaved(p.id)}
                accessibilityLabel={saved ? 'Unsave' : 'Save'}
              />
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: space.lg,
              paddingBottom: locked ? 340 : insets.bottom + space.xxl,
              gap: space.lg,
            }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!locked}
          >
            <Reveal>
              <View style={{ gap: space.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.md,
                      backgroundColor: tone.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={p.icon} size={20} color={tone.fg} />
                  </View>
                  <Text variant="caption" color={c.textTertiary}>
                    {p.category} · {p.minutes} min read
                  </Text>
                </View>
                <Text variant="title1">{p.title}</Text>
                <Text variant="body" color={c.textSecondary} style={{ fontStyle: 'italic' }}>
                  {p.deck}
                </Text>
              </View>
            </Reveal>

            {visibleSections.map((sec, i) => (
              <Reveal key={sec.heading} delay={80 + i * 60}>
                <View style={{ gap: 8 }}>
                  <Text variant="title2">{sec.heading}</Text>
                  {sec.body.split('\n\n').map((para, j) => (
                    <Text key={j} variant="body" color={c.textSecondary}>
                      {para}
                    </Text>
                  ))}
                </View>
              </Reveal>
            ))}

            {!locked ? (
              <>
                <Reveal delay={120}>
                  <Card tint={tone.bg} style={{ gap: 10, borderColor: 'transparent' }}>
                    <Text variant="eyebrow" color={tone.fg}>
                      The moves
                    </Text>
                    {p.steps.map((step, i) => (
                      <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            backgroundColor: tone.fg,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 1,
                          }}
                        >
                          <Text variant="caption" color={c.onAccent}>
                            {i + 1}
                          </Text>
                        </View>
                        <Text variant="bodyMedium" style={{ flex: 1 }}>
                          {step}
                        </Text>
                      </View>
                    ))}
                  </Card>
                </Reveal>

                {p.template ? (
                  <Reveal delay={160}>
                    <Card style={{ gap: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Icon name="copy" size={14} color={c.textSecondary} />
                        <Text variant="eyebrow" color={c.textTertiary}>
                          Template — {p.template.title}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: c.surfaceSunken,
                          borderRadius: radius.md,
                          padding: space.md,
                        }}
                      >
                        <Text variant="callout" color={c.textSecondary}>
                          {p.template.body}
                        </Text>
                      </View>
                      <Tappable onPress={saveTemplateToSpace} feedback="press" scaleTo={0.98}>
                        <View
                          style={{
                            height: 44,
                            borderRadius: radius.pill,
                            backgroundColor: copiedTemplate ? c.mintSoft : c.accentSoft,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 7,
                          }}
                        >
                          <Icon
                            name={copiedTemplate ? 'check' : 'plus'}
                            size={15}
                            color={copiedTemplate ? c.mint : c.accentText}
                          />
                          <Text variant="footnote" color={copiedTemplate ? c.mint : c.accentText}>
                            {copiedTemplate ? 'Saved to your space' : 'Save template to a space'}
                          </Text>
                        </View>
                      </Tappable>
                    </Card>
                  </Reveal>
                ) : null}

                <Reveal delay={200}>
                  <View style={{ gap: 10 }}>
                    <Text variant="eyebrow" color={c.textTertiary}>
                      Where it goes wrong
                    </Text>
                    {p.pitfalls.map((pit, i) => (
                      <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                        <Icon name="x-circle" size={15} color={c.rose} style={{ marginTop: 3 }} />
                        <Text variant="body" color={c.textSecondary} style={{ flex: 1 }}>
                          {pit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Reveal>
                <Divider style={{ marginVertical: space.sm }} />
                <Text variant="caption" color={c.textTertiary} center>
                  Written for Hearth · lives on your device
                </Text>
              </>
            ) : null}
          </ScrollView>

          {locked ? (
            <LockedVeil
              title="This one is in Hearth Pro"
              body={`“${p.title}” and the rest of the advanced library come with Pro — along with unlimited spaces and insights.`}
              cta="See what Pro unlocks"
              onPress={() => router.push('/paywall?reason=playbook')}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
