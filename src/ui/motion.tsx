import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { motion } from '@/theme/tokens';

/* ------------------------------------------------------------------ *
 * Reveal — content fades and slides in on first render.
 * Every list and every screen body uses it, staggered by index.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  from = 14,
  style,
  disabled,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: number;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}) {
  const v = useRef(new Animated.Value(disabled ? 1 : 0)).current;

  useEffect(() => {
    if (disabled) {
      v.setValue(1);
      return;
    }
    const anim = Animated.timing(v, {
      toValue: 1,
      duration: motion.base,
      delay,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [v, delay, disabled]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ *
 * Tappable — every interactive surface compresses on press and fires
 * a haptic. This is the single press behaviour in the app.
 * ------------------------------------------------------------------ */
export function Tappable({
  children,
  onPress,
  onLongPress,
  style,
  scaleTo = 0.965,
  feedback = 'tap',
  disabled,
  hitSlop = 6,
  accessibilityLabel,
  accessibilityRole = 'button',
}: {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle | ViewStyle[] | any;
  scaleTo?: number;
  feedback?: 'tap' | 'press' | 'select' | 'none';
  disabled?: boolean;
  hitSlop?: number;
  accessibilityLabel?: string;
  accessibilityRole?: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const to = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Pressable
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      onPress={() => {
        if (feedback !== 'none') haptic[feedback]();
        onPress?.();
      }}
      onLongPress={
        onLongPress
          ? () => {
              haptic.press();
              onLongPress();
            }
          : undefined
      }
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * Confetti — the celebratory moment. Fires when premium unlocks and
 * when a streak extends. Hand-rolled so it works on every platform.
 * ------------------------------------------------------------------ */
type Piece = { x: number; delay: number; rot: number; size: number; color: string; drift: number };

export function Confetti({
  fireKey,
  count = 46,
  onDone,
}: {
  /** Change this value to fire a burst. */
  fireKey: number;
  count?: number;
  onDone?: () => void;
}) {
  const { c } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;

  const pieces = useMemo<Piece[]>(() => {
    const colors = [c.accent, c.iris, c.mint, c.amber, c.rose];
    return Array.from({ length: count }, (_, i) => ({
      x: (i / count) * 100 + (Math.random() * 8 - 4),
      delay: Math.random() * 220,
      rot: Math.random() * 720 - 360,
      size: 5 + Math.random() * 7,
      color: colors[i % colors.length],
      drift: Math.random() * 90 - 45,
    }));
    // A new burst gets a fresh spread of pieces.
  }, [fireKey, count, c.accent, c.iris, c.mint, c.amber, c.rose]);

  useEffect(() => {
    if (!fireKey) return;
    progress.setValue(0);
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: 2100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    anim.start(({ finished }) => finished && onDone?.());
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fireKey]);

  if (!fireKey) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Animated.View
          key={`${fireKey}-${i}`}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 1.7,
            borderRadius: 2,
            backgroundColor: p.color,
            opacity: progress.interpolate({
              inputRange: [0, 0.1, 0.75, 1],
              outputRange: [0, 1, 1, 0],
            }),
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 820],
                }),
              },
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, p.drift],
                }),
              },
              {
                rotate: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${p.rot}deg`],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Pulse — a slow breathing scale used behind hero numbers.
 * ------------------------------------------------------------------ */
export function usePulse(active = true) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, active]);
  return v;
}

export const isWeb = Platform.OS === 'web';
