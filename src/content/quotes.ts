/** Short original prompts shown on the Today screen. One per day. */
export const DAILY_PROMPTS: string[] = [
  'What is the one thing that would make today a good day if nothing else happened?',
  'Which open loop has been quietly costing you attention all week?',
  'Who is waiting on you right now and does not want to ask twice?',
  'What did you say yes to recently that you should have costed first?',
  'Which meeting this week could have been three written sentences?',
  'What decision are you re-making that was already made once?',
  'What would you stop doing if nobody would notice for a month?',
  'Whose good work did you see this week and not mention?',
  'What are you assuming today that you have never actually checked?',
  'Which task on your list is actually three tasks wearing a coat?',
  'What is the smallest version of the thing you are avoiding?',
  'If you could only send one message today, who would it go to?',
  'What broke last time that you never wrote down?',
  'What would you delegate today if handing it off took zero effort?',
  'Which conversation are you postponing that gets worse with age?',
];

export function dailyPrompt(dateKey: string): string {
  let hash = 0;
  for (const ch of dateKey) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return DAILY_PROMPTS[hash % DAILY_PROMPTS.length];
}
