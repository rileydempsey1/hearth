import type { Playbook } from './playbook-types';

export const PLAYBOOKS_CORE: Playbook[] = [
  {
    id: 'status-update',
    title: 'The status update nobody skims past',
    deck: 'Most updates are written to prove effort. Write yours to remove doubt.',
    category: 'Communication',
    minutes: 4,
    pro: false,
    icon: 'send',
    hue: 'ember',
    gist: 'Lead with the state of the thing, not the list of what you did.',
    sections: [
      {
        heading: 'Why yours gets skimmed',
        body: "The default status update is a diary: a list of things you touched, in the order you touched them. Diaries are written from the author's point of view, and they force the reader to do the work of figuring out whether anything is wrong. Readers who have to do that work will stop doing it, and your update becomes wallpaper.\n\nAn update that gets read answers one question in the first sentence: is this on track or not? Everything after that sentence is evidence.",
      },
      {
        heading: 'The shape',
        body: "Open with a state word — on track, at risk, blocked, done — and a date. Follow with the single most important change since the last update. Then the decision you need, if any, with a name and a deadline attached to it. Then the detail, for the two people who want it.\n\nThat ordering is deliberate. It means someone can read one line and be correctly informed, three lines and be usefully informed, or the whole thing and be fully informed. All three of those readers exist, and only the third one has time.",
      },
      {
        heading: 'Say the number',
        body: "Vague updates create follow-up meetings. 'Making good progress on the migration' produces a meeting. '7 of 11 services migrated; the remaining 4 are the ones with custom auth' produces a nod.\n\nIf you cannot put a number on it, say what the number would be if you could measure it, and say when you will be able to. Naming the shape of your uncertainty is itself information.",
      },
      {
        heading: 'Write the bad news first',
        body: "The instinct is to lead with wins and bury the slip at the bottom, where it reads as an afterthought. Everyone knows this trick, including you when you read someone else's update.\n\nBad news that you volunteer is a sign of control. Bad news that someone discovers is a sign of the opposite. The slip costs you the same either way; only your credibility is on the table, and only in one of those versions do you keep it.",
      },
    ],
    steps: [
      'Open with a state word and a date',
      'Name the single biggest change since last time',
      'Put every ask in one place, with an owner and a date',
      'Give the number, or say when you will have it',
      'Detail last, for the people who want it',
    ],
    template: {
      title: 'Status update',
      body: 'STATE — At risk. Ship date moves from Mar 14 to Mar 21.\n\nWHAT CHANGED — Payment provider sandbox has been down since Tuesday, which cost us three days of integration testing.\n\nWHAT I NEED — A decision from Dana by Friday: ship without refunds in v1, or hold the whole release.\n\nDETAIL — 7 of 11 flows are done and tested. Refunds and disputes are the two that touch the provider directly. Everything else is unaffected.',
    },
    pitfalls: [
      'Listing activity instead of state',
      'Burying the ask in the last paragraph',
      'Using "soon" where a date belongs',
      'Writing it for your manager instead of for everyone who is blocked',
    ],
  },
  {
    id: 'async-message',
    title: 'The async-first message',
    deck: 'A message that needs a meeting to be understood was written badly.',
    category: 'Communication',
    minutes: 4,
    pro: false,
    icon: 'message-circle',
    hue: 'ember',
    gist: 'Front-load context so the reply can happen without you in the room.',
    sections: [
      {
        heading: 'The test',
        body: "Before you send anything, read it back and ask: could someone who was not in my head this morning act on this without asking me a clarifying question?\n\nIf the answer is no, you have not written a message. You have written an invitation to a meeting, and the meeting is the tax you pay for the paragraph you did not write.",
      },
      {
        heading: 'Context, ask, deadline',
        body: "Three parts, always in that order. Context is the two sentences that let a reader who has been elsewhere all week understand why this matters now. The ask is exactly one thing, phrased as a verb. The deadline is a real date and time, not 'when you get a chance'.\n\nMost bad messages have two of the three. The missing one is almost always context, because you have it and forget that nobody else does.",
      },
      {
        heading: 'One thread, one topic',
        body: "The single largest source of confusion in written work is a thread that changed subject halfway down. Once a thread has two topics, every reader after that point has to read both to find theirs, and neither gets resolved cleanly.\n\nWhen a reply opens a new topic, start a new thread and link back. It costs you ten seconds and saves everyone else the archaeology.",
      },
      {
        heading: 'Make the default answer easy',
        body: "If you need a decision, propose one. 'Should we do A or B?' gets silence. 'I plan to do A unless someone objects by Thursday — here is why B is worse' gets either agreement or a fast, specific correction.\n\nThis is not railroading. It is doing the thinking in public so that the reply can be short. People answer short questions. They postpone open ones.",
      },
    ],
    steps: [
      'Two sentences of context, written for someone who was away',
      'Exactly one ask, phrased as a verb',
      'A real date and time',
      'Propose the answer you would pick, and why',
      'New topic means new thread',
    ],
    template: {
      title: 'Async ask',
      body: "CONTEXT — We agreed in January to keep the legacy export running until Q3. Two customers have now built workflows on top of it, which changes the cost of turning it off.\n\nASK — Confirm whether we still turn it off in July, or whether we commit to it for another year.\n\nBY — Thursday 5pm, so I can put it in the roadmap draft.\n\nMY RECOMMENDATION — Keep it for another year. Two customers is small, but both are on renewals in August and this is the kind of thing that shows up in those conversations.",
    },
    pitfalls: [
      'Writing "quick question" and then not asking one',
      'Assuming the reader remembers a decision from six weeks ago',
      'Asking three things in one message and getting one answer',
      'Sending at 6pm and expecting a reply at 9am',
    ],
  },
  {
    id: 'standup-nine',
    title: 'Run a standup in nine minutes',
    deck: 'The daily meeting is not a status report. It is a blocker market.',
    category: 'Meetings',
    minutes: 5,
    pro: false,
    icon: 'sunrise',
    hue: 'iris',
    gist: 'Trade blockers, not summaries. Everything else goes to a thread.',
    sections: [
      {
        heading: 'What it is for',
        body: "A standup exists so that a person who is stuck for a reason someone else can fix gets unstuck today rather than on Thursday. That is the entire purpose.\n\nIt is not for the manager to collect status. If you need status, read the board. A standup that has become a status collection ritual has stopped paying for itself and everyone in it already knows.",
      },
      {
        heading: 'The nine-minute structure',
        body: "One minute of setup: the facilitator names the goal for the week out loud. Six minutes of round-robin, roughly forty seconds each, and the only required content is what you are on today and what would unblock you. Two minutes of parking lot: the facilitator reads back the blockers, assigns each to a named person, and ends the call.\n\nThe timer is not theatre. A standup that ends on time trains people to arrive on time. One that reliably runs long trains people to join late, which is why it runs long.",
      },
      {
        heading: 'Kill the yesterday question',
        body: "'What did you do yesterday' is the question that turns a standup into a performance. It invites justification, and justification is long. Nobody has ever been unblocked by hearing what someone did yesterday.\n\nDrop it. If yesterday matters — because something broke or something shipped — it will come up on its own under 'today'.",
      },
      {
        heading: 'Take it to the thread',
        body: "The facilitator's most valuable phrase is 'let's take that to the thread'. Use it the moment two people start solving something in front of eight people who do not need to hear it.\n\nThe rule works only if the thread actually happens. Post it yourself, immediately, tagging both people. A parking lot that never gets parked in is just a way of ending conversations.",
      },
    ],
    steps: [
      'Facilitator states the weekly goal in one sentence',
      'Round-robin: today, and what would unblock you',
      'No yesterday, no narration, no demos',
      'Facilitator reads back blockers with owners',
      'End on time even if it is quiet',
    ],
    template: {
      title: 'Standup notes',
      body: 'GOAL THIS WEEK — Checkout flow behind a flag for 10% of traffic.\n\nBLOCKERS\n• Ana — needs staging DB refreshed. Owner: Priya. Today.\n• Marcus — waiting on copy for the error states. Owner: Jo. Tomorrow.\n\nPARKED\n• Whether to keep the old checkout URL alive. Thread started.',
    },
    pitfalls: [
      'Letting it become a status report for a manager',
      'Solving problems live in front of people who are not involved',
      'Skipping it when things are busy — that is when it earns its keep',
      'A parking lot that nobody ever revisits',
    ],
  },
  {
    id: 'project-brief',
    title: 'The one-page project brief',
    deck: 'If it does not fit on one page, the project is not understood yet.',
    category: 'Projects',
    minutes: 6,
    pro: false,
    icon: 'file-text',
    hue: 'mint',
    gist: 'Problem, outcome, non-goals, owner, date. Everything else is detail.',
    sections: [
      {
        heading: 'Five things, one page',
        body: "The problem in the customer's words. The outcome you would accept as success, expressed as something you can measure or at least observe. The non-goals — the things a reasonable person might assume are in scope and are not. One owner, a human name, not a team. And a date you are willing to be held to.\n\nA project with all five is legible to anyone in the company. A project missing any one of them will produce an argument later, and the argument will be about the missing one.",
      },
      {
        heading: 'Non-goals are the load-bearing section',
        body: "Scope does not creep because people are undisciplined. It creeps because two people held different reasonable assumptions and neither said so out loud.\n\nWriting non-goals is uncomfortable — you are pre-emptively disappointing someone — which is exactly why it is valuable. Do it in the brief, in writing, in week one, when disappointing someone costs an afternoon rather than a quarter.",
      },
      {
        heading: 'One owner, and mean it',
        body: "Shared ownership is unowned. If two names are on the brief, write which one makes the call when they disagree.\n\nThis is not about hierarchy. It is about the fact that every project reaches a moment where a decision must be made with incomplete information, and the difference between a good project and a stalled one is whether anyone is allowed to make it.",
      },
      {
        heading: 'Date it and revisit it',
        body: "A brief written once and never touched becomes fiction within a month, and everyone quietly stops trusting it. Put the date at the top. When something material changes, edit the brief and say in the space that you did.\n\nA living brief is the cheapest coordination tool that exists. It replaces roughly one meeting a week.",
      },
    ],
    steps: [
      'State the problem in the customer’s words, not the solution',
      'Define the outcome as something observable',
      'List three non-goals',
      'Name one owner, and the tiebreaker',
      'Put a date on the top and update it when reality moves',
    ],
    template: {
      title: 'Project brief',
      body: 'PROBLEM — New customers who sign up on mobile abandon before they connect a data source. Support hears "I did not know what to do next" roughly twice a week.\n\nOUTCOME — 60% of mobile signups connect a source within 24 hours, up from 31%.\n\nNON-GOALS — Not redesigning the desktop onboarding. Not adding new integrations. Not touching billing.\n\nOWNER — Priya. Tiebreaker on scope: Priya. Tiebreaker on ship date: Dana.\n\nDATE — Draft Mar 3. Target Apr 18.',
    },
    pitfalls: [
      'Describing the solution in the problem statement',
      'An outcome nobody can check',
      'Two owners and no tiebreaker',
      'A brief that is never edited after week one',
    ],
  },
  {
    id: 'deep-work',
    title: 'A deep work block that survives contact',
    deck: 'Protecting focus is a scheduling problem, not a willpower problem.',
    category: 'Focus',
    minutes: 5,
    pro: false,
    icon: 'target',
    hue: 'amber',
    gist: 'Book it, name it, defend it once, and let the calendar do the rest.',
    sections: [
      {
        heading: 'Willpower is the wrong tool',
        body: "Most advice about focus is about resisting interruption. That framing loses, because it puts a renewable resource — other people's needs — against a depleting one, your attention.\n\nThe winning move is structural. Make the block visible, make it recurring, and make it boring. Nobody argues with a recurring calendar event that has been there for four months.",
      },
      {
        heading: 'Name the block after the work',
        body: "'Focus time' invites a request to move it. 'Q2 pricing model' does not, because it looks like a commitment to someone else.\n\nThis is a small trick and it works reliably. Give the block the name of the deliverable it produces, and it stops reading as a preference and starts reading as an obligation.",
      },
      {
        heading: 'Defend it once, publicly',
        body: "The first time someone books over your block, say no in a way other people can see — in the channel, not in a DM. 'I've got the pricing model blocked then; can we do 3pm?' Once.\n\nAfter that, you rarely have to do it again. The norm gets set by the first exception, and you only get one chance to set it.",
      },
      {
        heading: 'End with a landing note',
        body: "The expensive part of deep work is not starting, it is restarting. Spend the last three minutes writing down exactly where you are and what the next move is.\n\nTomorrow you will not have to reconstruct the state of your own head, which is usually the first twenty minutes of any session. Three minutes buys twenty. Do it every time.",
      },
    ],
    steps: [
      'Book a recurring block, same time, at least twice a week',
      'Name it after the deliverable',
      'Turn off every notification for the duration',
      'Defend it publicly the first time it is challenged',
      'Spend the last three minutes writing a landing note',
    ],
    template: {
      title: 'Landing note',
      body: 'WHERE I STOPPED — Pricing model v3, tab "scenarios". Rows 40-72 are done; the enterprise tier assumptions are still copied from v2 and are probably wrong.\n\nNEXT MOVE — Rebuild the enterprise tier from the three closed deals in Q4, not from the old assumptions.\n\nOPEN QUESTION — Does the 15% partner discount stack with volume? Ask Dana.',
    },
    pitfalls: [
      'Booking it once instead of recurring',
      'Calling it "focus time"',
      'Letting the first override slide',
      'Ending abruptly with nothing written down',
    ],
  },
];
