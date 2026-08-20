import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from './Icon';
import { Tappable } from './motion';
import { Text } from './Text';

/* --------------------------------- Button -------------------------------- */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconRight = true,
  size = 'lg',
  disabled,
  loading,
  full = true,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  iconRight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  style?: ViewStyle | ViewStyle[];
}) {
  const { c, radius, elev } = useTheme();
  const h = size === 'lg' ? 54 : size === 'md' ? 46 : 38;
  const px = size === 'lg' ? 22 : size === 'md' ? 18 : 14;

  const fg =
    variant === 'primary'
      ? c.onAccent
      : variant === 'danger'
        ? c.rose
        : variant === 'secondary'
          ? c.text
          : c.accentText;

  const body = (
    <View
      style={{
        height: h,
        paddingHorizontal: px,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
      }}
    >
      {icon && !iconRight ? <Icon name={icon} size={17} color={fg} /> : null}
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <Text variant={size === 'sm' ? 'footnote' : 'headline'} color={fg}>
          {label}
        </Text>
      )}
      {icon && iconRight && !loading ? <Icon name={icon} size={17} color={fg} /> : null}
    </View>
  );

  return (
    <Tappable
      onPress={onPress}
      disabled={disabled || loading}
      feedback={variant === 'primary' ? 'press' : 'tap'}
      scaleTo={0.975}
      accessibilityLabel={label}
      style={[
        {
          borderRadius: radius.pill,
          overflow: 'hidden',
          opacity: disabled ? 0.45 : 1,
          alignSelf: full ? 'stretch' : 'flex-start',
        },
        variant === 'primary' ? elev(2) : undefined,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[c.accent, c.accentPressed]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {body}
        </LinearGradient>
      ) : (
        <View
          style={{
            backgroundColor:
              variant === 'secondary'
                ? c.surface
                : variant === 'danger'
                  ? c.roseSoft
                  : 'transparent',
            borderWidth: variant === 'ghost' ? 0 : StyleSheet.hairlineWidth,
            borderColor: variant === 'danger' ? 'transparent' : c.border,
            borderRadius: radius.pill,
          }}
        >
          {body}
        </View>
      )}
    </Tappable>
  );
}

/* -------------------------------- IconButton ------------------------------ */
export function IconButton({
  name,
  onPress,
  size = 40,
  tone = 'surface',
  color,
  accessibilityLabel,
}: {
  name: IconName;
  onPress: () => void;
  size?: number;
  tone?: 'surface' | 'plain' | 'accent';
  color?: string;
  accessibilityLabel?: string;
}) {
  const { c, radius } = useTheme();
  return (
    <Tappable
      onPress={onPress}
      scaleTo={0.9}
      accessibilityLabel={accessibilityLabel ?? name}
      style={{
        width: size,
        height: size,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
          tone === 'surface' ? c.surface : tone === 'accent' ? c.accentSoft : 'transparent',
        borderWidth: tone === 'surface' ? StyleSheet.hairlineWidth : 0,
        borderColor: c.border,
      }}
    >
      <Icon
        name={name}
        size={size * 0.45}
        color={color ?? (tone === 'accent' ? c.accentText : c.text)}
      />
    </Tappable>
  );
}

/* ----------------------------------- Chip --------------------------------- */
export function Chip({
  label,
  active,
  onPress,
  icon,
  tone,
  small,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: IconName;
  tone?: { fg: string; bg: string };
  small?: boolean;
}) {
  const { c, radius } = useTheme();
  const fg = active ? c.onAccent : (tone?.fg ?? c.textSecondary);
  const bg = active ? c.accent : (tone?.bg ?? c.surface);

  const inner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: small ? 10 : 14,
        height: small ? 28 : 36,
        borderRadius: radius.pill,
        backgroundColor: bg,
        borderWidth: tone || active ? 0 : StyleSheet.hairlineWidth,
        borderColor: c.border,
      }}
    >
      {icon ? <Icon name={icon} size={small ? 12 : 14} color={fg} /> : null}
      <Text variant={small ? 'caption' : 'footnote'} color={fg}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) return inner;
  return (
    <Tappable onPress={onPress} feedback="select" scaleTo={0.94}>
      {inner}
    </Tappable>
  );
}

/* ---------------------------- SegmentedControl ---------------------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { c, radius } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: c.surfaceSunken,
        borderRadius: radius.pill,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Tappable
            key={o.key}
            onPress={() => onChange(o.key)}
            feedback="select"
            scaleTo={0.96}
            style={{ flex: 1 }}
          >
            <View
              style={{
                height: 38,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.pill,
                backgroundColor: active ? c.surface : 'transparent',
                borderWidth: active ? StyleSheet.hairlineWidth : 0,
                borderColor: c.border,
              }}
            >
              <Text variant="footnote" color={active ? c.text : c.textSecondary}>
                {o.label}
              </Text>
            </View>
          </Tappable>
        );
      })}
    </View>
  );
}

/* ---------------------------------- Toggle -------------------------------- */
export function Toggle({
  value,
  onChange,
  accessibilityLabel,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  accessibilityLabel?: string;
}) {
  const { c } = useTheme();
  return (
    <Tappable
      onPress={() => {
        haptic.select();
        onChange(!value);
      }}
      feedback="none"
      scaleTo={0.92}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={{
          width: 52,
          height: 31,
          borderRadius: 999,
          padding: 3,
          backgroundColor: value ? c.accent : c.surfaceSunken,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: value ? 'transparent' : c.border,
          alignItems: value ? 'flex-end' : 'flex-start',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 999,
            backgroundColor: value ? '#FFFFFF' : c.surface,
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
        />
      </View>
    </Tappable>
  );
}

/* ---------------------------------- Field --------------------------------- */
export function Field({
  label,
  hint,
  style,
  ...rest
}: TextInputProps & { label?: string; hint?: string; style?: any }) {
  const { c, radius, space, type } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <Text variant="eyebrow" color={c.textTertiary}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={c.textTertiary}
        selectionColor={c.accent}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          type.body,
          {
            color: c.text,
            backgroundColor: c.surface,
            borderRadius: radius.md,
            borderWidth: focused ? 1.5 : StyleSheet.hairlineWidth,
            borderColor: focused ? c.accent : c.border,
            paddingHorizontal: space.md,
            paddingVertical: Platform.OS === 'ios' ? 14 : 10,
            minHeight: 50,
          },
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
          style,
        ]}
      />
      {hint ? (
        <Text variant="caption" color={c.textTertiary}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------- TimePicker ------------------------------ */
/**
 * A hand-built time picker. Avoids the platform picker entirely so the
 * control looks identical in both themes and on every platform.
 */
export function TimePicker({
  h,
  m,
  onChange,
}: {
  h: number;
  m: number;
  onChange: (h: number, m: number) => void;
}) {
  const { c, radius, space } = useTheme();
  const pm = h >= 12;
  const hour12 = h % 12 === 0 ? 12 : h % 12;

  const set = (nh: number, nm: number, npm: boolean) => {
    const base = nh % 12;
    onChange(npm ? base + 12 : base, nm);
  };

  const Stepper = ({
    value,
    onUp,
    onDown,
    label,
  }: {
    value: string;
    onUp: () => void;
    onDown: () => void;
    label: string;
  }) => (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <IconButton name="chevron-up" size={34} onPress={onUp} accessibilityLabel={`${label} up`} />
      <View
        style={{
          minWidth: 74,
          paddingVertical: space.sm,
          borderRadius: radius.md,
          backgroundColor: c.surfaceSunken,
          alignItems: 'center',
        }}
      >
        <Text variant="title2">{value}</Text>
      </View>
      <IconButton
        name="chevron-down"
        size={34}
        onPress={onDown}
        accessibilityLabel={`${label} down`}
      />
    </View>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space.sm,
      }}
    >
      <Stepper
        label="Hour"
        value={`${hour12}`}
        onUp={() => set((hour12 % 12) + 1, m, pm)}
        onDown={() => set(((hour12 + 10) % 12) + 1, m, pm)}
      />
      <Text variant="title2" color={c.textTertiary}>
        :
      </Text>
      <Stepper
        label="Minute"
        value={`${m}`.padStart(2, '0')}
        onUp={() => set(hour12, (m + 5) % 60, pm)}
        onDown={() => set(hour12, (m + 55) % 60, pm)}
      />
      <View style={{ gap: 6, marginLeft: space.xs }}>
        {(['AM', 'PM'] as const).map((x) => {
          const active = (x === 'PM') === pm;
          return (
            <Tappable key={x} onPress={() => set(hour12, m, x === 'PM')} feedback="select">
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: radius.sm,
                  backgroundColor: active ? c.accent : c.surfaceSunken,
                }}
              >
                <Text variant="footnote" color={active ? c.onAccent : c.textSecondary}>
                  {x}
                </Text>
              </View>
            </Tappable>
          );
        })}
      </View>
    </View>
  );
}
