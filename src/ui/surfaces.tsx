import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

/* ------------------------------------------------------------------ *
 * Aurora — the slowly drifting gradient field behind every screen.
 * Three oversized soft blobs on long, offset loops so the background
 * never repeats visibly.
 * ------------------------------------------------------------------ */
function Blob({
  colors,
  size,
  top,
  left,
  duration,
  delay,
  opacity,
}: {
  colors: [string, string];
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        opacity,
        transform: [
          { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [-38, 42] }) },
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [26, -34] }) },
          { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) },
        ],
      }}
    >
      <LinearGradient
        colors={[colors[0], colors[1], 'transparent']}
        locations={[0, 0.45, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ flex: 1, borderRadius: size / 2 }}
      />
    </Animated.View>
  );
}

export function Aurora({ intensity = 1 }: { intensity?: number }) {
  const { c, mode } = useTheme();
  const base = mode === 'dark' ? 0.5 : 0.42;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c.canvas }]} />
      <Blob
        colors={[c.accent, c.accent]}
        size={420}
        top={-150}
        left={-110}
        duration={17000}
        delay={0}
        opacity={base * intensity * (mode === 'dark' ? 0.38 : 0.3)}
      />
      <Blob
        colors={[c.iris, c.iris]}
        size={360}
        top={120}
        left={180}
        duration={21000}
        delay={1400}
        opacity={base * intensity * (mode === 'dark' ? 0.3 : 0.22)}
      />
      <Blob
        colors={[c.mint, c.mint]}
        size={400}
        top={430}
        left={-140}
        duration={25000}
        delay={2600}
        opacity={base * intensity * (mode === 'dark' ? 0.26 : 0.2)}
      />
      <LinearGradient
        colors={[
          mode === 'dark' ? 'rgba(16,14,12,0.1)' : 'rgba(247,243,238,0.2)',
          mode === 'dark' ? 'rgba(16,14,12,0.86)' : 'rgba(247,243,238,0.9)',
        ]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Card / Glass — the two surface treatments.
 * ------------------------------------------------------------------ */
export function Card({
  children,
  style,
  level = 1,
  padded = true,
  tint,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  level?: 0 | 1 | 2 | 3;
  padded?: boolean;
  tint?: string;
}) {
  const { c, radius, space, elev } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tint ?? c.surface,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: c.border,
          padding: padded ? space.lg : 0,
        },
        elev(level),
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Glass({
  children,
  style,
  intensity = 34,
  padded = true,
  radiusKey = 'lg',
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  padded?: boolean;
  radiusKey?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const { c, mode, radius, space, elev } = useTheme();
  return (
    <View
      style={[
        {
          borderRadius: radius[radiusKey],
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: c.glassEdge,
        },
        elev(2),
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c.glass }]} />
      <View style={{ padding: padded ? space.lg : 0 }}>{children}</View>
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  const { c } = useTheme();
  return (
    <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }, style]} />
  );
}

/* ------------------------------------------------------------------ *
 * Locked — the premium state. Content stays visible but softened, so
 * the value is legible before you pay for it.
 * ------------------------------------------------------------------ */
export function LockedVeil({
  title,
  body,
  cta,
  onPress,
}: {
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  const { c, mode, space, radius } = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }]}>
      <LinearGradient
        colors={[
          mode === 'dark' ? 'rgba(16,14,12,0)' : 'rgba(247,243,238,0)',
          mode === 'dark' ? 'rgba(16,14,12,0.93)' : 'rgba(247,243,238,0.95)',
          mode === 'dark' ? '#100E0C' : '#F7F3EE',
        ]}
        locations={[0, 0.42, 0.72]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ padding: space.xl, paddingBottom: space.xxl, gap: space.sm }}>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: c.accentSoft,
            paddingHorizontal: space.sm,
            paddingVertical: 6,
            borderRadius: radius.pill,
          }}
        >
          <Icon name="lock" size={13} color={c.accentText} />
          <Text variant="caption" color={c.accentText}>
            Hearth Pro
          </Text>
        </View>
        <Text variant="title2">{title}</Text>
        <Text variant="body" color={c.textSecondary}>
          {body}
        </Text>
        <PrimaryCta label={cta} onPress={onPress} icon="arrow-right" />
      </View>
    </View>
  );
}

// Imported lazily to avoid a circular import between surfaces and controls.
function PrimaryCta({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress: () => void;
  icon: IconName;
}) {
  const { Button } = require('./controls') as typeof import('./controls');
  return <Button label={label} onPress={onPress} icon={icon} style={{ marginTop: 8 }} />;
}
