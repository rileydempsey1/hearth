import type { IconName } from '@/ui/Icon';
import type { Hue } from '@/theme/tokens';

export type Category = 'Communication' | 'Meetings' | 'Projects' | 'Focus' | 'Leading';

export const CATEGORIES: { key: Category; label: string; icon: IconName; hue: Hue }[] = [
  { key: 'Communication', label: 'Communication', icon: 'message-square', hue: 'ember' },
  { key: 'Meetings', label: 'Meetings', icon: 'users', hue: 'iris' },
  { key: 'Projects', label: 'Projects', icon: 'layers', hue: 'mint' },
  { key: 'Focus', label: 'Focus', icon: 'target', hue: 'amber' },
  { key: 'Leading', label: 'Leading', icon: 'compass', hue: 'rose' },
];

export type Playbook = {
  id: string;
  title: string;
  deck: string;
  category: Category;
  minutes: number;
  pro: boolean;
  icon: IconName;
  hue: Hue;
  /** One-line summary shown in search results and saved items. */
  gist: string;
  sections: { heading: string; body: string }[];
  steps: string[];
  template?: { title: string; body: string };
  pitfalls: string[];
};

