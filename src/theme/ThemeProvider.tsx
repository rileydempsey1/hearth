import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { elevation, Mode, Palette, palettes, radius, space, type } from './tokens';

export type ThemePref = 'system' | 'light' | 'dark';

export type Theme = {
  mode: Mode;
  c: Palette;
  space: typeof space;
  radius: typeof radius;
  type: typeof type;
  elev: (level: 0 | 1 | 2 | 3) => object;
};

const ThemeCtx = createContext<Theme>({
  mode: 'light',
  c: palettes.light,
  space,
  radius,
  type,
  elev: (l) => elevation('light', l),
});

export function ThemeProvider({
  pref,
  children,
}: {
  pref: ThemePref;
  children: React.ReactNode;
}) {
  const system = useColorScheme();
  const mode: Mode = pref === 'system' ? (system === 'dark' ? 'dark' : 'light') : pref;

  const value = useMemo<Theme>(
    () => ({
      mode,
      c: palettes[mode],
      space,
      radius,
      type,
      elev: (level: 0 | 1 | 2 | 3) => elevation(mode, level),
    }),
    [mode]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
