import { PLAYBOOKS_CORE } from './playbooks-core';
import { PLAYBOOKS_PRO } from './playbooks-pro';
import type { Playbook } from './playbook-types';

export * from './playbook-types';

export const PLAYBOOKS: Playbook[] = [...PLAYBOOKS_CORE, ...PLAYBOOKS_PRO];

export const getPlaybook = (id: string) => PLAYBOOKS.find((p) => p.id === id);

/** A different playbook every day, deterministic per date. */
export function dailyPlaybook(dateKey: string): Playbook {
  let hash = 0;
  for (const ch of dateKey) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PLAYBOOKS[hash % PLAYBOOKS.length];
}
