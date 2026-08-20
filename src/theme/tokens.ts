/**
 * Hearth design tokens.
 *
 * One signature accent (Ember), semantic roles on top of it, a deliberate
 * type scale pairing Fraunces (display) with Plus Jakarta Sans (UI), and
 * fixed spacing / radius / elevation scales. Nothing in the app hardcodes a
 * colour or a font size outside this file.
 */

export type Mode = 'light' | 'dark';

const shared = {
  /** Accent-on colour is the same in both modes: Ember is dark enough for white. */
  onAccent: '#FFFFFF',
};

export const palettes = {
  light: {
    ...shared,
    canvas: '#F7F3EE',
    canvasAlt: '#EFE9E1',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    surfaceSunken: '#F1ECE4',
    glass: 'rgba(255,255,255,0.72)',
    glassEdge: 'rgba(255,255,255,0.9)',
    border: 'rgba(28,22,17,0.10)',
    borderStrong: 'rgba(28,22,17,0.18)',
    text: '#1B1512',
    textSecondary: '#6B5E54',
    textTertiary: '#9C8F84',
    textInverse: '#FBF7F2',

    accent: '#DC5528',
    accentPressed: '#BF4520',
    accentSoft: '#FBE7DD',
    accentSofter: '#FDF2EC',
    accentText: '#A83A19',

    iris: '#5B5BD6',
    irisSoft: '#E7E7FB',
    mint: '#0F9A74',
    mintSoft: '#DDF3EC',
    amber: '#B8820F',
    amberSoft: '#F9EED6',
    rose: '#C4384F',
    roseSoft: '#FAE3E7',

    scrim: 'rgba(27,21,18,0.42)',
    shadow: '#3B2A1E',
    skeleton: 'rgba(28,22,17,0.07)',
  },
  dark: {
    ...shared,
    canvas: '#100E0C',
    canvasAlt: '#171412',
    surface: '#1B1815',
    surfaceRaised: '#23201C',
    surfaceSunken: '#141210',
    glass: 'rgba(38,33,29,0.66)',
    glassEdge: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.09)',
    borderStrong: 'rgba(255,255,255,0.18)',
    text: '#F6F1EA',
    textSecondary: '#B0A498',
    textTertiary: '#7B7066',
    textInverse: '#16120F',

    accent: '#FF7A4D',
    accentPressed: '#E8663A',
    accentSoft: 'rgba(255,122,77,0.16)',
    accentSofter: 'rgba(255,122,77,0.08)',
    accentText: '#FF9670',

    iris: '#8E8EF7',
    irisSoft: 'rgba(142,142,247,0.16)',
    mint: '#41D2A6',
    mintSoft: 'rgba(65,210,166,0.15)',
    amber: '#F0B429',
    amberSoft: 'rgba(240,180,41,0.15)',
    rose: '#FF7089',
    roseSoft: 'rgba(255,112,137,0.15)',

    scrim: 'rgba(0,0,0,0.62)',
    shadow: '#000000',
    skeleton: 'rgba(255,255,255,0.06)',
  },
};

export type Palette = { [K in keyof typeof palettes.light]: string };

/** Accent hues available to spaces so a workspace can be scanned by colour. */
export const HUES = ['ember', 'iris', 'mint', 'amber', 'rose'] as const;
export type Hue = (typeof HUES)[number];

export function hueColor(p: Palette, hue: Hue) {
  switch (hue) {
    case 'iris':
      return { fg: p.iris, bg: p.irisSoft };
    case 'mint':
      return { fg: p.mint, bg: p.mintSoft };
    case 'amber':
      return { fg: p.amber, bg: p.amberSoft };
    case 'rose':
      return { fg: p.rose, bg: p.roseSoft };
    default:
      return { fg: p.accent, bg: p.accentSoft };
  }
}

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 44,
  giant: 64,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

/** The type scale. Every piece of text in Hearth uses one of these. */
export const type = {
  hero: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44, letterSpacing: -1.1 },
  title1: { fontFamily: fonts.display, fontSize: 30, lineHeight: 35, letterSpacing: -0.7 },
  title2: { fontFamily: fonts.display, fontSize: 23, lineHeight: 29, letterSpacing: -0.4 },
  title3: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.3 },
  headline: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 24, letterSpacing: -0.1 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, letterSpacing: -0.1 },
  callout: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  footnote: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  caption: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.1 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase' as const,
  },
  numeral: { fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 38, letterSpacing: -1 },
} as const;

export function elevation(mode: Mode, level: 0 | 1 | 2 | 3) {
  if (level === 0) return {};
  const dark = mode === 'dark';
  const conf = [
    null,
    { o: dark ? 0.35 : 0.06, r: 12, y: 4, e: 2 },
    { o: dark ? 0.45 : 0.09, r: 24, y: 10, e: 6 },
    { o: dark ? 0.55 : 0.14, r: 40, y: 18, e: 14 },
  ][level]!;
  return {
    shadowColor: palettes[mode].shadow,
    shadowOpacity: conf.o,
    shadowRadius: conf.r,
    shadowOffset: { width: 0, height: conf.y },
    elevation: conf.e,
  };
}

/** Motion constants so every animation in the app shares a personality. */
export const motion = {
  spring: { damping: 18, stiffness: 190, mass: 0.9 },
  springSoft: { damping: 22, stiffness: 130, mass: 1 },
  fast: 180,
  base: 280,
  slow: 460,
  stagger: 55,
} as const;
