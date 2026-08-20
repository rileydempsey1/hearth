import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addDays, dayKey } from '@/lib/date';
import type { ThemePref } from '@/theme/ThemeProvider';
import type { Hue } from '@/theme/tokens';
import {
  Entry,
  EntryKind,
  FREE_SPACE_LIMIT,
  initialState,
  NotifPrefs,
  Priority,
  Space,
  State,
  Task,
} from './types';

const KEY = 'hearth.state.v1';

export const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

type Store = {
  s: State;
  hydrated: boolean;
  storageError: string | null;

  /** True when the user has finished onboarding at least once. */
  onboarded: boolean;
  canCreateSpace: boolean;

  completeOnboarding: (u: { name: string; role: string; focus: string[] }) => void;
  setPrefs: (p: Partial<State['prefs']>) => void;
  setTheme: (t: ThemePref) => void;

  unlockPremium: (plan: 'weekly' | 'yearly') => void;
  restorePremium: () => boolean;
  resetPremium: () => void;

  setNotif: (n: Partial<NotifPrefs>) => void;

  addSpace: (s: { name: string; emoji: string; hue: Hue; purpose: string }) => string;
  updateSpace: (id: string, patch: Partial<Space>) => void;
  removeSpace: (id: string) => void;

  addEntry: (e: {
    spaceId: string;
    text: string;
    kind: EntryKind;
    parentId?: string | null;
  }) => { entry: Entry; streakExtended: boolean };
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  removeEntry: (id: string) => void;

  addTask: (t: { title: string; spaceId: string | null; priority?: Priority; due?: string | null }) => Task;
  toggleTask: (id: string) => { streakExtended: boolean };
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;

  togglePlaybookSaved: (id: string) => void;
  markPlaybookRead: (id: string) => void;

  pushRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;

  eraseEverything: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

/** Merge persisted JSON onto defaults so added fields never crash an old install. */
function reconcile(raw: unknown): State {
  if (!raw || typeof raw !== 'object') return initialState;
  const p = raw as Partial<State>;
  return {
    ...initialState,
    ...p,
    user: { ...initialState.user, ...(p.user ?? {}) },
    prefs: { ...initialState.prefs, ...(p.prefs ?? {}) },
    premium: { ...initialState.premium, ...(p.premium ?? {}) },
    notif: {
      ...initialState.notif,
      ...(p.notif ?? {}),
      morning: { ...initialState.notif.morning, ...(p.notif?.morning ?? {}) },
      evening: { ...initialState.notif.evening, ...(p.notif?.evening ?? {}) },
      weekly: { ...initialState.notif.weekly, ...(p.notif?.weekly ?? {}) },
      quiet: { ...initialState.notif.quiet, ...(p.notif?.quiet ?? {}) },
    },
    streak: { ...initialState.streak, ...(p.streak ?? {}) },
    spaces: Array.isArray(p.spaces) ? p.spaces : [],
    entries: Array.isArray(p.entries) ? p.entries : [],
    tasks: Array.isArray(p.tasks) ? p.tasks : [],
    savedPlaybooks: Array.isArray(p.savedPlaybooks) ? p.savedPlaybooks : [],
    readPlaybooks: Array.isArray(p.readPlaybooks) ? p.readPlaybooks : [],
    recentSearches: Array.isArray(p.recentSearches) ? p.recentSearches : [],
  };
}

/** Advance the streak if today has not been counted yet. Pure. */
function bumpStreak(s: State): { streak: State['streak']; extended: boolean } {
  const today = dayKey();
  if (s.streak.lastDay === today) return { streak: s.streak, extended: false };
  const continued = s.streak.lastDay === addDays(today, -1);
  const current = continued ? s.streak.current + 1 : 1;
  return {
    streak: {
      current,
      longest: Math.max(current, s.streak.longest),
      lastDay: today,
      days: [...s.streak.days.filter((d) => d !== today), today].slice(-400),
    },
    extended: true,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (!alive) return;
        if (raw) setS(reconcile(JSON.parse(raw)));
      } catch (e) {
        if (!alive) return;
        setStorageError(
          'We could not read your saved workspace. Nothing has been deleted — restarting Hearth usually fixes this.'
        );
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !dirty.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() =>
        setStorageError('Your last change could not be saved to this device.')
      );
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [s, hydrated]);

  const mutate = useCallback((fn: (prev: State) => State) => {
    dirty.current = true;
    setS(fn);
  }, []);

  const api = useMemo<Omit<Store, 's' | 'hydrated' | 'storageError' | 'onboarded' | 'canCreateSpace'>>(
    () => ({
      completeOnboarding: (u) =>
        mutate((p) => ({ ...p, user: { ...u, onboardedAt: Date.now() } })),

      setPrefs: (patch) => mutate((p) => ({ ...p, prefs: { ...p.prefs, ...patch } })),
      setTheme: (theme) => mutate((p) => ({ ...p, prefs: { ...p.prefs, theme } })),

      unlockPremium: (plan) =>
        mutate((p) => ({
          ...p,
          premium: { isPremium: true, plan, startedAt: Date.now(), trial: true },
        })),
      restorePremium: () => {
        // Mocked: a purchase only ever existed on this device.
        let found = false;
        setS((p) => {
          found = p.premium.startedAt !== null;
          return p;
        });
        return found;
      },
      resetPremium: () =>
        mutate((p) => ({
          ...p,
          premium: { isPremium: false, plan: null, startedAt: null, trial: false },
        })),

      setNotif: (patch) => mutate((p) => ({ ...p, notif: { ...p.notif, ...patch } })),

      addSpace: (input) => {
        const id = uid();
        mutate((p) => ({
          ...p,
          spaces: [
            ...p.spaces,
            {
              id,
              name: input.name.trim() || 'Untitled space',
              emoji: input.emoji,
              hue: input.hue,
              purpose: input.purpose.trim(),
              createdAt: Date.now(),
              pinned: false,
              archived: false,
              notify: false,
            },
          ],
        }));
        return id;
      },
      updateSpace: (id, patch) =>
        mutate((p) => ({
          ...p,
          spaces: p.spaces.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      removeSpace: (id) =>
        mutate((p) => ({
          ...p,
          spaces: p.spaces.filter((x) => x.id !== id),
          entries: p.entries.filter((e) => e.spaceId !== id),
          tasks: p.tasks.filter((t) => t.spaceId !== id),
        })),

      addEntry: ({ spaceId, text, kind, parentId = null }) => {
        const entry: Entry = {
          id: uid(),
          spaceId,
          text: text.trim(),
          kind,
          createdAt: Date.now(),
          pinned: false,
          saved: false,
          parentId,
        };
        let extended = false;
        mutate((p) => {
          const b = bumpStreak(p);
          extended = b.extended;
          return { ...p, entries: [...p.entries, entry], streak: b.streak };
        });
        return { entry, streakExtended: extended };
      },
      updateEntry: (id, patch) =>
        mutate((p) => ({
          ...p,
          entries: p.entries.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      removeEntry: (id) =>
        mutate((p) => ({
          ...p,
          entries: p.entries.filter((x) => x.id !== id && x.parentId !== id),
        })),

      addTask: ({ title, spaceId, priority = 'med', due = null }) => {
        const task: Task = {
          id: uid(),
          spaceId,
          title: title.trim(),
          priority,
          due,
          done: false,
          doneAt: null,
          createdAt: Date.now(),
        };
        mutate((p) => ({ ...p, tasks: [...p.tasks, task] }));
        return task;
      },
      toggleTask: (id) => {
        let extended = false;
        mutate((p) => {
          const target = p.tasks.find((t) => t.id === id);
          if (!target) return p;
          const nowDone = !target.done;
          const tasks = p.tasks.map((t) =>
            t.id === id ? { ...t, done: nowDone, doneAt: nowDone ? Date.now() : null } : t
          );
          if (!nowDone) return { ...p, tasks };
          const b = bumpStreak(p);
          extended = b.extended;
          return { ...p, tasks, streak: b.streak };
        });
        return { streakExtended: extended };
      },
      updateTask: (id, patch) =>
        mutate((p) => ({ ...p, tasks: p.tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      removeTask: (id) => mutate((p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== id) })),

      togglePlaybookSaved: (id) =>
        mutate((p) => ({
          ...p,
          savedPlaybooks: p.savedPlaybooks.includes(id)
            ? p.savedPlaybooks.filter((x) => x !== id)
            : [...p.savedPlaybooks, id],
        })),
      markPlaybookRead: (id) =>
        mutate((p) =>
          p.readPlaybooks.includes(id)
            ? p
            : { ...p, readPlaybooks: [...p.readPlaybooks, id] }
        ),

      pushRecentSearch: (q) => {
        const query = q.trim();
        if (query.length < 2) return;
        mutate((p) => ({
          ...p,
          recentSearches: [query, ...p.recentSearches.filter((x) => x !== query)].slice(0, 8),
        }));
      },
      clearRecentSearches: () => mutate((p) => ({ ...p, recentSearches: [] })),

      eraseEverything: async () => {
        dirty.current = false;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        try {
          await AsyncStorage.removeItem(KEY);
        } catch {
          /* the in-memory reset below is still the right outcome */
        }
        setS(initialState);
      },
    }),
    [mutate]
  );

  const value = useMemo<Store>(
    () => ({
      s,
      hydrated,
      storageError,
      onboarded: s.user.onboardedAt !== null,
      canCreateSpace: s.premium.isPremium || s.spaces.length < FREE_SPACE_LIMIT,
      ...api,
    }),
    [s, hydrated, storageError, api]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside <StoreProvider>');
  return v;
}
