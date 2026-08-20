import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { IconButton } from './controls';
import { Icon, IconName } from './Icon';
import { Reveal } from './motion';
import { Aurora, Card } from './surfaces';
import { Text } from './Text';

export function Screen({
  children,
  scroll = false,
  padded = true,
  aurora = 1,
  contentStyle,
  edges = { top: true, bottom: false },
  footer,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  aurora?: number;
  contentStyle?: ViewStyle | ViewStyle[];
  edges?: { top?: boolean; bottom?: boolean };
  footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { space } = useTheme();

  const pad: ViewStyle = {
    paddingTop: edges.top ? insets.top : 0,
    paddingBottom: edges.bottom ? insets.bottom : 0,
    paddingHorizontal: padded ? space.lg : 0,
  };

  return (
    <View style={{ flex: 1 }}>
      <Aurora intensity={aurora} />
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[pad, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
      )}
      {footer}
    </View>
  );
}

export function NavBar({
  title,
  subtitle,
  back,
  right,
  onBack,
}: {
  title?: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  const router = useRouter();
  const { c, space } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.sm,
        minHeight: 48,
        marginBottom: space.xs,
      }}
    >
      {back ? (
        <IconButton
          name="chevron-left"
          onPress={() => (onBack ? onBack() : router.back())}
          accessibilityLabel="Go back"
        />
      ) : null}
      <View style={{ flex: 1 }}>
        {title ? (
          <Text variant="title3" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" color={c.textTertiary} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
  icon,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  icon?: IconName;
}) {
  const { c, space } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: space.sm,
        marginTop: space.xs,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        {icon ? <Icon name={icon} size={13} color={c.textTertiary} /> : null}
        <Text variant="eyebrow" color={c.textTertiary}>
          {title}
        </Text>
      </View>
      {action && onAction ? (
        <Text variant="caption" color={c.accentText} onPress={onAction} suppressHighlighting>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

/* --------------------------------- Empty ---------------------------------- */
export function EmptyState({
  icon,
  title,
  body,
  action,
  compact,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  const { c, space, radius } = useTheme();
  return (
    <Reveal>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: compact ? space.xl : space.giant,
          paddingHorizontal: space.lg,
          gap: space.sm,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: c.accentSofter,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: c.border,
            marginBottom: space.xs,
          }}
        >
          <Icon name={icon} size={26} color={c.accent} />
        </View>
        <Text variant="title3" center>
          {title}
        </Text>
        <Text variant="callout" color={c.textSecondary} center style={{ maxWidth: 300 }}>
          {body}
        </Text>
        {action ? <View style={{ marginTop: space.xs }}>{action}</View> : null}
      </View>
    </Reveal>
  );
}

/* -------------------------------- Skeleton -------------------------------- */
export function Skeleton({
  h = 16,
  w = '100%',
  r = 8,
  style,
}: {
  h?: number;
  w?: number | `${number}%`;
  r?: number;
  style?: ViewStyle;
}) {
  const { c } = useTheme();
  return (
    <View
      style={[{ height: h, width: w, borderRadius: r, backgroundColor: c.skeleton }, style]}
    />
  );
}

export function SkeletonCard() {
  const { space } = useTheme();
  return (
    <Card style={{ gap: space.sm }}>
      <Skeleton h={12} w="34%" />
      <Skeleton h={20} w="82%" />
      <Skeleton h={12} w="60%" />
    </Card>
  );
}

/* ------------------------------- ProgressRing ----------------------------- */
export function ProgressRing({
  progress,
  size = 58,
  stroke = 6,
  color,
  track,
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={track ?? c.surfaceSunken}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color ?? c.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/* ---------------------------------- Row ----------------------------------- */
export function Row({
  icon,
  iconColor,
  title,
  subtitle,
  right,
  onPress,
  danger,
}: {
  icon?: IconName;
  iconColor?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  const { c, space, radius } = useTheme();
  const { Tappable } = require('./motion') as typeof import('./motion');

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.sm,
        paddingVertical: 13,
        paddingHorizontal: space.md,
      }}
    >
      {icon ? (
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: radius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: danger ? c.roseSoft : c.surfaceSunken,
          }}
        >
          <Icon name={icon} size={16} color={danger ? c.rose : (iconColor ?? c.textSecondary)} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyMedium" color={danger ? c.rose : c.text}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color={c.textTertiary}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron-right" size={17} color={c.textTertiary} /> : null)}
    </View>
  );

  if (!onPress) return content;
  return (
    <Tappable onPress={onPress} scaleTo={0.99}>
      {content}
    </Tappable>
  );
}

export function Group({ children }: { children: React.ReactNode }) {
  const { c, radius } = useTheme();
  const kids = React.Children.toArray(children);
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderRadius: radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: c.border,
        overflow: 'hidden',
      }}
    >
      {kids.map((k, i) => (
        <View key={i}>
          {i > 0 ? (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: c.border,
                marginLeft: 62,
              }}
            />
          ) : null}
          {k}
        </View>
      ))}
    </View>
  );
}
