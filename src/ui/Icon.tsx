import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

export type IconName = React.ComponentProps<typeof Feather>['name'];

/** The one icon set used everywhere in Hearth. */
export function Icon({
  name,
  size = 20,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}) {
  const { c } = useTheme();
  return <Feather name={name} size={size} color={color ?? c.text} style={style} />;
}
