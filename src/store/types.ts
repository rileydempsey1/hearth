import type { Hue } from '@/theme/tokens';
import type { ThemePref } from '@/theme/ThemeProvider';

export type EntryKind = 'note' | 'decision' | 'blocker' | 'win' | 'question';

export const ENTRY_KINDS: { key: EntryKind; label: string; icon: string; hue: Hue }[] = [
  { key: 'note', label: 'Note', icon: 'edit-3', hue: 'ember' },
  { key: 'decision', label: 'Decision', icon: 'flag', hue: 'iris' },
  { key: 'win', label: 'Win', icon: 'award', hue: 'mint' },
  { key: 'blocker', label: 'Blocker', icon: 'alert-triangle', hue: 'rose' },
  { key: 'question', label: 'Open question', icon: 'help-circle', hue: 'amber' },
];

export type Space = {
  id: string;
  name: string;
  emoji: string;
  hue: Hue;
  purpose: string;
  createdAt: number;
  pinned: boolean;
  archived: boolean;
  /** Per-space opt-in. Nothing notifies you unless you say so. */
  notify: boolean;
};

export type Entry = {
  id: string;
  spaceId: string;
  text: string;
  kind: EntryKind;
  createdAt: number;
  pinned: boolean;
  saved: boolean;
  /** Replies live under a parent entry; threads never nest deeper than one level. */
  parentId: string | null;
};

export type Priority = 'low' | 'med' | 'high';

export type Task = {
  id: string;
  spaceId: string | null;
  title: string;
  priority: Priority;
  due: string | null; // YYYY-MM-DD
  done: boolean;
  doneAt: number | null;
  createdAt: number;
};

export type TimeOfDay = { on: boolean; h: number; m: number };

export type NotifPrefs = {
  /** Master switch. Off means Hearth never schedules anything. */
  enabled: boolean;
  permission: 'unknown' | 'granted' | 'denied' | 'unsupported';
  morning: TimeOfDay;
  evening: TimeOfDay;
  weekly: TimeOfDay & { weekday: number }; // 1 = Sunday .. 7 = Saturday
  quiet: { on: boolean; from: number; to: number }; // hours
  lastScheduledAt: number | null;
};

export type Premium = {
  isPremium: boolean;
  plan: 'weekly' | 'yearly' | null;
  startedAt: number | null;
  trial: boolean;
};

export type State = {
  version: number;
  user: { name: string; role: string; focus: string[]; onboardedAt: number | null };
  prefs: { theme: ThemePref; reduceMotion: boolean; compact: boolean; hapticsOn: boolean };
  premium: Premium;
  notif: NotifPrefs;
  spaces: Space[];
  entries: Entry[];
  tasks: Task[];
  savedPlaybooks: string[];
  readPlaybooks: string[];
  streak: { current: number; longest: number; lastDay: string | null; days: string[] };
  recentSearches: string[];
};

export const FREE_SPACE_LIMIT = 3;

export const initialState: State = {
  version: 1,
  user: { name: '', role: '', focus: [], onboardedAt: null },
  prefs: { theme: 'system', reduceMotion: false, compact: false, hapticsOn: true },
  premium: { isPremium: false, plan: null, startedAt: null, trial: false },
  notif: {
    enabled: false,
    permission: 'unknown',
    morning: { on: true, h: 8, m: 30 },
    evening: { on: false, h: 17, m: 30 },
    weekly: { on: false, h: 16, m: 0, weekday: 6 },
    quiet: { on: true, from: 20, to: 7 },
    lastScheduledAt: null,
  },
  spaces: [],
  entries: [],
  tasks: [],
  savedPlaybooks: [],
  readPlaybooks: [],
  streak: { current: 0, longest: 0, lastDay: null, days: [] },
  recentSearches: [],
};
