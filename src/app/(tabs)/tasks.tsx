import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDays, dayKey, dueState } from '@/lib/date';
import { haptic } from '@/lib/haptics';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { hueColor } from '@/theme/tokens';
import { Priority, Task } from '@/store/types';
import { Chip, IconButton, Segmented } from '@/ui/controls';
import { Icon } from '@/ui/Icon';
import { Confetti, Reveal, Tappable } from '@/ui/motion';
import { Card, Glass } from '@/ui/surfaces';
import { EmptyState, Screen, SectionHeader } from '@/ui/layout';
import { Text } from '@/ui/Text';

const PRIORITY_META: Record<Priority, { label: string; icon: any }> = {
  high: { label: 'High', icon: 'alert-circle' },
  med: { label: 'Medium', icon: 'circle' },
  low: { label: 'Low', icon: 'minus-circle' },
};

export default function Tasks() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c, space, radius, type } = useTheme();
  const store = useStore();
  const { s } = store;

  const [view, setView] = useState<'open' | 'done'>('open');
  const [draft, setDraft] = useState('');
  const [draftPriority, setDraftPriority] = useState<Priority>('med');
  const [draftDue, setDraftDue] = useState<'none' | 'today' | 'tomorrow' | 'week'>('none');
  const [draftSpace, setDraftSpace] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [burst, setBurst] = useState(0);

  const today = dayKey();

  const groups = useMemo(() => {
    const open = s.tasks.filter((t) => !t.done);
    const by = (st: ReturnType<typeof dueState>) => open.filter((t) => dueState(t.due, today) === st);
    return [
      { title: 'Overdue', data: by('overdue'), tone: c.rose },
      { title: 'Today', data: by('today'), tone: c.accent },
      { title: 'Next few days', data: by('soon'), tone: c.amber },
      { title: 'Later', data: [...by('later'), ...by('none')], tone: c.textTertiary },
    ].filter((g) => g.data.length > 0);
  }, [s.tasks, today, c]);

  const done = useMemo(
    () => s.tasks.filter((t) => t.done).sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0)).slice(0, 30),
    [s.tasks]
  );

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    const due =
      draftDue === 'today'
        ? today
        : draftDue === 'tomorrow'
          ? addDays(today, 1)
          : draftDue === 'week'
            ? addDays(today, 7)
            : null;
    store.addTask({ title, spaceId: draftSpace, priority: draftPriority, due });
    setDraft('');
    setDraftDue('none');
    setDraftPriority('med');
    haptic.success();
  };

  const TaskRow = ({ t }: { t: Task }) => {
    const sp = t.spaceId ? s.spaces.find((x) => x.id === t.spaceId) : null;
    const ds = dueState(t.due, today);
    return (
      <Tappable
        onPress={() => {
          const r = store.toggleTask(t.id);
          if (r.streakExtended) setBurst(Date.now());
        }}
        onLongPress={() => store.removeTask(t.id)}
        feedback="press"
        scaleTo={0.985}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.sm,
            paddingVertical: 12,
            paddingHorizontal: space.md,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: t.done ? c.mint : ds === 'overdue' ? c.rose : c.borderStrong,
              backgroundColor: t.done ? c.mint : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {t.done ? <Icon name="check" size={13} color={c.onAccent} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              variant="bodyMedium"
              color={t.done ? c.textTertiary : c.text}
              style={t.done ? { textDecorationLine: 'line-through' } : undefined}
              numberOfLines={2}
            >
              {t.title}
            </Text>
            {(sp || t.due) && !t.done ? (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                {sp ? (
                  <Text variant="caption" color={c.textTertiary}>
                    {sp.emoji} {sp.name}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
          {!t.done && t.priority === 'high' ? <Icon name="alert-circle" size={15} color={c.amber} /> : null}
        </View>
      </Tappable>
    );
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <Screen scroll contentStyle={{ gap: space.md, paddingBottom: 220 }}>
          <Reveal>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: space.sm,
              }}
            >
              <Text variant="title1">Tasks</Text>
              <IconButton
                name={composing ? 'x' : 'plus'}
                tone="accent"
                onPress={() => setComposing((v) => !v)}
                accessibilityLabel="New task"
              />
            </View>
          </Reveal>

          <Reveal delay={60}>
            <Segmented
              options={[
                { key: 'open', label: 'Open' },
                { key: 'done', label: 'Done' },
              ]}
              value={view}
              onChange={setView}
            />
          </Reveal>

          {view === 'open' ? (
            groups.length === 0 ? (
              <EmptyState
                icon="check-circle"
                title="All clear"
                body="Nothing on the list. Add a task with the + button — attach it to a space, give it a day, and it will show up on Today."
              />
            ) : (
              groups.map((g, gi) => (
                <Reveal key={g.title} delay={gi * 70}>
                  <SectionHeader title={g.title} />
                  <Card padded={false}>
                    {g.data.map((t, i) => (
                      <View key={t.id}>
                        {i > 0 ? (
                          <View
                            style={{
                              height: StyleSheet.hairlineWidth,
                              backgroundColor: c.border,
                              marginLeft: 56,
                            }}
                          />
                        ) : null}
                        <TaskRow t={t} />
                      </View>
                    ))}
                  </Card>
                </Reveal>
              ))
            )
          ) : done.length === 0 ? (
            <EmptyState
              icon="award"
              title="Nothing done yet"
              body="Completed tasks land here — proof of a week well spent."
            />
          ) : (
            <Card padded={false}>
              {done.map((t, i) => (
                <View key={t.id}>
                  {i > 0 ? (
                    <View
                      style={{
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: c.border,
                        marginLeft: 56,
                      }}
                    />
                  ) : null}
                  <TaskRow t={t} />
                </View>
              ))}
            </Card>
          )}

          <Text variant="caption" color={c.textTertiary} center>
            Tap to complete · hold to delete
          </Text>
        </Screen>

        {/* Composer sheet */}
        {composing ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
          >
            <Reveal from={30}>
              <View style={{ padding: space.md, paddingBottom: insets.bottom + 90 }}>
                <Glass radiusKey="xl">
                  <View style={{ gap: space.sm }}>
                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      placeholder="What needs doing?"
                      placeholderTextColor={c.textTertiary}
                      autoFocus
                      maxLength={200}
                      onSubmitEditing={add}
                      returnKeyType="done"
                      style={[
                        type.body,
                        { color: c.text, paddingVertical: 6 },
                        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
                      ]}
                    />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                      {(['none', 'today', 'tomorrow', 'week'] as const).map((d) => (
                        <Chip
                          key={d}
                          small
                          label={d === 'none' ? 'No date' : d === 'week' ? 'In a week' : d[0].toUpperCase() + d.slice(1)}
                          active={draftDue === d}
                          onPress={() => setDraftDue(d)}
                        />
                      ))}
                      {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                        <Chip
                          key={p}
                          small
                          label={PRIORITY_META[p].label}
                          icon={PRIORITY_META[p].icon}
                          active={draftPriority === p}
                          onPress={() => setDraftPriority(p)}
                        />
                      ))}
                    </ScrollView>
                    {s.spaces.filter((x) => !x.archived).length > 0 ? (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                        <Chip small label="No space" active={draftSpace === null} onPress={() => setDraftSpace(null)} />
                        {s.spaces
                          .filter((x) => !x.archived)
                          .map((sp) => (
                            <Chip
                              key={sp.id}
                              small
                              label={`${sp.emoji} ${sp.name}`}
                              active={draftSpace === sp.id}
                              onPress={() => setDraftSpace(sp.id)}
                            />
                          ))}
                      </ScrollView>
                    ) : null}
                    <Tappable
                      onPress={add}
                      feedback="press"
                      scaleTo={0.97}
                      style={{
                        height: 46,
                        borderRadius: radius.pill,
                        backgroundColor: draft.trim() ? c.accent : c.surfaceSunken,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text variant="headline" color={draft.trim() ? c.onAccent : c.textTertiary}>
                        Add task
                      </Text>
                    </Tappable>
                  </View>
                </Glass>
              </View>
            </Reveal>
          </KeyboardAvoidingView>
        ) : null}
      </View>
      <Confetti fireKey={burst} />
    </>
  );
}
