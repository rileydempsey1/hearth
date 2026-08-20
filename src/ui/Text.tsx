import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { type as typeScale } from '@/theme/tokens';

export type Variant = keyof typeof typeScale;

/**
 * The only text component in the app. Variants come straight from the
 * type scale, so nothing ever falls back to a platform default font.
 */
export function Text({
  variant = 'body',
  color,
  center,
  style,
  children,
  ...rest
}: TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
  children?: React.ReactNode;
}) {
  const { c } = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        typeScale[variant] as TextStyle,
        { color: color ?? c.text },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
