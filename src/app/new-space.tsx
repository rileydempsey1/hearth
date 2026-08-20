import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptic } from '@/lib/haptics';
import { useStore } from '@/store/store';
import { useTheme } from '@/theme/ThemeProvider';
import { Hue, HUES, hueColor } from '@/theme/tokens';
import { Button, Field, IconButton } from '@/ui/controls';
import { Tappable } from '@/ui/motion';
import { Text } from '@/ui/Text';

const EMOJI = ['🔥', '🚀', '🧭', '🌱', '📦', '🎯', '💡', '🛠️', '📈', '🧪', '🗺️', '✍️', '🤝', '🏗️', '🎨', '🔬'];

export default function NewSpace() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c, space, radius } = useTheme();
  const store = useStore();

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [emoji, setEmoji] = useState('🔥');
  const [hue, setHue] = useState<Hue>('ember');

  const create = () => {
    if (!name.trim()) return;
    if (!store.canCreateSpace) {
      router.replace('/paywall?reason=spaces');
      return;
    }
    const id = store.addSpace({ name, emoji, hue, purpose });
    haptic.success();
    router.replace(`/space/${id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            padding: space.xl,
            paddingTop: Platform.OS === 'ios' ? space.xl : insets.top + space.lg,
            gap: space.lg,
            paddingBottom: insets.bottom + space.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="title1">New space</Text>
            <IconButton name="x" onPress={() => router.back()} accessibilityLabel="Close" />
          </View>

          <View style={{ alignItems: 'center', gap: space.sm }}>
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: radius.lg,
                backgroundColor: hueColor(c, hue).bg,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: c.border,
              }}
            >
              <Text style={{ fontSize: 40 }}>{emoji}</Text>
            </View>
          </View>

          <Field
            label="Name"
            placeholder="e.g. Q2 launch, Job hunt, The book"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={40}
            returnKeyType="next"
          />
          <Field
            label="What is this space for?"
            placeholder="One line so future-you remembers"
            value={purpose}
            onChangeText={setPurpose}
            maxLength={90}
          />

          <View style={{ gap: 10 }}>
            <Text variant="eyebrow" color={c.textTertiary}>
              Icon
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {EMOJI.map((e) => (
                <Tappable key={e} onPress={() => setEmoji(e)} feedback="select" scaleTo={0.88}>
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: radius.sm,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: emoji === e ? hueColor(c, hue).bg : c.surface,
                      borderWidth: emoji === e ? 1.5 : StyleSheet.hairlineWidth,
                      borderColor: emoji === e ? hueColor(c, hue).fg : c.border,
                    }}
                  >
                    <Text style={{ fontSize: 21 }}>{e}</Text>
                  </View>
                </Tappable>
              ))}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Text variant="eyebrow" color={c.textTertiary}>
              Colour
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {HUES.map((h) => {
                const tone = hueColor(c, h);
                return (
                  <Tappable key={h} onPress={() => setHue(h)} feedback="select" scaleTo={0.85}>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: tone.fg,
                        borderWidth: 3,
                        borderColor: hue === h ? c.text : 'transparent',
                      }}
                    />
                  </Tappable>
                );
              })}
            </View>
          </View>

          <Button label="Create space" icon="arrow-right" onPress={create} disabled={!name.trim()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
